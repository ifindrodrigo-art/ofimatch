-- =====================================================================
-- OfiMatch — esquema completo para Supabase
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO → Run.
-- Se puede volver a correr: borra y recrea todo (incluye datos demo).
-- =====================================================================

-- ---------- Limpieza (permite re-ejecutar) ----------
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.ratings cascade;
drop table if exists public.contacts cascade;
drop table if exists public.requests cascade;
drop table if exists public.profiles cascade;
drop function if exists public.demand_by_district(text) cascade;
drop function if exists public.counterpart_contact(uuid) cascade;
drop schema if exists private cascade;

create schema private;
grant usage on schema private to anon, authenticated;

-- ---------- Tablas ----------
create table public.profiles (
  id           uuid primary key default gen_random_uuid(),
  auth_id      uuid unique references auth.users (id) on delete cascade,
  role         text not null check (role in ('trabajador', 'cliente')),
  full_name    text not null check (char_length(full_name) between 2 and 80),
  district     text not null,
  lat          double precision not null,
  lng          double precision not null,
  oficio       text check (oficio in ('electricista', 'gasfitero', 'albanil', 'soldador')),
  years_exp    int check (years_exp between 0 and 60),
  bio          text check (char_length(bio) <= 400),
  available    boolean not null default true,
  rating_sum   numeric not null default 0,
  rating_count int not null default 0,
  jobs_done    int not null default 0,
  is_demo      boolean not null default false,
  created_at   timestamptz not null default now()
);
create index profiles_auth_id_idx on public.profiles (auth_id);
create index profiles_oficio_idx on public.profiles (oficio) where role = 'trabajador';

-- El teléfono vive aparte: solo lo ve uno mismo o la contraparte de un trabajo aceptado.
create table public.contacts (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  phone      text not null check (char_length(phone) between 6 and 20)
);

create table public.requests (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles (id) on delete cascade,
  worker_id    uuid references public.profiles (id) on delete set null,
  oficio       text not null check (oficio in ('electricista', 'gasfitero', 'albanil', 'soldador')),
  description  text not null check (char_length(description) between 5 and 500),
  district     text not null,
  lat          double precision not null,
  lng          double precision not null,
  urgency      text not null check (urgency in ('ahora', 'hoy', 'semana')),
  status       text not null default 'pendiente'
               check (status in ('pendiente', 'aceptada', 'en_camino', 'completada', 'rechazada', 'cancelada')),
  match_score  numeric,
  amount       numeric check (amount >= 0),
  created_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  completed_at timestamptz
);
create index requests_client_idx on public.requests (client_id);
create index requests_worker_idx on public.requests (worker_id);
create index requests_oficio_idx on public.requests (oficio, district);

create table public.ratings (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.requests (id) on delete cascade,
  rater_id    uuid not null references public.profiles (id) on delete cascade,
  ratee_id    uuid not null references public.profiles (id) on delete cascade,
  s1          smallint not null check (s1 between 1 and 5),
  s2          smallint not null check (s2 between 1 and 5),
  s3          smallint not null check (s3 between 1 and 5),
  stars       numeric generated always as (round((s1 + s2 + s3) / 3.0, 2)) stored,
  comment     text check (char_length(comment) <= 300),
  revealed    boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (request_id, rater_id)
);
create index ratings_request_idx on public.ratings (request_id);
create index ratings_ratee_idx on public.ratings (ratee_id) where revealed;
create index ratings_rater_idx on public.ratings (rater_id);

-- ---------- Helpers privados (schema no expuesto por la API) ----------
create function private.my_profile_id()
returns uuid language sql stable security definer set search_path = ''
as $$ select id from public.profiles where auth_id = (select auth.uid()) $$;
revoke execute on function private.my_profile_id() from public;
grant execute on function private.my_profile_id() to anon, authenticated;

-- Crea el perfil y el contacto al registrarse (datos del formulario de registro).
create function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  m jsonb := new.raw_user_meta_data;
  pid uuid;
begin
  if m ? 'role' then
    insert into public.profiles (auth_id, role, full_name, district, lat, lng, oficio, years_exp, bio)
    values (
      new.id,
      m->>'role',
      coalesce(nullif(m->>'full_name', ''), 'Usuario'),
      coalesce(m->>'district', 'Lima'),
      coalesce((m->>'lat')::double precision, -12.046),
      coalesce((m->>'lng')::double precision, -77.043),
      case when m->>'role' = 'trabajador' then m->>'oficio' end,
      case when m->>'role' = 'trabajador' then nullif(m->>'years_exp', '')::int end,
      case when m->>'role' = 'trabajador' then nullif(m->>'bio', '') end
    )
    returning id into pid;
    if coalesce(m->>'phone', '') <> '' then
      insert into public.contacts (profile_id, phone) values (pid, m->>'phone');
    end if;
  end if;
  return new;
end $$;
revoke execute on function private.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Reglas de estados de una solicitud (quién puede mover qué).
create function private.check_request_update()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.my_profile_id();
  worker_is_demo boolean;
begin
  if new.client_id <> old.client_id or new.oficio <> old.oficio or new.created_at <> old.created_at then
    raise exception 'No se puede cambiar el cliente, oficio o fecha de una solicitud';
  end if;

  select is_demo into worker_is_demo from public.profiles where id = old.worker_id;

  if me = old.worker_id then
    if new.worker_id is distinct from old.worker_id then
      raise exception 'El trabajador no puede reasignar la solicitud';
    end if;
    if not (
      (old.status = 'pendiente' and new.status in ('aceptada', 'rechazada')) or
      (old.status = 'aceptada'  and new.status in ('en_camino', 'completada')) or
      (old.status = 'en_camino' and new.status = 'completada') or
      (old.status = new.status)
    ) then
      raise exception 'Cambio de estado no permitido: % → %', old.status, new.status;
    end if;
  elsif me = old.client_id then
    if old.status = 'rechazada' and new.status = 'pendiente' then
      null; -- reasignar a otro trabajador
    elsif new.worker_id is distinct from old.worker_id then
      raise exception 'Solo se puede reasignar una solicitud rechazada';
    elsif new.status = 'cancelada' and old.status in ('pendiente', 'rechazada', 'aceptada') then
      null;
    elsif coalesce(worker_is_demo, false) and old.status in ('aceptada', 'en_camino') and new.status = 'completada' then
      null; -- con perfiles demo el cliente cierra el trabajo
    elsif new.status <> old.status then
      raise exception 'Cambio de estado no permitido para el cliente';
    end if;
  end if;

  if new.status = 'aceptada' and old.status <> 'aceptada' then new.accepted_at := now(); end if;
  if new.status = 'completada' and old.status <> 'completada' then
    new.completed_at := now();
    update public.profiles set jobs_done = jobs_done + 1 where id = new.worker_id;
  end if;
  return new;
end $$;
revoke execute on function private.check_request_update() from public;

create trigger requests_check_update
  before update on public.requests
  for each row execute function private.check_request_update();

-- Los perfiles demo aceptan solos (para poder mostrar el flujo completo en clase).
create function private.demo_auto_accept()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status <> 'pendiente' then
    raise exception 'Una solicitud nueva siempre empieza como pendiente';
  end if;
  new.accepted_at := null; new.completed_at := null; new.amount := null; new.created_at := now();
  if exists (select 1 from public.profiles where id = new.worker_id and is_demo) then
    new.status := 'aceptada';
    new.accepted_at := now();
  end if;
  return new;
end $$;
revoke execute on function private.demo_auto_accept() from public;

create trigger requests_demo_insert
  before insert on public.requests
  for each row when (current_user in ('anon', 'authenticated'))
  execute function private.demo_auto_accept();

-- Valida la calificación y aplica el REVELADO SIMULTÁNEO.
create function private.validate_rating()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare r public.requests;
begin
  select * into r from public.requests where id = new.request_id;
  if r.status <> 'completada' then
    raise exception 'Solo se califica un trabajo completado';
  end if;
  if not ((new.rater_id = r.client_id and new.ratee_id = r.worker_id) or
          (new.rater_id = r.worker_id and new.ratee_id = r.client_id)) then
    raise exception 'Solo las partes del trabajo pueden calificarse entre sí';
  end if;
  new.revealed := false;
  return new;
end $$;
revoke execute on function private.validate_rating() from public;

create trigger ratings_validate
  before insert on public.ratings
  for each row execute function private.validate_rating();

create function private.reveal_ratings()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  other public.ratings;
  r public.requests;
begin
  select * into r from public.requests where id = new.request_id;

  -- Perfil demo: responde con su propia calificación para cerrar el ciclo.
  if new.rater_id = r.client_id
     and exists (select 1 from public.profiles where id = r.worker_id and is_demo)
     and not exists (select 1 from public.ratings where request_id = new.request_id and rater_id = r.worker_id) then
    insert into public.ratings (request_id, rater_id, ratee_id, s1, s2, s3, comment)
    values (new.request_id, r.worker_id, r.client_id, 5, 5, 4, 'Cliente claro con lo que necesitaba y pagó a tiempo.');
    return new;
  end if;

  select * into other from public.ratings
   where request_id = new.request_id and rater_id = new.ratee_id;

  if found then
    update public.ratings set revealed = true where request_id = new.request_id;
    update public.profiles set rating_sum = rating_sum + new.stars, rating_count = rating_count + 1 where id = new.ratee_id;
    update public.profiles set rating_sum = rating_sum + other.stars, rating_count = rating_count + 1 where id = other.ratee_id;
  end if;
  return new;
end $$;
revoke execute on function private.reveal_ratings() from public;

create trigger ratings_reveal
  after insert on public.ratings
  for each row execute function private.reveal_ratings();

-- ---------- Funciones públicas (solo devuelven datos no sensibles) ----------
-- Mapa de demanda: conteos agregados por distrito y franja horaria. No expone personas.
create function public.demand_by_district(p_oficio text)
returns table (district text, lat double precision, lng double precision,
               total bigint, manana bigint, tarde bigint, noche bigint)
language sql stable security definer set search_path = ''
as $$
  select r.district, avg(r.lat), avg(r.lng), count(*),
         count(*) filter (where extract(hour from r.created_at at time zone 'America/Lima') between 6 and 11),
         count(*) filter (where extract(hour from r.created_at at time zone 'America/Lima') between 12 and 17),
         count(*) filter (where extract(hour from r.created_at at time zone 'America/Lima') not between 6 and 17)
    from public.requests r
   where r.oficio = p_oficio and r.created_at > now() - interval '60 days'
   group by r.district
   order by count(*) desc
$$;
revoke execute on function public.demand_by_district(text) from public;
grant execute on function public.demand_by_district(text) to anon, authenticated;

-- Teléfono de la contraparte: solo si hay un trabajo aceptado/en curso/completado entre ambos.
create function public.counterpart_contact(p_request uuid)
returns text language sql stable security definer set search_path = ''
as $$
  select c.phone
    from public.requests r
    join public.contacts c
      on c.profile_id = case when r.client_id = private.my_profile_id() then r.worker_id else r.client_id end
   where r.id = p_request
     and r.status in ('aceptada', 'en_camino', 'completada')
     and private.my_profile_id() in (r.client_id, r.worker_id)
$$;
revoke execute on function public.counterpart_contact(uuid) from public;
grant execute on function public.counterpart_contact(uuid) to authenticated;

-- ---------- Permisos (GRANT) + RLS ----------
revoke all on public.profiles, public.contacts, public.requests, public.ratings from anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant update (full_name, district, lat, lng, oficio, years_exp, bio, available) on public.profiles to authenticated;
grant select, update (phone) on public.contacts to authenticated;
grant select, insert on public.requests to authenticated;
grant update (status, worker_id, amount, match_score) on public.requests to authenticated;
grant select on public.ratings to anon, authenticated;
grant insert (request_id, rater_id, ratee_id, s1, s2, s3, comment) on public.ratings to authenticated;

alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.requests enable row level security;
alter table public.ratings  enable row level security;

-- profiles: directorio público; cada quien edita solo el suyo.
create policy "perfiles visibles" on public.profiles for select to anon, authenticated using (true);
create policy "editar mi perfil" on public.profiles for update to authenticated
  using (auth_id = (select auth.uid())) with check (auth_id = (select auth.uid()));

-- contacts: solo el propio.
create policy "ver mi contacto" on public.contacts for select to authenticated
  using (profile_id = (select private.my_profile_id()));
create policy "editar mi contacto" on public.contacts for update to authenticated
  using (profile_id = (select private.my_profile_id())) with check (profile_id = (select private.my_profile_id()));

-- requests: solo las partes.
create policy "crear solicitud" on public.requests for insert to authenticated
  with check (client_id = (select private.my_profile_id()) and status in ('pendiente', 'aceptada'));
create policy "ver mis solicitudes" on public.requests for select to authenticated
  using ((select private.my_profile_id()) in (client_id, worker_id));
create policy "actualizar mis solicitudes" on public.requests for update to authenticated
  using ((select private.my_profile_id()) in (client_id, worker_id))
  with check ((select private.my_profile_id()) in (client_id, worker_id));

-- ratings: veo la mía siempre; la del otro solo cuando ambas están (revelado simultáneo).
create policy "ver calificaciones" on public.ratings for select to anon, authenticated
  using (revealed or rater_id = (select private.my_profile_id()));
create policy "calificar" on public.ratings for insert to authenticated
  with check (rater_id = (select private.my_profile_id()));

-- =====================================================================
-- DATOS DEMO: trabajadores de ejemplo + historial para el mapa de demanda
-- (marcados con is_demo = true; se pueden borrar cuando haya usuarios reales)
-- =====================================================================
insert into public.profiles (role, full_name, district, lat, lng, oficio, years_exp, bio, available, rating_sum, rating_count, jobs_done, is_demo) values
 ('trabajador','Julio Quispe','San Juan de Lurigancho',-11.985,-77.005,'electricista',14,'Instalaciones domiciliarias, tableros y pozo a tierra. Trabajo limpio y con boleta.',true,  88.4,19,41,true),
 ('trabajador','Rosa Huamán','Los Olivos',-11.968,-77.071,'electricista',9,'Cortocircuitos, cableado nuevo y luminarias LED para casas y bodegas.',true,           61.2,13,27,true),
 ('trabajador','Marco Paredes','Santiago de Surco',-12.136,-76.993,'electricista',21,'Electricista industrial y residencial. Certificado SENCICO.',false,                 113.6,24,63,true),
 ('trabajador','Kevin Ramos','Ate',-12.027,-76.918,'electricista',4,'Atiendo emergencias en Ate, Santa Anita y La Molina.',true,                                   21.0,5,8,true),
 ('trabajador','Luis Cárdenas','San Martín de Porres',-12.003,-77.062,'electricista',11,'Tomacorrientes, llaves térmicas y medidores.',true,                         40.5,9,22,true),
 ('trabajador','Pedro Ccahuana','Comas',-11.935,-77.050,'gasfitero',17,'Fugas de agua, termas, desatoros y redes de desagüe.',true,                                 75.6,16,48,true),
 ('trabajador','Elena Torres','Miraflores',-12.121,-77.029,'gasfitero',8,'Gasfitería fina: griferías, inodoros y cambio de tuberías.',true,                         42.3,9,19,true),
 ('trabajador','Jhonatan Vílchez','Villa El Salvador',-12.212,-76.937,'gasfitero',6,'Instalación de tanques, bombas y termas a gas.',true,                         27.6,6,12,true),
 ('trabajador','César Mamani','Chorrillos',-12.170,-77.015,'gasfitero',12,'Desatoros con máquina y detección de fugas sin romper.',false,                          56.0,12,30,true),
 ('trabajador','Wilmer Huanca','Puente Piedra',-11.866,-77.075,'albanil',19,'Construcción, tarrajeo, enchapes y ampliaciones de segundo piso.',true,               90.2,20,37,true),
 ('trabajador','Santos Rojas','San Juan de Miraflores',-12.157,-76.970,'albanil',25,'Maestro de obra. Cimentación, columnas y losas.',true,                           121.5,26,55,true),
 ('trabajador','Diana Flores','Carabayllo',-11.860,-77.030,'albanil',7,'Acabados: pintura, drywall y cerámicos.',true,                                             30.8,7,14,true),
 ('trabajador','Alex Gutiérrez','La Victoria',-12.068,-77.017,'albanil',10,'Remodelación de cocinas y baños.',true,                                               38.0,9,18,true),
 ('trabajador','Raúl Espinoza','Independencia',-11.990,-77.050,'soldador',15,'Puertas, rejas y estructuras metálicas a medida.',true,                              64.8,14,33,true),
 ('trabajador','Iván Salazar','Callao',-12.060,-77.130,'soldador',22,'Soldadura MIG/TIG, techos metálicos y escaleras.',true,                                     98.4,21,49,true),
 ('trabajador','Brenda Castillo','Ate',-12.027,-76.918,'soldador',5,'Rejas, barandas y reparaciones a domicilio.',true,                                           17.6,4,7,true),
 ('cliente','Cliente demo','Lima',-12.046,-77.043,null,null,null,true,0,0,0,true);

insert into public.contacts (profile_id, phone)
select id, '9' || lpad((10000000 + (row_number() over ()) * 7351)::text, 8, '0')
  from public.profiles where is_demo and role = 'trabajador';

-- Historial de solicitudes de los últimos 60 días (alimenta el mapa de demanda).
with d(district, lat, lng, w) as (values
  ('San Juan de Lurigancho',-11.985,-77.005,9),('San Martín de Porres',-12.003,-77.062,7),('Ate',-12.027,-76.918,7),
  ('Comas',-11.935,-77.050,6),('Villa El Salvador',-12.212,-76.937,6),('Los Olivos',-11.968,-77.071,5),
  ('Santiago de Surco',-12.136,-76.993,5),('San Juan de Miraflores',-12.157,-76.970,4),('Carabayllo',-11.860,-77.030,3),
  ('Chorrillos',-12.170,-77.015,4),('La Molina',-12.085,-76.937,3),('Miraflores',-12.121,-77.029,3),
  ('Callao',-12.060,-77.130,4),('Puente Piedra',-11.866,-77.075,3),('La Victoria',-12.068,-77.017,3),('Lima',-12.046,-77.043,3)
), o(oficio, f) as (values ('electricista', 1.0), ('gasfitero', 0.9), ('albanil', 0.7), ('soldador', 0.5))
insert into public.requests (client_id, worker_id, oficio, description, district, lat, lng, urgency, status, created_at)
select (select id from public.profiles where role = 'cliente' and is_demo limit 1), null, o.oficio,
       'Solicitud histórica de demostración', d.district, d.lat, d.lng,
       (array['ahora','hoy','semana'])[1 + floor(random() * 3)::int], 'completada',
       now() - (random() * interval '58 days') - make_interval(hours => (array[2, 6, 9, 13])[1 + floor(random() * 4)::int])
  from d cross join o cross join lateral generate_series(1, greatest(1, round(d.w * o.f * (0.6 + random()))::int)) g;

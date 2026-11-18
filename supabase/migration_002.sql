-- =====================================================================
-- OfiMatch, migración 002: 9 oficios, precio "desde" y portafolio de fotos
-- Se corre DESPUÉS de schema.sql. No borra usuarios ni pedidos.
-- Supabase → SQL Editor → New query → pegar todo → Run. Se puede repetir.
-- =====================================================================

-- ---------- 9 oficios ----------
alter table public.profiles drop constraint if exists profiles_oficio_check;
alter table public.profiles add constraint profiles_oficio_check check (oficio in
  ('electricista','gasfitero','albanil','soldador','pintor','carpintero','cerrajero','climatizacion','drywall'));

alter table public.requests drop constraint if exists requests_oficio_check;
alter table public.requests add constraint requests_oficio_check check (oficio in
  ('electricista','gasfitero','albanil','soldador','pintor','carpintero','cerrajero','climatizacion','drywall'));

-- ---------- Precio desde + trabajo destacado ----------
alter table public.profiles add column if not exists price_from numeric;
alter table public.profiles drop constraint if exists profiles_price_from_check;
alter table public.profiles add constraint profiles_price_from_check check (price_from is null or price_from between 0 and 100000);
alter table public.profiles add column if not exists work_label text;
alter table public.profiles drop constraint if exists profiles_work_label_check;
alter table public.profiles add constraint profiles_work_label_check check (work_label is null or char_length(work_label) <= 60);

grant update (price_from, work_label) on public.profiles to authenticated;

-- El registro ahora guarda también el precio desde.
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  m jsonb := new.raw_user_meta_data;
  pid uuid;
begin
  if m ? 'role' then
    insert into public.profiles (auth_id, role, full_name, district, lat, lng, oficio, years_exp, bio, price_from)
    values (
      new.id,
      m->>'role',
      coalesce(nullif(m->>'full_name', ''), 'Usuario'),
      coalesce(m->>'district', 'Lima'),
      coalesce((m->>'lat')::double precision, -12.046),
      coalesce((m->>'lng')::double precision, -77.043),
      case when m->>'role' = 'trabajador' then m->>'oficio' end,
      case when m->>'role' = 'trabajador' then nullif(m->>'years_exp', '')::int end,
      case when m->>'role' = 'trabajador' then nullif(m->>'bio', '') end,
      case when m->>'role' = 'trabajador' then nullif(m->>'price_from', '')::numeric end
    )
    returning id into pid;
    if coalesce(m->>'phone', '') <> '' then
      insert into public.contacts (profile_id, phone) values (pid, m->>'phone');
    end if;
  end if;
  return new;
end $$;
revoke execute on function private.handle_new_user() from public;

-- ---------- Portafolio de fotos ----------
create table if not exists public.portfolio_items (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  path       text not null check (char_length(path) <= 300),
  caption    text check (caption is null or char_length(caption) <= 80),
  created_at timestamptz not null default now()
);
create index if not exists portfolio_profile_idx on public.portfolio_items (profile_id, created_at desc);

-- Máximo 12 fotos por trabajador.
create or replace function private.portfolio_limit()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.portfolio_items where profile_id = new.profile_id) >= 12 then
    raise exception 'Puedes tener hasta 12 fotos. Borra una para subir otra.';
  end if;
  return new;
end $$;
revoke execute on function private.portfolio_limit() from public;
drop trigger if exists portfolio_limit on public.portfolio_items;
create trigger portfolio_limit before insert on public.portfolio_items
  for each row execute function private.portfolio_limit();

revoke all on public.portfolio_items from anon, authenticated;
grant select on public.portfolio_items to anon, authenticated;
grant insert (profile_id, path, caption) on public.portfolio_items to authenticated;
grant delete on public.portfolio_items to authenticated;
alter table public.portfolio_items enable row level security;

drop policy if exists "portafolio visible" on public.portfolio_items;
create policy "portafolio visible" on public.portfolio_items for select to anon, authenticated using (true);
drop policy if exists "subir a mi portafolio" on public.portfolio_items;
create policy "subir a mi portafolio" on public.portfolio_items for insert to authenticated
  with check (profile_id = (select private.my_profile_id()) and split_part(path, '/', 1) = (select auth.uid())::text);
drop policy if exists "borrar de mi portafolio" on public.portfolio_items;
create policy "borrar de mi portafolio" on public.portfolio_items for delete to authenticated
  using (profile_id = (select private.my_profile_id()));

-- Archivos: bucket público de solo lectura; cada usuario escribe solo en su carpeta (su id).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portafolio', 'portafolio', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "portafolio: subir en mi carpeta" on storage.objects;
create policy "portafolio: subir en mi carpeta" on storage.objects for insert to authenticated
  with check (bucket_id = 'portafolio' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "portafolio: borrar de mi carpeta" on storage.objects;
create policy "portafolio: borrar de mi carpeta" on storage.objects for delete to authenticated
  using (bucket_id = 'portafolio' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------- Datos demo ----------
-- Precio y trabajo destacado de los 16 perfiles demo originales.
update public.profiles p set price_from = v.price, work_label = v.work
from (values
  ('Julio Quispe', 70, 'Pozo a tierra'), ('Rosa Huamán', 50, 'Luminarias LED'), ('Marco Paredes', 90, 'Tablero trifásico'),
  ('Kevin Ramos', 45, 'Emergencia eléctrica'), ('Luis Cárdenas', 50, 'Llave térmica'), ('Pedro Ccahuana', 60, 'Terma a gas'),
  ('Elena Torres', 55, 'Grifería de baño'), ('Jhonatan Vílchez', 80, 'Bomba de agua'), ('César Mamani', 70, 'Desatoro con máquina'),
  ('Wilmer Huanca', 130, 'Segundo piso'), ('Santos Rojas', 150, 'Losa aligerada'), ('Diana Flores', 90, 'Drywall y pintura'),
  ('Alex Gutiérrez', 110, 'Cocina remodelada'), ('Raúl Espinoza', 180, 'Puerta metálica'), ('Iván Salazar', 220, 'Techo metálico'),
  ('Brenda Castillo', 120, 'Baranda de escalera')
) as v(name, price, work)
where p.is_demo and p.full_name = v.name;

-- 16 perfiles demo nuevos (incluye los 5 oficios nuevos). Solo se insertan si no existen.
insert into public.profiles (role, full_name, district, lat, lng, oficio, years_exp, bio, available, rating_sum, rating_count, jobs_done, price_from, work_label, is_demo)
select 'trabajador', v.name, v.district, v.lat, v.lng, v.oficio, v.years, v.bio, v.avail, round(v.rating * v.reviews, 1), v.reviews, v.jobs, v.price, v.work, true
from (values
  ('Carlos Huamán','Surquillo',-12.113,-77.010,'electricista',12,'Instalo tomacorrientes, luminarias y tableros domiciliarios.',true,4.9,127,140,60,'Tablero domiciliario'),
  ('Rosa Quispe','Miraflores',-12.121,-77.029,'gasfitero',9,'Reparo fugas, instalo termas y griferías en el mismo día.',true,5.0,84,90,50,'Grifería de cocina'),
  ('Jorge Mendoza','San Isidro',-12.097,-77.036,'albanil',18,'Tarrajeo, enchapes y ampliaciones pequeñas con acabado fino.',false,4.8,63,70,120,'Enchape de baño'),
  ('Luis Ccori','La Molina',-12.085,-76.937,'soldador',15,'Rejas, puertas metálicas y estructuras a medida.',true,4.9,52,58,150,'Reja de fachada'),
  ('Miguel Paredes','San Borja',-12.100,-77.000,'electricista',20,'Pozo a tierra con certificado y revisión de instalaciones.',false,4.7,98,105,450,'Pozo a tierra'),
  ('Ana Torres','Santiago de Surco',-12.136,-76.993,'pintor',10,'Pintura de interiores y fachadas, cuidando muebles y pisos.',true,4.9,71,80,90,'Sala y comedor'),
  ('Pedro Salazar','Miraflores',-12.121,-77.029,'cerrajero',14,'Apertura de puertas y cambio de chapas a cualquier hora.',true,4.8,140,160,45,'Chapa de seguridad'),
  ('Diego Ramos','San Isidro',-12.097,-77.036,'climatizacion',3,'Instalación y mantenimiento de aire acondicionado split.',false,4.9,39,42,140,'Split 12 000 BTU'),
  ('Raúl Cárdenas','Surquillo',-12.113,-77.010,'carpintero',16,'Muebles de melamina a medida: cocinas, closets y escritorios.',true,4.8,46,50,350,'Closet de melamina'),
  ('Lucía Vargas','Miraflores',-12.121,-77.029,'drywall',4,'Falso techo, divisiones de drywall y reparación de goteras.',true,4.9,22,25,160,'Falso techo'),
  ('Óscar Rojas','San Borja',-12.100,-77.000,'gasfitero',13,'Destapo desagües y cambio tuberías sin romper de más.',false,4.8,112,120,70,'Desagüe de cocina'),
  ('Marco Chávez','Surquillo',-12.113,-77.010,'pintor',11,'Empaste y pintura de departamentos completos, listos para entregar.',true,4.7,58,64,650,'Depa de 2 dormitorios'),
  ('Teodoro Aquino','Comas',-11.935,-77.050,'carpintero',22,'Puertas, closets y reparación de muebles de madera.',true,4.6,31,35,120,'Puerta contraplacada'),
  ('Jhon Ccanto','Los Olivos',-11.968,-77.071,'cerrajero',7,'Cambio de chapas, duplicado de llaves y apertura de autos.',true,4.7,44,50,40,'Chapa de puerta'),
  ('Kelly Rivas','Ate',-12.027,-76.918,'climatizacion',6,'Mantenimiento de split y ventiladores para casas y negocios.',true,4.8,27,30,120,'Mantenimiento de split'),
  ('Nilton Huarcaya','San Martín de Porres',-12.003,-77.062,'drywall',9,'Divisiones, cielo raso y muebles de drywall para casas y oficinas.',false,4.7,33,36,140,'Cielo raso')
) as v(name, district, lat, lng, oficio, years, bio, avail, rating, reviews, jobs, price, work)
where not exists (select 1 from public.profiles p where p.is_demo and p.full_name = v.name);

insert into public.contacts (profile_id, phone)
select p.id, '9' || lpad((20000000 + (row_number() over (order by p.full_name)) * 6113)::text, 8, '0')
  from public.profiles p
 where p.is_demo and p.role = 'trabajador'
   and not exists (select 1 from public.contacts c where c.profile_id = p.id);

-- Historial de demanda para los 5 oficios nuevos (solo si aún no hay).
with d(district, lat, lng, w) as (values
  ('San Juan de Lurigancho',-11.985,-77.005,9),('San Martín de Porres',-12.003,-77.062,7),('Ate',-12.027,-76.918,7),
  ('Comas',-11.935,-77.050,6),('Villa El Salvador',-12.212,-76.937,6),('Los Olivos',-11.968,-77.071,5),
  ('Santiago de Surco',-12.136,-76.993,6),('San Juan de Miraflores',-12.157,-76.970,4),('Miraflores',-12.121,-77.029,5),
  ('San Isidro',-12.097,-77.036,4),('Surquillo',-12.113,-77.010,4),('San Borja',-12.100,-77.000,3),
  ('La Molina',-12.085,-76.937,4),('Callao',-12.060,-77.130,3),('La Victoria',-12.068,-77.017,3),('Lima',-12.046,-77.043,3)
), o(oficio, f) as (values ('pintor', 0.8), ('carpintero', 0.5), ('cerrajero', 0.7), ('climatizacion', 0.45), ('drywall', 0.45))
insert into public.requests (client_id, worker_id, oficio, description, district, lat, lng, urgency, status, created_at)
select (select id from public.profiles where role = 'cliente' and is_demo limit 1), null, o.oficio,
       'Solicitud histórica de demostración', d.district, d.lat, d.lng,
       (array['ahora','hoy','semana'])[1 + floor(random() * 3)::int], 'completada',
       now() - (random() * interval '58 days') - make_interval(hours => (array[2, 6, 9, 13])[1 + floor(random() * 4)::int])
  from d cross join o cross join lateral generate_series(1, greatest(1, round(d.w * o.f * (0.6 + random()))::int)) g
 where not exists (select 1 from public.requests r where r.oficio = o.oficio);

-- =====================================================================
-- OfiMatch, limpieza: borra TODOS los perfiles de demostración y la cuenta
-- "Prueba Cliente", con sus pedidos, calificaciones, contactos y la demanda demo.
-- Se conservan los usuarios reales (Rodrigo y Daniel). NO se puede deshacer.
-- Supabase → SQL Editor → New query → pegar todo → Run.
-- =====================================================================

-- 1) Cuenta de prueba (se borra su usuario y, en cascada, su perfil y sus pedidos).
delete from auth.users
 where id in (select auth_id from public.profiles where full_name = 'Prueba Cliente' and not is_demo and auth_id is not null);

-- 2) Perfiles demo (32 técnicos + Cliente demo). En cascada se van sus pedidos
--    históricos de demanda, contactos, calificaciones y fotos registradas.
delete from public.profiles where is_demo;

-- 3) Verificación: deben quedar solo los usuarios reales.
select full_name, role, oficio, district from public.profiles order by created_at;

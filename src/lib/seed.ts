// Mismos perfiles demo que supabase/schema.sql + migration_002.sql
// (para el modo demo y como respaldo de la portada antes de cargar la base de datos).
import type { Profile } from "./types";
import type { OficioId } from "./data";

type Row = [string, string, number, number, OficioId, number, string, boolean, number, number, number, number, string];
// nombre, distrito, lat, lng, oficio, años, bio, disponible, suma de notas, nº notas, trabajos, precio desde, trabajo destacado

const ROWS: Row[] = [
  ["Julio Quispe", "San Juan de Lurigancho", -11.985, -77.005, "electricista", 14, "Instalaciones domiciliarias, tableros y pozo a tierra. Trabajo limpio y con boleta.", true, 88.4, 19, 41, 70, "Pozo a tierra"],
  ["Rosa Huamán", "Los Olivos", -11.968, -77.071, "electricista", 9, "Cortocircuitos, cableado nuevo y luminarias LED para casas y bodegas.", true, 61.2, 13, 27, 50, "Luminarias LED"],
  ["Marco Paredes", "Santiago de Surco", -12.136, -76.993, "electricista", 21, "Electricista industrial y residencial. Certificado SENCICO.", false, 113.6, 24, 63, 90, "Tablero trifásico"],
  ["Kevin Ramos", "Ate", -12.027, -76.918, "electricista", 4, "Atiendo emergencias en Ate, Santa Anita y La Molina.", true, 21.0, 5, 8, 45, "Emergencia eléctrica"],
  ["Luis Cárdenas", "San Martín de Porres", -12.003, -77.062, "electricista", 11, "Tomacorrientes, llaves térmicas y medidores.", true, 40.5, 9, 22, 50, "Llave térmica"],
  ["Pedro Ccahuana", "Comas", -11.935, -77.05, "gasfitero", 17, "Fugas de agua, termas, desatoros y redes de desagüe.", true, 75.6, 16, 48, 60, "Terma a gas"],
  ["Elena Torres", "Miraflores", -12.121, -77.029, "gasfitero", 8, "Gasfitería fina: griferías, inodoros y cambio de tuberías.", true, 42.3, 9, 19, 55, "Grifería de baño"],
  ["Jhonatan Vílchez", "Villa El Salvador", -12.212, -76.937, "gasfitero", 6, "Instalación de tanques, bombas y termas a gas.", true, 27.6, 6, 12, 80, "Bomba de agua"],
  ["César Mamani", "Chorrillos", -12.17, -77.015, "gasfitero", 12, "Desatoros con máquina y detección de fugas sin romper.", false, 56.0, 12, 30, 70, "Desatoro con máquina"],
  ["Wilmer Huanca", "Puente Piedra", -11.866, -77.075, "albanil", 19, "Construcción, tarrajeo, enchapes y ampliaciones de segundo piso.", true, 90.2, 20, 37, 130, "Segundo piso"],
  ["Santos Rojas", "San Juan de Miraflores", -12.157, -76.97, "albanil", 25, "Maestro de obra. Cimentación, columnas y losas.", true, 121.5, 26, 55, 150, "Losa aligerada"],
  ["Diana Flores", "Carabayllo", -11.86, -77.03, "albanil", 7, "Acabados: pintura, drywall y cerámicos.", true, 30.8, 7, 14, 90, "Drywall y pintura"],
  ["Alex Gutiérrez", "La Victoria", -12.068, -77.017, "albanil", 10, "Remodelación de cocinas y baños.", true, 38.0, 9, 18, 110, "Cocina remodelada"],
  ["Raúl Espinoza", "Independencia", -11.99, -77.05, "soldador", 15, "Puertas, rejas y estructuras metálicas a medida.", true, 64.8, 14, 33, 180, "Puerta metálica"],
  ["Iván Salazar", "Callao", -12.06, -77.13, "soldador", 22, "Soldadura MIG/TIG, techos metálicos y escaleras.", true, 98.4, 21, 49, 220, "Techo metálico"],
  ["Brenda Castillo", "Ate", -12.027, -76.918, "soldador", 5, "Rejas, barandas y reparaciones a domicilio.", true, 17.6, 4, 7, 120, "Baranda de escalera"],
  ["Carlos Huamán", "Surquillo", -12.113, -77.01, "electricista", 12, "Instalo tomacorrientes, luminarias y tableros domiciliarios.", true, 622.3, 127, 140, 60, "Tablero domiciliario"],
  ["Rosa Quispe", "Miraflores", -12.121, -77.029, "gasfitero", 9, "Reparo fugas, instalo termas y griferías en el mismo día.", true, 420.0, 84, 90, 50, "Grifería de cocina"],
  ["Jorge Mendoza", "San Isidro", -12.097, -77.036, "albanil", 18, "Tarrajeo, enchapes y ampliaciones pequeñas con acabado fino.", false, 302.4, 63, 70, 120, "Enchape de baño"],
  ["Luis Ccori", "La Molina", -12.085, -76.937, "soldador", 15, "Rejas, puertas metálicas y estructuras a medida.", true, 254.8, 52, 58, 150, "Reja de fachada"],
  ["Miguel Paredes", "San Borja", -12.1, -77.0, "electricista", 20, "Pozo a tierra con certificado y revisión de instalaciones.", false, 460.6, 98, 105, 450, "Pozo a tierra"],
  ["Ana Torres", "Santiago de Surco", -12.136, -76.993, "pintor", 10, "Pintura de interiores y fachadas, cuidando muebles y pisos.", true, 347.9, 71, 80, 90, "Sala y comedor"],
  ["Pedro Salazar", "Miraflores", -12.121, -77.029, "cerrajero", 14, "Apertura de puertas y cambio de chapas a cualquier hora.", true, 672.0, 140, 160, 45, "Chapa de seguridad"],
  ["Diego Ramos", "San Isidro", -12.097, -77.036, "climatizacion", 3, "Instalación y mantenimiento de aire acondicionado split.", false, 191.1, 39, 42, 140, "Split 12 000 BTU"],
  ["Raúl Cárdenas", "Surquillo", -12.113, -77.01, "carpintero", 16, "Muebles de melamina a medida: cocinas, closets y escritorios.", true, 220.8, 46, 50, 350, "Closet de melamina"],
  ["Lucía Vargas", "Miraflores", -12.121, -77.029, "drywall", 4, "Falso techo, divisiones de drywall y reparación de goteras.", true, 107.8, 22, 25, 160, "Falso techo"],
  ["Óscar Rojas", "San Borja", -12.1, -77.0, "gasfitero", 13, "Destapo desagües y cambio tuberías sin romper de más.", false, 537.6, 112, 120, 70, "Desagüe de cocina"],
  ["Marco Chávez", "Surquillo", -12.113, -77.01, "pintor", 11, "Empaste y pintura de departamentos completos, listos para entregar.", true, 272.6, 58, 64, 650, "Depa de 2 dormitorios"],
  ["Teodoro Aquino", "Comas", -11.935, -77.05, "carpintero", 22, "Puertas, closets y reparación de muebles de madera.", true, 142.6, 31, 35, 120, "Puerta contraplacada"],
  ["Jhon Ccanto", "Los Olivos", -11.968, -77.071, "cerrajero", 7, "Cambio de chapas, duplicado de llaves y apertura de autos.", true, 206.8, 44, 50, 40, "Chapa de puerta"],
  ["Kelly Rivas", "Ate", -12.027, -76.918, "climatizacion", 6, "Mantenimiento de split y ventiladores para casas y negocios.", true, 129.6, 27, 30, 120, "Mantenimiento de split"],
  ["Nilton Huarcaya", "San Martín de Porres", -12.003, -77.062, "drywall", 9, "Divisiones, cielo raso y muebles de drywall para casas y oficinas.", false, 155.1, 33, 36, 140, "Cielo raso"],
];

export const DEMO_WORKERS: Profile[] = ROWS.map((r, i) => ({
  id: `demo-w-${i + 1}`,
  role: "trabajador",
  full_name: r[0],
  district: r[1],
  lat: r[2],
  lng: r[3],
  oficio: r[4],
  years_exp: r[5],
  bio: r[6],
  available: r[7],
  rating_sum: r[8],
  rating_count: r[9],
  jobs_done: r[10],
  price_from: r[11],
  work_label: r[12],
  is_demo: true,
}));

export const DEMAND_WEIGHTS: [string, number, number, number][] = [
  ["San Juan de Lurigancho", -11.985, -77.005, 9],
  ["San Martín de Porres", -12.003, -77.062, 7],
  ["Ate", -12.027, -76.918, 7],
  ["Comas", -11.935, -77.05, 6],
  ["Villa El Salvador", -12.212, -76.937, 6],
  ["Los Olivos", -11.968, -77.071, 5],
  ["Santiago de Surco", -12.136, -76.993, 5],
  ["San Juan de Miraflores", -12.157, -76.97, 4],
  ["Carabayllo", -11.86, -77.03, 3],
  ["Chorrillos", -12.17, -77.015, 4],
  ["La Molina", -12.085, -76.937, 3],
  ["Miraflores", -12.121, -77.029, 3],
  ["Callao", -12.06, -77.13, 4],
  ["Puente Piedra", -11.866, -77.075, 3],
  ["La Victoria", -12.068, -77.017, 3],
  ["Lima", -12.046, -77.043, 3],
];
export const OFICIO_FACTOR: Record<OficioId, number> = {
  electricista: 1,
  gasfitero: 0.9,
  albanil: 0.7,
  soldador: 0.5,
  pintor: 0.8,
  carpintero: 0.5,
  cerrajero: 0.7,
  climatizacion: 0.45,
  drywall: 0.45,
};

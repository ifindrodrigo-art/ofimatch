// Mismos perfiles demo que supabase/schema.sql (para el modo demo y la vitrina de la portada).
import type { Profile } from "./types";
import type { OficioId } from "./data";

type Row = [string, string, number, number, OficioId, number, string, boolean, number, number, number];

const ROWS: Row[] = [
  ["Julio Quispe", "San Juan de Lurigancho", -11.985, -77.005, "electricista", 14, "Instalaciones domiciliarias, tableros y pozo a tierra. Trabajo limpio y con boleta.", true, 88.4, 19, 41],
  ["Rosa Huamán", "Los Olivos", -11.968, -77.071, "electricista", 9, "Cortocircuitos, cableado nuevo y luminarias LED para casas y bodegas.", true, 61.2, 13, 27],
  ["Marco Paredes", "Santiago de Surco", -12.136, -76.993, "electricista", 21, "Electricista industrial y residencial. Certificado SENCICO.", false, 113.6, 24, 63],
  ["Kevin Ramos", "Ate", -12.027, -76.918, "electricista", 4, "Atiendo emergencias en Ate, Santa Anita y La Molina.", true, 21.0, 5, 8],
  ["Luis Cárdenas", "San Martín de Porres", -12.003, -77.062, "electricista", 11, "Tomacorrientes, llaves térmicas y medidores.", true, 40.5, 9, 22],
  ["Pedro Ccahuana", "Comas", -11.935, -77.05, "gasfitero", 17, "Fugas de agua, termas, desatoros y redes de desagüe.", true, 75.6, 16, 48],
  ["Elena Torres", "Miraflores", -12.121, -77.029, "gasfitero", 8, "Gasfitería fina: griferías, inodoros y cambio de tuberías.", true, 42.3, 9, 19],
  ["Jhonatan Vílchez", "Villa El Salvador", -12.212, -76.937, "gasfitero", 6, "Instalación de tanques, bombas y termas a gas.", true, 27.6, 6, 12],
  ["César Mamani", "Chorrillos", -12.17, -77.015, "gasfitero", 12, "Desatoros con máquina y detección de fugas sin romper.", false, 56.0, 12, 30],
  ["Wilmer Huanca", "Puente Piedra", -11.866, -77.075, "albanil", 19, "Construcción, tarrajeo, enchapes y ampliaciones de segundo piso.", true, 90.2, 20, 37],
  ["Santos Rojas", "San Juan de Miraflores", -12.157, -76.97, "albanil", 25, "Maestro de obra. Cimentación, columnas y losas.", true, 121.5, 26, 55],
  ["Diana Flores", "Carabayllo", -11.86, -77.03, "albanil", 7, "Acabados: pintura, drywall y cerámicos.", true, 30.8, 7, 14],
  ["Alex Gutiérrez", "La Victoria", -12.068, -77.017, "albanil", 10, "Remodelación de cocinas y baños.", true, 38.0, 9, 18],
  ["Raúl Espinoza", "Independencia", -11.99, -77.05, "soldador", 15, "Puertas, rejas y estructuras metálicas a medida.", true, 64.8, 14, 33],
  ["Iván Salazar", "Callao", -12.06, -77.13, "soldador", 22, "Soldadura MIG/TIG, techos metálicos y escaleras.", true, 98.4, 21, 49],
  ["Brenda Castillo", "Ate", -12.027, -76.918, "soldador", 5, "Rejas, barandas y reparaciones a domicilio.", true, 17.6, 4, 7],
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
export const OFICIO_FACTOR: Record<OficioId, number> = { electricista: 1, gasfitero: 0.9, albanil: 0.7, soldador: 0.5 };

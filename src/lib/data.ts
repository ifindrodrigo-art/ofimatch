// Datos estáticos: oficios, distritos de Lima y Callao con coordenadas aproximadas.

export type OficioId =
  | "electricista"
  | "gasfitero"
  | "albanil"
  | "soldador"
  | "pintor"
  | "carpintero"
  | "cerrajero"
  | "climatizacion"
  | "drywall";

export type IconId = "bolt" | "faucet" | "brick" | "weld" | "roller" | "hammer" | "key" | "ac" | "roof";

export type Oficio = {
  id: OficioId;
  area: string; // nombre del rubro: "Electricidad"
  singular: string; // persona: "Electricista"
  plural: string;
  slug: string; // URL de la página pública
  icon: IconId;
  tint: string;
  trabajos: string[];
  pregunta: string;
  keywords: string;
};

export const OFICIOS: Oficio[] = [
  {
    id: "electricista",
    area: "Electricidad",
    singular: "Electricista",
    plural: "Electricistas",
    slug: "electricistas-en-lima",
    icon: "bolt",
    tint: "var(--tint-1)",
    trabajos: [
      "Cortocircuitos y apagones en casa",
      "Instalación de tomacorrientes, interruptores y luminarias",
      "Cambio de tablero y llaves térmicas",
      "Pozo a tierra y cableado nuevo",
      "Instalación de terma eléctrica",
    ],
    pregunta: "¿Cuánto cobra un electricista a domicilio en Lima?",
    keywords: "luz tomacorriente enchufe tablero llave termica pozo tierra cableado luminaria cortocircuito",
  },
  {
    id: "gasfitero",
    area: "Gasfitería",
    singular: "Gasfitero",
    plural: "Gasfiteros",
    slug: "gasfiteros-en-lima",
    icon: "faucet",
    tint: "var(--tint-2)",
    trabajos: [
      "Fugas de agua y goteras en tuberías",
      "Desatoro de lavaderos, inodoros y desagües",
      "Instalación de termas a gas y eléctricas",
      "Cambio de griferías e inodoros",
      "Instalación de tanques y bombas de agua",
    ],
    pregunta: "¿Cuánto cobra un gasfitero por un desatoro en Lima?",
    keywords: "fuga agua terma caño grifo griferia desague desatoro inodoro baño tuberia plomero tanque bomba",
  },
  {
    id: "albanil",
    area: "Albañilería",
    singular: "Albañil",
    plural: "Albañiles",
    slug: "albaniles-en-lima",
    icon: "brick",
    tint: "var(--tint-3)",
    trabajos: [
      "Ampliaciones y construcción de segundo piso",
      "Tarrajeo, enchapes y cerámicos",
      "Remodelación de baños y cocinas",
      "Pisos, contrapisos y veredas",
      "Muros, columnas y losas",
    ],
    pregunta: "¿Cuánto cobra un albañil por día en Lima?",
    keywords: "enchape mayolica porcelanato tarrajeo pared construccion ampliacion cemento piso losa muro",
  },
  {
    id: "soldador",
    area: "Soldadura",
    singular: "Soldador",
    plural: "Soldadores",
    slug: "soldadores-en-lima",
    icon: "weld",
    tint: "var(--tint-4)",
    trabajos: [
      "Puertas y rejas metálicas a medida",
      "Techos y estructuras metálicas",
      "Barandas y escaleras",
      "Reparación de soldaduras a domicilio",
      "Soldadura MIG, TIG y por arco",
    ],
    pregunta: "¿Cuánto cuesta una puerta metálica hecha por un soldador en Lima?",
    keywords: "reja puerta metal metalica estructura soldar soldadura fierro garaje baranda techo",
  },
  {
    id: "pintor",
    area: "Pintura",
    singular: "Pintor",
    plural: "Pintores",
    slug: "pintores-en-lima",
    icon: "roller",
    tint: "var(--tint-6)",
    trabajos: [
      "Pintura de interiores: salas, dormitorios y cocinas",
      "Pintura de fachadas",
      "Empaste y resane de paredes",
      "Pintura de departamentos completos",
      "Barnizado de puertas y muebles",
    ],
    pregunta: "¿Cuánto cuesta pintar un departamento en Lima?",
    keywords: "pintar pintura pared fachada empaste resane interiores departamento barniz",
  },
  {
    id: "carpintero",
    area: "Carpintería",
    singular: "Carpintero",
    plural: "Carpinteros",
    slug: "carpinteros-en-lima",
    icon: "hammer",
    tint: "var(--tint-4)",
    trabajos: [
      "Muebles de melamina a medida",
      "Closets y muebles de cocina",
      "Puertas de madera y contraplacadas",
      "Reparación de muebles",
      "Escritorios y repisas",
    ],
    pregunta: "¿Cuánto cuesta un closet de melamina a medida en Lima?",
    keywords: "melamina mueble closet cocina madera repisa puerta escritorio carpinteria",
  },
  {
    id: "cerrajero",
    area: "Cerrajería",
    singular: "Cerrajero",
    plural: "Cerrajeros",
    slug: "cerrajeros-en-lima",
    icon: "key",
    tint: "var(--tint-1)",
    trabajos: [
      "Apertura de puertas sin dañar la chapa",
      "Cambio de chapas y cerraduras de seguridad",
      "Duplicado de llaves",
      "Apertura de autos",
      "Instalación de cerrojos",
    ],
    pregunta: "¿Cuánto cobra un cerrajero por abrir una puerta en Lima?",
    keywords: "chapa llave puerta cerradura abrir cerrojo urgencia cerrajero duplicado",
  },
  {
    id: "climatizacion",
    area: "Climatización",
    singular: "Técnico en climatización",
    plural: "Técnicos en climatización",
    slug: "tecnicos-de-aire-acondicionado-en-lima",
    icon: "ac",
    tint: "var(--tint-2)",
    trabajos: [
      "Instalación de aire acondicionado split",
      "Mantenimiento y limpieza de split",
      "Carga de gas refrigerante",
      "Reparación de equipos de aire",
      "Ventilación para negocios",
    ],
    pregunta: "¿Cuánto cuesta el mantenimiento de un aire acondicionado en Lima?",
    keywords: "aire acondicionado split climatizacion ventilacion mantenimiento refrigerante gas",
  },
  {
    id: "drywall",
    area: "Drywall y techos",
    singular: "Instalador de drywall",
    plural: "Instaladores de drywall",
    slug: "instaladores-de-drywall-en-lima",
    icon: "roof",
    tint: "var(--tint-5)",
    trabajos: [
      "Falso techo y cielo raso",
      "Divisiones de ambientes",
      "Muebles de drywall",
      "Reparación de goteras en techos",
      "Acabados y empaste de drywall",
    ],
    pregunta: "¿Cuánto cuesta instalar drywall por metro cuadrado en Lima?",
    keywords: "drywall falso techo cielo raso division gotera techo baldosa tabiqueria",
  },
];

export const oficioById = (id: string) => OFICIOS.find((o) => o.id === id);

export type District = { name: string; lat: number; lng: number };

export const DISTRICTS: District[] = [
  { name: "Ate", lat: -12.027, lng: -76.918 },
  { name: "Barranco", lat: -12.149, lng: -77.021 },
  { name: "Bellavista", lat: -12.061, lng: -77.111 },
  { name: "Breña", lat: -12.059, lng: -77.05 },
  { name: "Callao", lat: -12.06, lng: -77.13 },
  { name: "Carabayllo", lat: -11.86, lng: -77.03 },
  { name: "Chorrillos", lat: -12.17, lng: -77.015 },
  { name: "Comas", lat: -11.935, lng: -77.05 },
  { name: "El Agustino", lat: -12.043, lng: -76.995 },
  { name: "Independencia", lat: -11.99, lng: -77.05 },
  { name: "Jesús María", lat: -12.077, lng: -77.047 },
  { name: "La Molina", lat: -12.085, lng: -76.937 },
  { name: "La Perla", lat: -12.067, lng: -77.115 },
  { name: "La Victoria", lat: -12.068, lng: -77.017 },
  { name: "Lima", lat: -12.046, lng: -77.043 },
  { name: "Lince", lat: -12.084, lng: -77.035 },
  { name: "Los Olivos", lat: -11.968, lng: -77.071 },
  { name: "Lurigancho-Chosica", lat: -11.94, lng: -76.7 },
  { name: "Lurín", lat: -12.27, lng: -76.87 },
  { name: "Magdalena del Mar", lat: -12.091, lng: -77.07 },
  { name: "Miraflores", lat: -12.121, lng: -77.029 },
  { name: "Pachacámac", lat: -12.23, lng: -76.86 },
  { name: "Pueblo Libre", lat: -12.075, lng: -77.064 },
  { name: "Puente Piedra", lat: -11.866, lng: -77.075 },
  { name: "Rímac", lat: -12.03, lng: -77.03 },
  { name: "San Borja", lat: -12.1, lng: -77.0 },
  { name: "San Isidro", lat: -12.097, lng: -77.036 },
  { name: "San Juan de Lurigancho", lat: -11.985, lng: -77.005 },
  { name: "San Juan de Miraflores", lat: -12.157, lng: -76.97 },
  { name: "San Luis", lat: -12.074, lng: -76.995 },
  { name: "San Martín de Porres", lat: -12.003, lng: -77.062 },
  { name: "San Miguel", lat: -12.077, lng: -77.09 },
  { name: "Santa Anita", lat: -12.045, lng: -76.97 },
  { name: "Santiago de Surco", lat: -12.136, lng: -76.993 },
  { name: "Surquillo", lat: -12.113, lng: -77.01 },
  { name: "Ventanilla", lat: -11.87, lng: -77.13 },
  { name: "Villa El Salvador", lat: -12.212, lng: -76.937 },
  { name: "Villa María del Triunfo", lat: -12.16, lng: -76.94 },
];

export const districtByName = (n: string) => DISTRICTS.find((d) => d.name === n);

export const URGENCIAS = [
  { id: "ahora", label: "Ahora mismo", hint: "Emergencia: pesa más la cercanía" },
  { id: "hoy", label: "Hoy", hint: "Balance entre cercanía y reputación" },
  { id: "semana", label: "Esta semana", hint: "Hay tiempo: pesa más la reputación" },
] as const;
export type Urgency = (typeof URGENCIAS)[number]["id"];

export const COMMISSION = 0.1; // 10%, dentro del rango 8–12% del modelo de negocio

export const SITE_URL = (
  process.env.NEXT_PUBLIC_PROD_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://ofimatch-gilt.vercel.app"
).replace(/\/$/, "");

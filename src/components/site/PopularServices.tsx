"use client";
import type { IconName } from "./Icons";
import { emitSearch } from "@/lib/searchBus";
import Carousel from "./Carousel";
import Illus from "./Illus";

const POPULAR: { t: string; icon: IconName; tint: string; pat?: "grid" | "stripes"; q: string; area: string }[] = [
  { t: "Instalación de tomacorrientes", icon: "bolt", tint: "var(--tint-1)", pat: "grid", q: "tomacorriente", area: "Electricidad" },
  { t: "Reparación de fugas de agua", icon: "faucet", tint: "var(--tint-2)", q: "fuga", area: "Gasfitería" },
  { t: "Instalación de termas", icon: "faucet", tint: "var(--tint-4)", q: "terma", area: "Gasfitería" },
  { t: "Pozo a tierra", icon: "bolt", tint: "var(--tint-3)", pat: "grid", q: "pozo a tierra", area: "Electricidad" },
  { t: "Tableros eléctricos", icon: "bolt", tint: "var(--tint-5)", q: "tablero", area: "Electricidad" },
  { t: "Pintura de interiores", icon: "roller", tint: "var(--tint-6)", q: "pintura", area: "Pintura" },
  { t: "Rejas y puertas metálicas", icon: "weld", tint: "var(--tint-3)", pat: "stripes", q: "reja", area: "Soldadura" },
  { t: "Enchape de baños y cocinas", icon: "brick", tint: "var(--tint-5)", q: "enchape", area: "Albañilería" },
  { t: "Cambio de chapas", icon: "key", tint: "var(--tint-1)", q: "chapa", area: "Cerrajería" },
  { t: "Mantenimiento de aire acondicionado", icon: "ac", tint: "var(--tint-2)", q: "split", area: "Climatización" },
  { t: "Drywall y falso techo", icon: "roof", tint: "var(--tint-6)", pat: "stripes", q: "drywall", area: "Drywall y techos" },
  { t: "Muebles de melamina", icon: "hammer", tint: "var(--tint-4)", q: "melamina", area: "Carpintería" },
];

export default function PopularServices() {
  return (
    <Carousel label="Servicios populares">
      {POPULAR.map((p) => (
        <li key={p.t}>
          <button type="button" className="pop-card" onClick={() => emitSearch({ q: p.q })}>
            <h3>{p.t}</h3>
            <Illus icon={p.icon} tint={p.tint} pattern={p.pat} chip={p.area} />
          </button>
        </li>
      ))}
    </Carousel>
  );
}

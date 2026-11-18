"use client";
import { OFICIOS } from "@/lib/data";
import { emitSearch } from "@/lib/searchBus";
import { Icon } from "./Icons";

export default function TradeTiles() {
  return (
    <ul className="tiles" aria-label="Oficios">
      {OFICIOS.map((o) => (
        <li key={o.id}>
          <a
            className="tile"
            href={`/oficios/${o.slug}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              emitSearch({ trade: o.id });
            }}
          >
            <Icon name={o.icon} />
            <span>{o.area}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

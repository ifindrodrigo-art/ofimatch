"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

export default function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft < 12, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 12 });
  }, []);
  useEffect(() => {
    update();
    addEventListener("resize", update);
    return () => removeEventListener("resize", update);
  }, [update]);
  const by = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8 });
  return (
    <div className="carousel">
      <button className="car-btn prev" type="button" aria-label="Anterior" disabled={edges.start} onClick={() => by(-1)}>
        <Icon name="chev-l" />
      </button>
      <ul className="track" ref={track} onScroll={update} aria-label={label}>
        {children}
      </ul>
      <button className="car-btn next" type="button" aria-label="Siguiente" disabled={edges.end} onClick={() => by(1)}>
        <Icon name="chev-r" />
      </button>
    </div>
  );
}

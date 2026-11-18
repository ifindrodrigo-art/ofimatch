// Íconos de línea (trazo 1.6) definidos una sola vez como sprite SVG.
export type IconName =
  | "search" | "arrow" | "chev-l" | "chev-r" | "chev-d" | "menu" | "close" | "heart" | "star" | "pin" | "check"
  | "shield" | "clock" | "pause" | "play" | "match" | "wallet" | "users" | "camera" | "doc" | "phone" | "lock"
  | "plus" | "list" | "map" | "user" | "trash" | "image" | "whatsapp"
  | "bolt" | "faucet" | "brick" | "weld" | "roller" | "hammer" | "key" | "ac" | "roof";

export function Icon({ name, className = "ico", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg className={className} aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
        <symbol id="i-chev-l" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></symbol>
        <symbol id="i-chev-r" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></symbol>
        <symbol id="i-chev-d" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></symbol>
        <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></symbol>
        <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7.2-4.4-9.1-8.7C1.5 8.1 3.6 4.8 7 4.8c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.5 3.3 4.1 6.5C19.2 15.6 12 20 12 20z" /></symbol>
        <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-11.5a7 7 0 0 0-14 0C5 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></symbol>
        <symbol id="i-pause" viewBox="0 0 24 24"><path d="M9 6v12M15 6v12" /></symbol>
        <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></symbol>
        <symbol id="i-match" viewBox="0 0 24 24"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" /></symbol>
        <symbol id="i-wallet" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M16 14.5h2" /></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" /><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.7 3 2.5 3.5 5.2" /></symbol>
        <symbol id="i-camera" viewBox="0 0 24 24"><path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></symbol>
        <symbol id="i-list" viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></symbol>
        <symbol id="i-map" viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></symbol>
        <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></symbol>
        <symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></symbol>
        <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M4 20.5l1.4-4.2A8.3 8.3 0 1 1 8.6 19z" /><path d="M9.2 8.4c-.6 1.6.4 3.6 1.9 5 1.5 1.5 3.4 2.4 5 1.9l.6-1.4-2.1-1-.9.8a5 5 0 0 1-2.4-2.4l.8-.9-1-2.1z" /></symbol>
        <symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z" /></symbol>
        <symbol id="i-faucet" viewBox="0 0 24 24"><path d="M3.5 7v6M3.5 10h9.5a4 4 0 0 1 4 4v.5" /><path d="M9 10V6.5M6.5 6.5h5" /><path d="M17 17.2c-.9 1.2-1.5 2-1.5 2.7a1.5 1.5 0 0 0 3 0c0-.7-.6-1.5-1.5-2.7z" /></symbol>
        <symbol id="i-brick" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19" /></symbol>
        <symbol id="i-weld" viewBox="0 0 24 24"><path d="M3.5 20.5 10 14" /><path d="m8.6 12.6 2.8 2.8 4.2-4.2-2.8-2.8z" /><path d="m15.6 8.4 1.6-1.6" /><path d="M19.5 3.5v2M21.5 6.5h-2M17.5 4l.8.8M21 10l-1.2-.4M14.5 3.8l.4 1" /></symbol>
        <symbol id="i-roller" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="14" height="5" rx="1.5" /><path d="M17.5 6H20v5h-8.5v3" /><rect x="10" y="14" width="3" height="7" rx="1" /></symbol>
        <symbol id="i-hammer" viewBox="0 0 24 24"><path d="M12.5 4.5h6l2.5 3-2.5 1.5h-6z" /><path d="m15 9-10 10a1.4 1.4 0 0 0 2 2l10-10" /></symbol>
        <symbol id="i-key" viewBox="0 0 24 24"><circle cx="8" cy="15.5" r="4.5" /><path d="M11.2 12.3 20 3.5M16.5 7l2.5 2.5M14.3 9.2l2 2" /></symbol>
        <symbol id="i-ac" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="9" rx="2" /><path d="M6.5 10.5h11" /><path d="M8 16.5c0 1.2-.8 1.6-.8 2.8M12 16.5c0 1.5-.8 2-.8 3.5M16 16.5c0 1.2-.8 1.6-.8 2.8" /></symbol>
        <symbol id="i-roof" viewBox="0 0 24 24"><path d="M2.5 11.5 12 4l9.5 7.5" /><path d="M5 9.8V20h14V9.8" /><path d="M5 14.5h14M9.5 14.5V20M14.5 14.5V20" /></symbol>
      </defs>
    </svg>
  );
}

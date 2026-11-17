const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconPlus = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" {...p} />
    <path d="M12 8v8M8 12h8" {...p} />
  </svg>
);
export const IconList = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...p} />
  </svg>
);
export const IconMap = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" {...p} />
  </svg>
);
export const IconUser = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="4" {...p} />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" {...p} />
  </svg>
);
export const IconLock = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" {...p} />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} />
  </svg>
);

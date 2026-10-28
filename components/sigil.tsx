// Hand-drawn alchemical marks, one per ghost. Line-art only; stroke=currentColor.

const sigils: Record<string, React.ReactNode> = {
  cobol: (
    // paragraph-mark cross — a ledger glyph
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="22" cy="14" r="7" />
      <path d="M15 14 Q22 22 29 14" />
      <line x1="18" y1="7" x2="18" y2="34" />
      <line x1="26" y1="7" x2="26" y2="34" />
      <line x1="12" y1="34" x2="32" y2="34" />
    </g>
  ),
  apl: (
    // three stacked rings with a central dot — the inner notation
    <g strokeLinecap="round" fill="none">
      <circle cx="22" cy="22" r="14" />
      <circle cx="22" cy="22" r="8" />
      <circle cx="22" cy="22" r="1.4" fill="currentColor" />
      <path d="M8 22 L36 22 M22 8 L22 36" strokeWidth="0.6" opacity="0.5" />
    </g>
  ),
  perl4: (
    // crosshatched sigil, like a tag or sigil
    <g strokeLinecap="round" fill="none">
      <path d="M12 10 Q22 6 32 10 Q36 22 32 34 Q22 38 12 34 Q8 22 12 10 Z" />
      <path d="M15 15 L29 29 M15 29 L29 15" strokeWidth="0.7" opacity="0.6" />
      <path d="M22 6 L22 38" strokeWidth="0.6" opacity="0.4" />
    </g>
  ),
  pascal: (
    // triangle inside circle — structure
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="22" cy="22" r="15" />
      <path d="M22 10 L34 30 L10 30 Z" />
      <circle cx="22" cy="23" r="1.4" fill="currentColor" />
    </g>
  ),
  lispm: (
    // concentric parentheses hugging a dot
    <g strokeLinecap="round" fill="none">
      <path d="M14 8 Q8 22 14 36" />
      <path d="M18 11 Q13 22 18 33" />
      <path d="M26 11 Q31 22 26 33" />
      <path d="M30 8 Q36 22 30 36" />
      <circle cx="22" cy="22" r="1.6" fill="currentColor" />
    </g>
  ),
  algol60: (
    // leftward arrow — the Algol assignment
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="8" y1="22" x2="36" y2="22" />
      <path d="M14 15 L8 22 L14 29" />
      <circle cx="36" cy="22" r="2" fill="currentColor" />
    </g>
  ),
  prolog: (
    // ?- as a sigil: dash-colon-arrow
    <g strokeLinecap="round" fill="none">
      <line x1="8" y1="22" x2="20" y2="22" />
      <circle cx="26" cy="17" r="1.3" fill="currentColor" />
      <circle cx="26" cy="27" r="1.3" fill="currentColor" />
      <path d="M30 14 Q38 22 30 30" />
    </g>
  ),
  basic: (
    // GOSUB loop — number ten with a return arrow
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <text x="7" y="30" fontSize="20" fontFamily="serif" fill="currentColor" stroke="none">10</text>
      <path d="M30 12 Q38 20 30 28 L26 28" />
      <path d="M30 24 L26 28 L30 32" strokeWidth="0.9" />
    </g>
  ),
};

export function Sigil({
  id,
  size = 44,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="1.1"
      className={className}
      aria-hidden
    >
      {sigils[id] ?? null}
    </svg>
  );
}

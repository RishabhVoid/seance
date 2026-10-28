export function Candle({ size = 72, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 110"
      width={size}
      height={(size * 110) / 60}
      aria-hidden
      className="block"
    >
      {/* candle glow halo (only when lit) */}
      {lit && (
        <ellipse
          cx="30"
          cy="22"
          rx="26"
          ry="20"
          fill="url(#halo)"
          className="glow"
          style={{ transformOrigin: "center" }}
        />
      )}

      {/* flame */}
      {lit && (
        <g className="flame">
          {/* outer soft */}
          <path
            d="M30 10 C24 18 23 27 27 33 C30 36 30 33 30 33 C30 36 30 36 33 33 C37 27 36 18 30 10 Z"
            fill="url(#flameOuter)"
          />
          {/* inner hot */}
          <path
            d="M30 16 C27 22 27 28 29 32 C30 34 30 32 30 32 C30 34 30 34 31 32 C33 28 33 22 30 16 Z"
            fill="url(#flameInner)"
          />
          {/* core */}
          <ellipse cx="30" cy="28" rx="1.6" ry="3.4" fill="#5a3010" opacity="0.55" />
        </g>
      )}

      {/* wick */}
      <line
        x1="30"
        y1="34"
        x2="30"
        y2="42"
        stroke="#1b1208"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* molten wax pooling on top */}
      <ellipse cx="30" cy="42" rx="10" ry="2.2" fill="#f2e2b8" />
      <ellipse cx="30" cy="41.4" rx="10" ry="2.2" fill="none" stroke="#8a6a3a" strokeWidth="0.5" opacity="0.6" />

      {/* candle body */}
      <path
        d="M20 42 L20 100 Q20 103 23 103 L37 103 Q40 103 40 100 L40 42 Z"
        fill="url(#wax)"
        stroke="#8a6a3a"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />

      {/* wax drip, left side */}
      <path
        d="M20 58 Q17.5 65 19 72 Q20.4 68 20 60 Z"
        fill="url(#wax)"
        stroke="#8a6a3a"
        strokeWidth="0.4"
        strokeOpacity="0.5"
      />
      {/* wax drip, right lower */}
      <path
        d="M40 72 Q42.5 80 41 88 Q40 83 40 74 Z"
        fill="url(#wax)"
        stroke="#8a6a3a"
        strokeWidth="0.4"
        strokeOpacity="0.5"
      />

      {/* base shadow on page */}
      <ellipse cx="30" cy="103" rx="13" ry="2.4" fill="rgba(0,0,0,0.3)" />

      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 220, 150, 0.55)" />
          <stop offset="60%" stopColor="rgba(207, 122, 31, 0.15)" />
          <stop offset="100%" stopColor="rgba(207, 122, 31, 0)" />
        </radialGradient>
        <radialGradient id="flameOuter" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#ffd79a" />
          <stop offset="60%" stopColor="#f0a040" />
          <stop offset="100%" stopColor="rgba(240, 160, 60, 0.1)" />
        </radialGradient>
        <radialGradient id="flameInner" cx="50%" cy="75%" r="55%">
          <stop offset="0%" stopColor="#ffeec0" />
          <stop offset="100%" stopColor="#ffb050" />
        </radialGradient>
        <linearGradient id="wax" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2e2b8" />
          <stop offset="55%" stopColor="#e8dbbb" />
          <stop offset="100%" stopColor="#c4a870" />
        </linearGradient>
      </defs>
    </svg>
  );
}

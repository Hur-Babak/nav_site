export function CorpsEmblem({ size = 96 }: { size?: number }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Емблема Корпусу НАВ"
    >
      <g transform="translate(100 100)">
        {rays.map((_, i) => {
          const a = (i * 360) / rays.length;
          const color = i % 2 === 0 ? "#d8772a" : "#6f9e34";
          return (
            <polygon
              key={i}
              points="-6,-70 6,-70 3,-94 -3,-94"
              fill={color}
              opacity="0.92"
              transform={`rotate(${a})`}
            />
          );
        })}
        <circle r="64" fill="#0c0f0b" stroke="#2a3326" strokeWidth="3" />
        <g fill="#e7eadf" stroke="none">
          <path
            d="M0,-40 C-26,-40 -40,-22 -40,2 C-40,18 -30,28 -22,32 L-22,44 C-22,49 -17,52 -12,52 L12,52 C17,52 22,49 22,44 L22,32 C30,28 40,18 40,2 C40,-22 26,-40 0,-40 Z"
            fill="#e7eadf"
          />
          <circle cx="-16" cy="2" r="9" fill="#0c0f0b" />
          <circle cx="16" cy="2" r="9" fill="#0c0f0b" />
          <path d="M0,12 L-6,24 L6,24 Z" fill="#0c0f0b" />
          <rect x="-12" y="40" width="5" height="12" fill="#0c0f0b" />
          <rect x="-2.5" y="40" width="5" height="12" fill="#0c0f0b" />
          <rect x="7" y="40" width="5" height="12" fill="#0c0f0b" />
        </g>
      </g>
    </svg>
  );
}

export function UnitCrest({
  short,
  accent,
  size = 84,
}: {
  short: string;
  accent: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Емблема ${short}`}
    >
      <path
        d="M60 6 L106 22 L106 64 C106 92 86 108 60 116 C34 108 14 92 14 64 L14 22 Z"
        fill="#10150e"
        stroke={accent}
        strokeWidth="3"
      />
      <path
        d="M60 18 L96 31 L96 63 C96 84 81 97 60 104 C39 97 24 84 24 63 L24 31 Z"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.5"
      />
      <line x1="24" y1="44" x2="96" y2="44" stroke={accent} strokeWidth="1" opacity="0.35" />
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize={short.length > 4 ? 16 : 26}
        fill={accent}
        letterSpacing="1"
      >
        {short.replace("CCO ", "")}
      </text>
      <text
        x="60"
        y="84"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="8"
        fill="#8b9683"
        letterSpacing="2"
      >
        НАВ
      </text>
    </svg>
  );
}

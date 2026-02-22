interface PortugueseFlagProps {
  size?: number;
  className?: string;
}

export function PortugueseFlag({ size = 20, className }: PortugueseFlagProps) {
  const width = size;
  const height = size * (2 / 3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bandeira de Portugal"
    >
      {/* Green section (2/5) */}
      <rect width="12" height="20" fill="#006600" />
      {/* Red section (3/5) */}
      <rect x="12" width="18" height="20" fill="#FF0000" />
      {/* Armillary sphere (simplified yellow circle) */}
      <circle cx="12" cy="10" r="4.5" fill="#FFCC00" />
      {/* Shield */}
      <rect x="9.5" y="7.5" width="5" height="5.5" rx="0.5" fill="#FFFFFF" />
      {/* Blue shields (quinas) - simplified */}
      <rect x="10.2" y="8.2" width="1.2" height="1.2" rx="0.2" fill="#003399" />
      <rect x="12.4" y="8.2" width="1.2" height="1.2" rx="0.2" fill="#003399" />
      <rect x="11.3" y="9.5" width="1.2" height="1.2" rx="0.2" fill="#003399" />
      <rect x="10.2" y="10.8" width="1.2" height="1.2" rx="0.2" fill="#003399" />
      <rect x="12.4" y="10.8" width="1.2" height="1.2" rx="0.2" fill="#003399" />
      {/* Red border on shield */}
      <rect x="9.5" y="7.5" width="5" height="5.5" rx="0.5" fill="none" stroke="#FF0000" strokeWidth="0.4" />
    </svg>
  );
}

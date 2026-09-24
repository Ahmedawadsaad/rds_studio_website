type BrandLogoProps = {
  compact?: boolean;
  light?: boolean;
  className?: string;
};

export default function BrandLogo({ compact = false, light = false, className = "" }: BrandLogoProps) {
  const textColor = light ? "#0c0b09" : "#f5f5f5";
  const markColor = "#b42323";

  return (
    <span className={`brand-logo inline-flex ${light ? "bg-transparent" : "bg-[#050505]"} ${className}`} aria-label="Red Door Studio">
      <svg viewBox="0 0 132 132" className={compact ? "h-14 w-14" : "h-36 w-36"} role="img">
        <defs>
          <path id="brandLogoPath" d="M66,66 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0" />
        </defs>
        <circle className="brand-logo-ring" cx="66" cy="66" r="62" fill="none" stroke={textColor} strokeWidth="1.2" opacity="0.9" />
        <text className="brand-logo-copy" fill={textColor} fontSize="11.5" fontWeight="700" letterSpacing="1.8">
          <textPath href="#brandLogoPath" startOffset="2%">RED DOOR STUDIO · RED DOOR STUDIO ·</textPath>
        </text>
        <text x="66" y="81" textAnchor="middle" fill={markColor} fontSize="43" fontWeight="800" letterSpacing="-4">RDS</text>
      </svg>
    </span>
  );
}

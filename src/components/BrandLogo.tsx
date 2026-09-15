type BrandLogoProps = {
  compact?: boolean;
  light?: boolean;
};

export default function BrandLogo({ compact = false, light = false }: BrandLogoProps) {
  const brandColor = light ? "#f0e8d5" : "#b42323";

  return (
    <span className="inline-flex" aria-label="Red Door Studio">
      <svg viewBox="0 0 132 132" className={compact ? "h-14 w-14" : "h-36 w-36"} role="img">
        <defs>
          <path id="brandLogoPath" d="M66,66 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0" />
        </defs>
        <circle cx="66" cy="66" r="62" fill="none" stroke={brandColor} strokeWidth="1.5" opacity="0.55" />
        <text fill={brandColor} fontSize="11.5" fontWeight="700" letterSpacing="1.8">
          <textPath href="#brandLogoPath" startOffset="2%">RED DOOR STUDIO · RED DOOR STUDIO ·</textPath>
        </text>
        <rect x="48" y="29" width="36" height="74" fill="none" stroke={brandColor} strokeWidth="4.5" />
        <circle cx="51" cy="66" r="4" fill={brandColor} />
      </svg>
    </span>
  );
}

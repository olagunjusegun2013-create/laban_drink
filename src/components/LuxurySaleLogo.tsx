import { useId } from 'react';

interface LuxurySaleLogoProps {
  variant?: 'dark' | 'light';
  size?: 'compact' | 'crest';
  onClick?: () => void;
  className?: string;
}

export function LuxurySaleLogo({
  variant = 'light',
  size = 'crest',
  onClick,
  className = '',
}: LuxurySaleLogoProps) {
  const uid = useId().replace(/:/g, '');
  const goldGradId = `laban-gold-${uid}`;
  const darkGradId = `laban-plum-${uid}`;
  const isLightText = variant === 'light';
  const isCompact = size === 'compact';

  const sealSvg = (
    <svg
      viewBox="0 0 64 64"
      className={`${isCompact ? 'w-7 h-7' : 'w-12 h-12'} shrink-0`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={goldGradId} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF0B3" />
          <stop offset="48%" stopColor="#FFD33F" />
          <stop offset="100%" stopColor="#C98E14" />
        </linearGradient>
        <linearGradient id={darkGradId} x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#35105F" />
          <stop offset="100%" stopColor="#1B0433" />
        </linearGradient>
      </defs>

      {/* Octagonal / Fluted Luxury Seal Rosette */}
      <polygon
        points="32,2 39.5,7.5 48.5,6.5 52.5,15 60,20.5 58.5,29.5 62,38 55.5,45 54,54 45,56.5 38.5,62 32,58.5 25.5,62 19,56.5 10,54 8.5,45 2,38 5.5,29.5 4,20.5 11.5,15 15.5,6.5 24.5,7.5"
        fill={`url(#${goldGradId})`}
      />

      {/* Inner Royal Purple Medallion */}
      <circle cx="32" cy="32" r="22.5" fill={`url(#${darkGradId})`} />
      <circle cx="32" cy="32" r="19.5" stroke={`url(#${goldGradId})`} strokeWidth="1.2" strokeOpacity="0.85" />

      {/* Three-Point Crown / Star Flourish */}
      <path
        d="M25 19.5L28.5 14.5L32 18L35.5 14.5L39 19.5H25Z"
        fill={`url(#${goldGradId})`}
      />

      {/* Signature LABAN Leaf Emblem */}
      <path
        d="M32 21.5C27.4 25.6 25 30.6 25 35.4C25 40.2 28 43.8 32 44.6C36 43.8 39 40.2 39 35.4C39 30.6 36.6 25.6 32 21.5Z"
        fill="#C8F52C"
      />
      <path
        d="M32 26V42M32 32L35.8 29M32 36L28.2 33"
        stroke="#21063D"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  const content = isCompact ? (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-colors ${
        isLightText
          ? 'bg-[#21063D]/85 border-[#FFD33F]/50 text-white hover:border-[#FFD33F]'
          : 'bg-[#FAF6EA] border-[#D49B1A]/45 text-[#21063D] hover:border-[#35105F]'
      } ${className}`}
    >
      {sealSvg}
      <span className="leading-none text-left">
        <span
          className={`block text-[9px] font-bold tracking-[0.16em] uppercase ${
            isLightText ? 'text-[#FFD33F]' : 'text-[#8C6207]'
          }`}
        >
          LABAN Reserve
        </span>
        <span className="block font-display text-xs font-black tracking-wider uppercase mt-0.5">
          Luxury Sale
        </span>
      </span>
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-3.5 px-4 py-2.5 rounded-xl border transition-colors ${
        isLightText
          ? 'bg-[#21063D]/90 border-[#FFD33F]/55 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]'
          : 'bg-[#FAF6EA] border-[#D49B1A]/45 text-[#21063D] shadow-sm'
      } ${className}`}
    >
      {sealSvg}
      <span className="leading-none text-left">
        <span
          className={`block text-[10px] font-extrabold tracking-[0.22em] uppercase ${
            isLightText ? 'text-[#FFD33F]' : 'text-[#8C6207]'
          }`}
        >
          Official Collection
        </span>
        <span
          className={`block font-display text-base sm:text-lg font-black tracking-[0.12em] uppercase mt-1 ${
            isLightText ? 'text-white' : 'text-[#21063D]'
          }`}
        >
          LUXURY <span className={isLightText ? 'text-[#FFD33F]' : 'text-[#35105F]'}>SALE</span>
        </span>
        <span
          className={`block text-[10px] font-semibold tracking-[0.14em] uppercase mt-1 ${
            isLightText ? 'text-[#C8F52C]' : 'text-slate-600'
          }`}
        >
          LABAN DRINK · Nigeria
        </span>
      </span>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD33F] rounded-xl cursor-pointer"
        aria-label="LABAN DRINK Luxury Sale Collection"
      >
        {content}
      </button>
    );
  }

  return content;
}

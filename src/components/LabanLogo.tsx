interface LabanLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md';
}

export function LabanLogo({ variant = 'dark', size = 'sm' }: LabanLogoProps) {
  const isLight = variant === 'light';
  const boxSize = size === 'md' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'md' ? 'text-xl' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className={`${boxSize} rounded-xl flex items-center justify-center shrink-0 relative border ${
          isLight
            ? 'bg-[#2C0952] text-[#C8F52C] border-[#FFD33F]/70 shadow-[0_0_0_1px_rgba(255,211,63,0.25)]'
            : 'bg-[#21063D] text-[#C8F52C] border-[#FFD33F] shadow-sm'
        }`}
      >
        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" aria-hidden="true">
          <path
            d="M11.5 7.5L14 4.5L16 6.5L18 4.5L20.5 7.5H11.5Z"
            fill="#FFD33F"
          />
          <path
            d="M16 8.5C12.2 11.9 10 16.2 10 20.2C10 24.3 12.6 27.4 16 28C19.4 27.4 22 24.3 22 20.2C22 16.2 19.8 11.9 16 8.5Z"
            fill="currentColor"
          />
          <path
            d="M16 12.5V25.5M16 17.5L19.4 14.8M16 21L12.6 18.3"
            stroke="#21063D"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block font-display font-black tracking-tight ${titleSize} ${
            isLight ? 'text-white' : 'text-[#21063D]'
          }`}
        >
          LABAN <span className={isLight ? 'text-[#FFD33F]' : 'text-[#35105F]'}>DRINK</span>
        </span>
        <span
          className={`block text-[10px] font-semibold tracking-wide mt-0.5 ${
            isLight ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Refreshment for Every Moment
        </span>
      </span>
    </span>
  );
}

interface LogoProps {
  showWordmark?: boolean;
  size?: number;
  className?: string;
}

export default function Logo({ showWordmark = true, size = 32, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect x="1" y="1" width="30" height="30" rx="7" fill="#0F172A" />
        <path
          d="M7 26 L7 7 L26 7"
          stroke="white"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 26 L10 29"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M26 7 L29 10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>

      {showWordmark && (
        <span className="text-[16px] font-semibold text-primary-text tracking-tight" style={{ fontFamily: 'var(--font-geist-sans)' }}>
          Room<span className="font-normal">Undo</span>
        </span>
      )}
    </div>
  );
}

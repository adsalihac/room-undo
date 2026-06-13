interface LogoProps {
  showWordmark?: boolean;
  size?: number;
  className?: string;
}

export default function Logo({ showWordmark = true, size = 32, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect x="0.5" y="0.5" width="31" height="31" rx="7" fill="#0F172A" stroke="#0F172A" strokeWidth="0.5" />
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
        <span className="text-[15px] font-semibold text-primary-text tracking-tight">
          Room<span className="font-normal">Undo</span>
        </span>
      )}
    </div>
  );
}

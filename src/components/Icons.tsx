type P = { size?: number; color?: string; className?: string; strokeWidth?: number };

export function PixIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" className={className}>
      <path d="M12 2.8 15.6 6.4 12 10 8.4 6.4Z" />
      <path d="M12 14 15.6 17.6 12 21.2 8.4 17.6Z" />
      <path d="M2.8 12 6.4 8.4 10 12 6.4 15.6Z" />
      <path d="M14 12 17.6 8.4 21.2 12 17.6 15.6Z" />
    </svg>
  );
}

export function BarcodeIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" className={className}>
      <path d="M3 4v16M7 4v10M10.5 4v10M14 4v10M17.5 4v10M21 4v16" />
    </svg>
  );
}

export function VirtualCardIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" className={className}>
      <path d="M17 4.5H5A2.5 2.5 0 0 0 2.5 7v10A2.5 2.5 0 0 0 5 19.5h12" />
      <path d="M2.5 9h9" />
      <path d="M20 4.6a2.5 2.5 0 0 1 1.4 1.4M21.5 9v1.5M21.5 13.5V15M21.4 18a2.5 2.5 0 0 1-1.4 1.4" />
    </svg>
  );
}

export function ExtratoIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" className={className}>
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01M8 6h13M8 12h13M8 18h13" />
    </svg>
  );
}

export function TransferIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 8.5h17l-4-4M21 15.5H4l4 4" />
    </svg>
  );
}

export function ITokenIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" className={className}>
      <rect x="2.5" y="7" width="19" height="10" rx="5" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

export function CompleteAccountIcon({ size = 24, color = "currentColor", className }: P) {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: 12 + Math.cos(a) * 8, y: 12 + Math.sin(a) * 8, r: i === 4 ? 2.3 : 1.8 };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} className={className}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={i === 4 ? color : "none"} />
      ))}
    </svg>
  );
}

export function CofrinhoIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" className={className}>
      <rect x="3" y="3.5" width="18" height="16" rx="3" />
      <circle cx="12" cy="10" r="2" />
      <path d="M12 12v3M7 19.5V21M17 19.5V21" />
    </svg>
  );
}

export function OpenFinanceIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" className={className}>
      <path d="M12 3a9 9 0 1 1-8.2 5.3" strokeDasharray="2 2.2" />
      <path d="M12 7a5 5 0 1 1-4.6 3" />
      <path d="M3.8 8.3 6.5 9M3.8 8.3 3.3 5.5" />
    </svg>
  );
}

export function AccountAgencyIcon({ size = 24, color = "currentColor", className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 13.5 9 7.5 16 14.5V21M9 21v-5.5a2 2 0 0 1 4 0V21" />
    </svg>
  );
}

export function ItauLogo({ size = 24 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[6px] bg-[#1F2A63] font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, letterSpacing: "-0.02em" }}
    >
      itaú
    </div>
  );
}

export function MastercardLogo() {
  return (
    <div className="flex h-[18px] w-[28px] items-center justify-center rounded-[4px] bg-[#E6E6E6]">
      <span className="h-[9px] w-[9px] rounded-full bg-[#EB001B]" />
      <span className="-ml-[3px] h-[9px] w-[9px] rounded-full bg-[#F79E1B]/90" />
    </div>
  );
}

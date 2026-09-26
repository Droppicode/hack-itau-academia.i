type Props = { tone?: "dark" | "light"; battery?: number };

export function StatusBar({ tone = "dark", battery = 50 }: Props) {
  const fg = tone === "light" ? "#FFFFFF" : "#000000";
  return (
    <div
      className="relative flex h-[50px] shrink-0 items-center justify-between px-[38px] pt-[6px]"
      style={{ color: fg }}
    >
      <div className="flex items-center gap-1 text-[17px] font-semibold tracking-tight">
        15:16
        <svg width="13" height="13" viewBox="0 0 24 24" fill={fg}>
          <path d="M21 3 3 10.5l7.5 3L13.5 21z" />
        </svg>
      </div>
      <div className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill={fg}>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <span className="text-[15px] font-semibold">5G</span>
        <div className="relative flex h-[13px] w-[25px] items-center">
          <div
            className="flex h-full w-[23px] items-center justify-center overflow-hidden rounded-[4px] text-[10px] font-bold leading-none"
            style={{
              background: `linear-gradient(90deg, ${fg} ${battery}%, ${tone === "light" ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.35)"} ${battery}%)`,
              color: tone === "light" ? "#EC7000" : "#FFFFFF",
            }}
          >
            {battery}
          </div>
          <div className="ml-[1px] h-[4px] w-[1.5px] rounded-r-sm" style={{ background: fg, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}

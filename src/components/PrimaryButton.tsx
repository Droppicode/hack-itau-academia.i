import type { ReactNode } from "react";
import { Squish } from "./Squish";

type Props = { label: string; icon?: ReactNode; onClick?: () => void; disabled?: boolean };

export function PrimaryButton({ label, icon, onClick, disabled }: Props) {
  return (
    <Squish
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[44px] w-full items-center justify-between rounded-[12px] px-[22px] text-[17px] font-semibold text-white ${
        disabled ? "bg-[#EC7000]/40" : "bg-itau-orange"
      }`}
      scale={0.97}
    >
      <span>{label}</span>
      {icon}
    </Squish>
  );
}

export function Footer({ children }: { children: ReactNode }) {
  return (
    <div
      className="shrink-0 border-t border-[#D6D6D6] bg-white px-5 pt-[22px]"
      style={{ paddingBottom: "max(34px, env(safe-area-inset-bottom))" }}
    >
      {children}
    </div>
  );
}

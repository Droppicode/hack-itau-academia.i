import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Squish } from "./Squish";

type Props = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  divider?: boolean;
  bold?: boolean;
};

export function ListRow({ icon, title, subtitle, onClick, divider = false, bold = true }: Props) {
  return (
    <div className={divider ? "border-b border-[#D6D6D6]" : ""}>
      <Squish onClick={onClick} className="flex w-full items-center gap-4 py-[18px]" scale={0.98}>
        {icon && <div className="flex w-8 shrink-0 items-center justify-center">{icon}</div>}
        <div className="flex-1">
          <div className={`text-[17px] leading-tight text-[#4A4A4A] ${bold ? "font-semibold" : ""}`}>{title}</div>
          {subtitle && <div className="mt-[2px] text-[16px] leading-tight text-[#555]">{subtitle}</div>}
        </div>
        <ChevronRight size={20} strokeWidth={1.6} color="#4A4A4A" />
      </Squish>
    </div>
  );
}

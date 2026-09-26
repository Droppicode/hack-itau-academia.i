import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Squish } from "./Squish";

type Props = { right?: ReactNode; onBack?: () => void };

export function ScreenHeader({ right, onBack }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex h-[56px] shrink-0 items-center justify-between px-3">
      <Squish
        aria-label="Voltar"
        onClick={onBack ?? (() => navigate(-1))}
        className="flex h-11 w-11 items-center justify-center rounded-full"
        scale={0.88}
      >
        <ChevronLeft size={30} strokeWidth={1.6} color="#1A1A1A" />
      </Squish>
      <div className="flex items-center">{right}</div>
    </div>
  );
}

export function HeaderIcon({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) {
  return (
    <Squish aria-label={label} onClick={onClick} className="flex h-11 w-11 items-center justify-center rounded-full" scale={0.88}>
      {children}
    </Squish>
  );
}

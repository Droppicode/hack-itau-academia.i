import { Gift, Home, LayoutGrid } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtratoIcon, TransferIcon } from "./Icons";
import { Squish } from "./Squish";

const PLACEHOLDER = ["/pagamentos", "/menu"];

export const TABS = [
  { path: "/home", label: "Início", Icon: Home },
  { path: "/extrato", label: "Extrato", Icon: ExtratoIcon },
  { path: "/pagamentos", label: "Pagamentos", Icon: TransferIcon },
  { path: "/pra-voce", label: "Pra você", Icon: Gift },
  { path: "/menu", label: "Menu", Icon: LayoutGrid },
] as const;

export function BottomTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <nav
      className="flex shrink-0 items-start justify-around border-t border-[#D6D6D6] bg-white px-2 pt-[10px]"
      style={{ paddingBottom: "max(26px, env(safe-area-inset-bottom))" }}
    >
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path;
        return (
          <Squish
            key={path}
            onClick={() => !active && navigate(path, { replace: true, state: { tab: true } })}
            className={`flex w-[72px] flex-col items-center ${PLACEHOLDER.includes(path) && !active ? "opacity-40 grayscale" : ""}`}
            scale={0.9}
          >
            {active ? (
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-itau-navy">
                <Icon size={22} color="#FFFFFF" strokeWidth={1.8} />
              </div>
            ) : (
              <>
                <div className="flex h-[26px] items-center">
                  <Icon size={24} color="#333" strokeWidth={1.6} />
                </div>
                <span className="mt-[6px] text-[12px] text-[#333]">{label}</span>
              </>
            )}
          </Squish>
        );
      })}
    </nav>
  );
}

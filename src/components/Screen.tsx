import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  bg?: string;
  statusTone?: "dark" | "light";
  statusBg?: string;
  scrollClassName?: string;
  overlay?: ReactNode;
};

export function Screen({
  children,
  header,
  footer,
  bg = "bg-white",
  statusBg,
  scrollClassName = "",
  overlay,
}: Props) {
  return (
    <div className={`absolute inset-0 flex flex-col ${bg}`}>
      <div className={statusBg} style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="h-3 md:h-5" />
      </div>
      {header}
      <div className={`no-scrollbar flex-1 overflow-y-auto overscroll-contain scroll-smooth ${scrollClassName}`}>
        {children}
      </div>
      {footer}
      {overlay}
    </div>
  );
}

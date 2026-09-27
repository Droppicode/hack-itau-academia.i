import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type UIEvent } from "react";

type Props = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  bg?: string;
  statusTone?: "dark" | "light";
  statusBg?: string;
  scrollClassName?: string;
  overlay?: ReactNode;
  autoHideHeader?: boolean;
};

export function Screen({
  children,
  header,
  footer,
  bg = "bg-white",
  statusBg,
  scrollClassName = "",
  overlay,
  autoHideHeader = false,
}: Props) {
  const headRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const [headH, setHeadH] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!autoHideHeader || !el) return;
    const ro = new ResizeObserver(() => setHeadH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoHideHeader]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const y = e.currentTarget.scrollTop;
    const dy = y - lastY.current;
    if (y < headH) setHidden(false);
    else if (dy > 6) setHidden(true);
    else if (dy < -6) setHidden(false);
    if (Math.abs(dy) > 6 || y < headH) lastY.current = y;
  };

  return (
    <div className={`absolute inset-0 flex flex-col ${bg}`}>
      <div className={`relative z-30 ${statusBg ?? ""}`} style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="h-3 md:h-5" />
      </div>
      {autoHideHeader ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          <motion.div
            ref={headRef}
            className="absolute inset-x-0 top-0 z-20"
            initial={false}
            animate={{ y: hidden ? -headH - 4 : 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
          >
            {header}
          </motion.div>
          <div onScroll={onScroll} className={`no-scrollbar flex-1 overflow-y-auto overscroll-contain scroll-smooth ${scrollClassName}`} style={{ paddingTop: headH }}>
            {children}
          </div>
        </div>
      ) : (
        <>
          {header}
          <div className={`no-scrollbar flex-1 overflow-y-auto overscroll-contain scroll-smooth ${scrollClassName}`}>
            {children}
          </div>
        </>
      )}
      {footer}
      {overlay}
    </div>
  );
}

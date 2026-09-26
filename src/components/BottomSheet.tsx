import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode };

export function BottomSheet({ open, onClose, title, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[20px] bg-white px-5 pt-3"
            style={{ paddingBottom: "max(28px, env(safe-area-inset-bottom))" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onClose();
            }}
          >
            <div className="mx-auto mb-4 h-[5px] w-10 rounded-full bg-[#D6D6D6]" />
            <h2 className="mb-4 text-[20px] font-bold text-itau-text">{title}</h2>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

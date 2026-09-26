import { motion } from "framer-motion";

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      onClick={() => onChange(!on)}
      className={`relative h-[18px] w-[32px] rounded-full border-[1.5px] transition-colors ${
        on ? "border-itau-orange bg-itau-orange" : "border-[#333] bg-white"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        className={`absolute top-[1.5px] h-[12px] w-[12px] rounded-full ${on ? "right-[2px] bg-white" : "left-[2px] bg-[#333]"}`}
      />
    </motion.button>
  );
}

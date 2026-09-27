import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Squish } from "./Squish";

export function IaFab({ bottom = 92 }: { bottom?: number }) {
  const navigate = useNavigate();
  return (
    <div className="pointer-events-none absolute right-4 z-30" style={{ bottom }}>
      <Squish
        aria-label="Falar com a IA.I"
        onClick={() => navigate("/ia")}
        className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(20,33,90,0.25)]"
        scale={0.9}
      >
        <motion.span aria-hidden className="absolute inset-0 rounded-full border-2 border-itau-orange" animate={{ scale: [1, 1.25], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
        <Sparkles size={24} color="#FF6200" fill="#FF6200" />
      </Squish>
    </div>
  );
}

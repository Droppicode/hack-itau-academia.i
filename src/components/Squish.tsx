import { motion, type HTMLMotionProps } from "framer-motion";
import { useToast } from "./Toast";

type Props = HTMLMotionProps<"button"> & { scale?: number; off?: boolean };

export const OFF_CLASS = "opacity-40 grayscale";

export function Squish({ onClick, className = "", scale = 0.96, type = "button", off, ...rest }: Props) {
  const toast = useToast();
  const inactive = off || (!onClick && type !== "submit");
  return (
    <motion.button
      type={type}
      whileTap={{ scale, opacity: 0.85 }}
      transition={{ duration: 0.12 }}
      onClick={inactive ? () => toast() : onClick}
      aria-disabled={inactive || undefined}
      className={`select-none text-left outline-none transition-transform active:scale-[0.97] ${inactive ? OFF_CLASS : ""} ${className}`}
      {...rest}
    />
  );
}

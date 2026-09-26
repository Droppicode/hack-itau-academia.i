import { motion, type HTMLMotionProps } from "framer-motion";
import { useToast } from "./Toast";

type Props = HTMLMotionProps<"button"> & { scale?: number };

export function Squish({ onClick, className = "", scale = 0.96, type = "button", ...rest }: Props) {
  const toast = useToast();
  return (
    <motion.button
      type={type}
      whileTap={{ scale, opacity: 0.85 }}
      transition={{ duration: 0.12 }}
      onClick={onClick ?? (() => toast())}
      className={`select-none text-left outline-none transition-transform active:scale-[0.97] ${className}`}
      {...rest}
    />
  );
}

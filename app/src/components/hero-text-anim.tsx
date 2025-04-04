"use client";

import { motion } from "framer-motion";

export default function HeroTextAnimation() {
  return (
    <motion.h1
      initial={{ y: 100, scale: 0.8, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 14,
        opacity: { delay: 0.1, duration: 0.4 },
      }}
      className="drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] font-anton text-5xl sm:text-7xl xl:text-9xl font-bold tracking-wider leading-tight mb-12 text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-white"
    >
      Enter The Ultimate Prompt Battle Experience
    </motion.h1>
  );
}

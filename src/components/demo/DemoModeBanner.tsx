"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function DemoModeBanner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-center"
    >
      <p className="flex items-center justify-center gap-2 text-sm font-medium text-white">
        <Sparkles className="h-4 w-4" />
        Demo Mode — All data is fictional and for demonstration purposes only
        <Sparkles className="h-4 w-4" />
      </p>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 no-print">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl"
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <FileText className="w-6 h-6 text-accent" />
          <span>ResumeBuilder</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </motion.div>
    </nav>
  );
}

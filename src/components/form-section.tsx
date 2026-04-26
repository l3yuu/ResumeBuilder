"use client";

import { motion } from "framer-motion";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 mb-6"
    >
      <h3 className="text-xl font-bold mb-4 border-b border-border-custom pb-2">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </motion.section>
  );
}

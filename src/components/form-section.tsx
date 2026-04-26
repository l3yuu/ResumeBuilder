"use client";

import { motion } from "framer-motion";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function FormSection({ title, children, action }: FormSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-4 border-b border-border-custom pb-2">
        <h3 className="text-xl font-bold">{title}</h3>
        {action}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.section>
  );
}

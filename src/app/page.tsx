"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Navbar from "@/components/navbar";
import ResumeForm from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { initialData, ResumeData } from "@/lib/types";
import { motion } from "framer-motion";
import { Download, Edit3, Eye, Layers } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`,
  });

  return (
    <div className="min-h-screen pt-32 px-4 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Mobile Toggle */}
        <div className="lg:hidden flex gap-2 mb-4 no-print">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${activeTab === "edit" ? "bg-accent text-background" : "glass opacity-70"
              }`}
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${activeTab === "preview" ? "bg-accent text-background" : "glass opacity-70"
              }`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {/* Editor Side */}
        <div className={`flex-1 ${activeTab === "preview" ? "hidden lg:block" : "block"} no-print`}>
          <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">Design your resume</h2>
              <button
                onClick={() => setIsOrderOpen(!isOrderOpen)}
                className={`p-2 px-3 sm:px-4 rounded-xl flex items-center gap-2 transition-all border text-sm font-medium ${isOrderOpen
                  ? "bg-accent text-background border-accent shadow-lg shadow-accent/20"
                  : "bg-secondary border-white/10 hover:bg-secondary/80 text-foreground/70"
                  }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden xs:inline">Sections</span>
              </button>
            </div>
          </div>
          <ResumeForm initialData={data} onChange={setData} isOrderOpen={isOrderOpen} />
        </div>

        {/* Preview Side */}
        <div className={`flex-1 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 mb-10 no-print">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">Live Preview</h2>
            <button
              onClick={() => handlePrint()}
              className="w-full sm:w-auto p-3 px-6 rounded-2xl bg-accent text-background flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 border border-accent/10"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Print / Download PDF</span>
            </button>
          </div>

          <div className="lg:sticky lg:top-32 no-scrollbar">
            <div className="w-full flex justify-center">
              <div className="flex justify-center w-[210mm] overflow-visible">
                <div className="origin-top scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 transition-transform duration-500 flex-shrink-0">
                  <ResumePreview ref={componentRef} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-12 border-t border-white/10 no-print">
        <div className="flex flex-col items-center justify-center gap-3 pt-10 opacity-70 hover:opacity-100 transition-opacity">
          <p className="text-sm font-medium">
            Made by <span className="text-accent underline decoration-accent/30 underline-offset-4">Leumar Binas</span>
          </p>
          <p className="text-xs font-medium text-center opacity-80">
            Built with Next.js • Tailwind CSS • Framer Motion • Lucide
          </p>
          <p className="text-xs opacity-50 mt-2">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}

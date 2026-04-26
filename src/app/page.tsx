"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Navbar from "@/components/navbar";
import ResumeForm from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { initialData, ResumeData } from "@/lib/types";
import { motion } from "framer-motion";
import { Download, Edit3, Eye } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`,
  });

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <Navbar />
      
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Mobile Toggle */}
        <div className="lg:hidden flex gap-2 mb-4 no-print">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 ${
              activeTab === "edit" ? "bg-accent text-background" : "glass"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 ${
              activeTab === "preview" ? "bg-accent text-background" : "glass"
            }`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {/* Editor Side */}
        <div className={`flex-1 ${activeTab === "preview" ? "hidden lg:block" : "block"} no-print`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Design your resume</h2>
            <button
              onClick={() => handlePrint()}
              className="lg:hidden p-3 rounded-2xl glass-card bg-accent text-background flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <ResumeForm initialData={data} onChange={setData} />
        </div>

        {/* Preview Side */}
        <div className={`flex-1 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          <div className="flex items-center justify-between mb-6 no-print">
            <h2 className="text-3xl font-extrabold tracking-tight">Live Preview</h2>
            <button
              onClick={() => handlePrint()}
              className="hidden lg:flex p-3 px-6 rounded-2xl glass-card bg-accent text-background items-center gap-2 hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
          
          <div className="lg:sticky lg:top-28 overflow-y-auto max-h-[calc(100vh-140px)] rounded-3xl shadow-2xl lg:shadow-none">
            <ResumePreview ref={componentRef} data={data} />
          </div>
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}

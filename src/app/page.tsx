"use client";

import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Navbar from "@/components/navbar";
import ResumeForm from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { initialData, ResumeData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Edit3, Eye, Layers, RotateCcw, Upload, FileJson, Gauge, CheckCircle2, AlertCircle, XCircle, Palette } from "lucide-react";
import { analyzeATS } from "@/lib/ats-score";

export default function Home() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const sanitizeData = (incoming: any): ResumeData => {
    return {
      ...initialData,
      ...incoming,
      personalInfo: { ...initialData.personalInfo, ...(incoming.personalInfo || {}) },
      sectionOrder: incoming.sectionOrder || initialData.sectionOrder,
      experience: incoming.experience || initialData.experience,
      education: incoming.education || initialData.education,
      skillGroups: incoming.skillGroups || initialData.skillGroups,
      projects: incoming.projects || initialData.projects,
      certifications: incoming.certifications || initialData.certifications,
      customSections: incoming.customSections || initialData.customSections || [],
      theme: incoming.theme || initialData.theme || "modern",
      accentColor: incoming.accentColor || initialData.accentColor || "#000000",
    };
  };

  const atsAnalysis = analyzeATS(data);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("resume-data");
    if (savedData) {
      try {
        setData(sanitizeData(JSON.parse(savedData)));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resume-data", JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // Check for page overflow
  useEffect(() => {
    if (componentRef.current) {
      const height = componentRef.current.scrollHeight;
      // 297mm is approx 1122.5px
      const a4HeightPx = 297 * 3.7795275591;
      setIsOverflowing(height > a4HeightPx + 5); // +5px buffer
    }
  }, [data]);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset? This will clear all your data.")) {
      setData(initialData);
      localStorage.removeItem("resume-data");
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume_Data.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setData(sanitizeData(json));
        alert("Resume data imported successfully!");
      } catch (err) {
        alert("Error parsing JSON file. Please make sure it's a valid resume data file.");
      }
    };
    reader.readAsText(file);
  };

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
              <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-center sm:text-left">Design your resume</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsThemeOpen(!isThemeOpen)}
                  className={`p-2 px-3 rounded-xl flex items-center gap-2 transition-all border text-sm font-medium ${isThemeOpen
                    ? "bg-accent text-background border-accent shadow-lg shadow-accent/20"
                    : "bg-secondary border-white/10 hover:bg-secondary/80 text-foreground/70"
                    }`}
                  title="Themes & Appearance"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden xs:inline">Theme</span>
                </button>
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
                <button
                  onClick={handleReset}
                  className="p-2 px-3 rounded-xl flex items-center gap-2 transition-all border border-white/10 bg-secondary hover:bg-red-500/10 hover:text-red-500 text-foreground/70 text-sm font-medium"
                  title="Reset to Template"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={exportJSON}
                  className="p-2 px-3 rounded-xl flex items-center gap-2 transition-all border border-white/10 bg-secondary hover:bg-accent/10 hover:text-accent text-foreground/70 text-sm font-medium"
                  title="Export Data (JSON)"
                >
                  <FileJson className="w-4 h-4" />
                </button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importJSON}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Import Data (JSON)"
                  />
                  <button
                    className="p-2 px-3 rounded-xl flex items-center gap-2 transition-all border border-white/10 bg-secondary hover:bg-accent/10 hover:text-accent text-foreground/70 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ResumeForm initialData={data} onChange={setData} isOrderOpen={isOrderOpen} />
        </div>

        {/* Preview Side */}
        <div className={`flex-1 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 mb-10 no-print">
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-center sm:text-left">Live Preview</h2>
              <button
                onClick={() => setIsATSOpen(!isATSOpen)}
                className={`p-2 px-3 rounded-xl flex items-center gap-2 transition-all border text-sm font-medium ${isATSOpen
                  ? "bg-accent text-background border-accent shadow-lg shadow-accent/20"
                  : "bg-secondary border-white/10 hover:bg-secondary/80 text-foreground/70"
                  }`}
              >
                <Gauge className="w-4 h-4" />
                <span className="hidden xs:inline">ATS Score: {atsAnalysis.score}%</span>
              </button>

              <div className={`p-2 px-3 rounded-xl flex items-center gap-2 border text-sm font-medium transition-all ${isOverflowing ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}`}>
                <div className={`w-2 h-2 rounded-full ${isOverflowing ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                <span className="hidden xs:inline">{isOverflowing ? "2+ Pages" : "1 Page"}</span>
              </div>
            </div>
            <button
              onClick={() => handlePrint()}
              className="w-full sm:w-auto p-3 px-6 rounded-2xl bg-accent text-background flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 border border-accent/10"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Print / Download PDF</span>
            </button>
          </div>

          <AnimatePresence>
            {isThemeOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                className="overflow-hidden no-print"
              >
                <div className="p-6 bg-secondary/20 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-wrap gap-3">
                      {(["modern", "executive", "creative", "minimal"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setData({ ...data, theme: t })}
                          className={`px-6 py-3 rounded-2xl border-2 transition-all capitalize font-bold ${data.theme === t
                            ? "bg-accent text-background border-accent shadow-lg shadow-accent/20"
                            : "bg-secondary/50 border-white/5 hover:border-white/20 opacity-70 hover:opacity-100"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-2xl border border-white/5">
                      <span className="text-sm font-bold uppercase opacity-50">Accent</span>
                      <div className="flex gap-2">
                        {["#000000", "#2563eb", "#db2777", "#16a34a", "#ca8a04"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setData({ ...data, accentColor: c })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${data.accentColor === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <input
                          type="color"
                          value={data.accentColor}
                          onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                          className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isATSOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                className="overflow-hidden no-print"
              >
                <div className="p-6 bg-secondary/20 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-2 p-6 bg-accent/5 rounded-2xl border border-accent/10 min-w-[140px]">
                      <span className="text-sm font-bold uppercase opacity-50 text-center">ATS Score</span>
                      <span className="text-5xl font-black text-accent">{atsAnalysis.score}%</span>
                      <span className="text-xs font-medium opacity-70">{atsAnalysis.wordCount} words</span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {atsAnalysis.checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-white/5">
                          {check.status === "pass" && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          {check.status === "warn" && <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                          {check.status === "fail" && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                          <div>
                            <p className="text-sm font-bold leading-tight">{check.label}</p>
                            <p className="text-[10px] opacity-60 leading-tight">{check.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

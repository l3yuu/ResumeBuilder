"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ResumeData, Experience, Education, Project, SkillGroup, Certification, SectionType } from "@/lib/types";
import { FormSection } from "./form-section";
import { Plus, Trash2, ChevronDown, ChevronUp, X, GripVertical, RotateCcw, Layers, User, Image, Type } from "lucide-react";
import { useState, KeyboardEvent, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

interface ResumeFormProps {
  initialData: ResumeData;
  onChange: (data: ResumeData) => void;
  isOrderOpen?: boolean;
}

const SKILL_SUGGESTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Ruby", "Go", "PHP", "Swift", "Kotlin",
  "React", "Next.js", "Vue", "Angular", "Svelte", "Tailwind CSS", "Redux", "Framer Motion",
  "Node.js", "Express", "NestJS", "Django", "FastAPI", "Spring Boot",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Supabase",
  "AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Vercel",
  "Git", "REST APIs", "GraphQL", "Unit Testing", "Agile"
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - i).toString());
const DEFAULT_SECTION_ORDER: SectionType[] = ["summary", "experience", "education", "skills", "projects", "certifications"];

function DateSelect({ 
  value = "", 
  onChange, 
  label, 
  includePresent = false 
}: { 
  value?: string; 
  onChange: (val: string) => void; 
  label: string;
  includePresent?: boolean;
}) {
  const isPresent = value === "Present";
  
  // Improved parsing for robustness
  let vMonth = "";
  let vYear = "";
  
  if (isPresent) {
    vYear = "Present";
  } else if (value) {
    const parts = value.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      vMonth = parts[0];
      vYear = parts[1];
    } else if (parts.length === 1) {
      if (MONTHS.includes(parts[0])) {
        vMonth = parts[0];
        vYear = YEARS[0];
      } else {
        vMonth = MONTHS[0];
        vYear = parts[0];
      }
    }
  }

  // Ensure we have defaults if we're not in "Present" state
  if (!isPresent) {
    if (!MONTHS.includes(vMonth)) vMonth = MONTHS[0];
    if (!YEARS.includes(vYear) && vYear !== "Present") vYear = YEARS[0];
  }
  
  return (
    <div className="flex-1">
      <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-1">{label}</label>
      <div className="flex gap-2">
        {!isPresent && (
          <select
            value={vMonth}
            onChange={(e) => onChange(`${e.target.value} ${vYear}`)}
            className="flex-1 bg-secondary rounded-xl p-2 outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
        <select
          value={vYear}
          onChange={(e) => {
            const newYear = e.target.value;
            if (newYear === "Present") {
              onChange("Present");
            } else {
              onChange(`${vMonth} ${newYear}`);
            }
          }}
          className={`${isPresent ? 'w-full' : 'flex-1'} bg-secondary rounded-xl p-2 outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer`}
        >
          {includePresent && <option value="Present">Present</option>}
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function ResumeForm({ initialData, onChange, isOrderOpen = false }: ResumeFormProps) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ResumeData>({
    defaultValues: initialData,
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control,
    name: "projects",
  });

  const { fields: skillGroupFields, append: appendSkillGroup, remove: removeSkillGroup } = useFieldArray({
    control,
    name: "skillGroups",
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications",
  });

  const formData = watch();

  const [orderedSections, setOrderedSections] = useState<SectionType[]>(
    initialData.sectionOrder || DEFAULT_SECTION_ORDER
  );

  const handleRestoreOrder = () => {
    setOrderedSections(DEFAULT_SECTION_ORDER);
    setValue("sectionOrder", DEFAULT_SECTION_ORDER);
  };

  // Sync local state with form data changes from outside
  useEffect(() => {
    const currentOrder = watch("sectionOrder");
    if (currentOrder && JSON.stringify(currentOrder) !== JSON.stringify(orderedSections)) {
      setOrderedSections(currentOrder);
    }
  }, [watch("sectionOrder")]);

  // Real-time update to parent state
  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as ResumeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const sections: Record<string, React.ReactNode> = {
    summary: (
      <FormSection title="Professional Summary">
        <textarea
          {...register("summary")}
          placeholder="Briefly describe your professional background and key strengths..."
          className="w-full bg-secondary rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent min-h-[120px] resize-y transition-all"
        />
      </FormSection>
    ),
    experience: (
      <FormSection title="Experience">
        {expFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-secondary/50 rounded-2xl mb-4 relative group">
            <button
              onClick={() => removeExp(index)}
              className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`experience.${index}.company`)}
                placeholder="Company"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <input
                {...register(`experience.${index}.position`)}
                placeholder="Position"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <Controller
                control={control}
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                  <DateSelect 
                    label="Start Date" 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                )}
              />
              <Controller
                control={control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                  <DateSelect 
                    label="End Date" 
                    value={field.value} 
                    onChange={field.onChange} 
                    includePresent 
                  />
                )}
              />
            </div>
            <div className="mt-6 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50">Key Achievements</label>
              <div className="space-y-2">
                <AnimatePresence>
                  {(watch(`experience.${index}.description`) || []).map((_, bulletIndex) => (
                    <motion.div 
                      key={`${field.id}-bullet-${bulletIndex}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex gap-2 items-center group/bullet"
                    >
                      <span className="text-accent font-bold">•</span>
                      <input
                        {...register(`experience.${index}.description.${bulletIndex}`)}
                        placeholder="Describe what you did..."
                        className="flex-1 bg-secondary/50 rounded-xl p-2 outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentDesc = watch(`experience.${index}.description`);
                          const newDesc = currentDesc.filter((_, i) => i !== bulletIndex);
                          const updatedExp = [...formData.experience];
                          updatedExp[index].description = newDesc;
                          onChange({ ...formData, experience: updatedExp });
                        }}
                        className="p-1.5 text-red-500 opacity-0 group-hover/bullet:opacity-100 transition-opacity hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentDesc = watch(`experience.${index}.description`) || [];
                  const updatedExp = [...formData.experience];
                  updatedExp[index].description = [...currentDesc, ""];
                  onChange({ ...formData, experience: updatedExp });
                }}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-accent transition-all mt-2"
              >
                <Plus className="w-3 h-3" /> Add Achievement
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => appendExp({ id: Math.random().toString(), company: "", position: "", location: "", startDate: "", endDate: "", description: [""] })}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </FormSection>
    ),
    education: (
      <FormSection title="Education">
        {eduFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-secondary/50 rounded-2xl mb-4 relative group">
            <button
              onClick={() => removeEdu(index)}
              className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`education.${index}.school`)}
                placeholder="School"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <input
                {...register(`education.${index}.degree`)}
                placeholder="Degree"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <Controller
                control={control}
                name={`education.${index}.startDate`}
                render={({ field }) => (
                  <DateSelect 
                    label="Start Date" 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                )}
              />
              <Controller
                control={control}
                name={`education.${index}.endDate`}
                render={({ field }) => (
                  <DateSelect 
                    label="Graduation" 
                    value={field.value} 
                    onChange={field.onChange} 
                    includePresent 
                  />
                )}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => appendEdu({ id: Math.random().toString(), school: "", degree: "", location: "", startDate: "", endDate: "" })}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </FormSection>
    ),
    skills: (
      <FormSection title="Skills">
        <div className="space-y-6">
          {skillGroupFields.map((field, groupIndex) => (
            <div key={field.id} className="p-4 bg-secondary/30 rounded-2xl relative group">
              <button
                onClick={() => removeSkillGroup(groupIndex)}
                className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-1">Category</label>
                <input
                  {...register(`skillGroups.${groupIndex}.category`)}
                  placeholder="e.g. Frontend, Languages..."
                  className="w-full bg-secondary rounded-xl p-2 font-medium focus:ring-2 focus:ring-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <AnimatePresence>
                    {watch(`skillGroups.${groupIndex}.skills`)?.map((skill, skillIndex) => (
                      <motion.span
                        key={`${field.id}-${skill}-${skillIndex}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-accent text-background px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const currentSkills = watch(`skillGroups.${groupIndex}.skills`);
                            const newSkills = currentSkills.filter((_, i) => i !== skillIndex);
                            const updatedGroups = [...formData.skillGroups];
                            updatedGroups[groupIndex].skills = newSkills;
                            onChange({ ...formData, skillGroups: updatedGroups });
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <input
                    placeholder="Type a skill and press Enter..."
                    className="w-full bg-secondary rounded-xl p-2 outline-none focus:ring-2 focus:ring-accent"
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          const currentSkills = watch(`skillGroups.${groupIndex}.skills`) || [];
                          if (!currentSkills.includes(value)) {
                            const updatedGroups = [...formData.skillGroups];
                            updatedGroups[groupIndex].skills = [...currentSkills, value];
                            onChange({ ...formData, skillGroups: updatedGroups });
                          }
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Suggestions</p>
                  <div className="flex flex-wrap gap-1">
                    {SKILL_SUGGESTIONS.filter(s => !watch(`skillGroups.${groupIndex}.skills`)?.includes(s)).slice(0, 12).map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          const currentSkills = watch(`skillGroups.${groupIndex}.skills`) || [];
                          const updatedGroups = [...formData.skillGroups];
                          updatedGroups[groupIndex].skills = [...currentSkills, suggestion];
                          onChange({ ...formData, skillGroups: updatedGroups });
                        }}
                        className="text-[10px] bg-secondary hover:bg-accent hover:text-background px-2 py-1 rounded-lg transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => appendSkillGroup({ id: Math.random().toString(), category: "", skills: [] })}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Skill Group
          </button>
        </div>
      </FormSection>
    ),
    projects: (
      <FormSection title="Projects">
        {projFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-secondary/50 rounded-2xl mb-4 relative group">
            <button
              onClick={() => removeProj(index)}
              className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`projects.${index}.name`)}
                placeholder="Project Name"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <input
                {...register(`projects.${index}.link`)}
                placeholder="Project Link"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {(watch(`projects.${index}.technologies`) || []).map((tech, techIndex) => (
                    <motion.span
                      key={`${field.id}-tech-${techIndex}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-accent/20 text-accent px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-accent/20"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => {
                          const currentTech = watch(`projects.${index}.technologies`);
                          const newTech = currentTech.filter((_, i) => i !== techIndex);
                          const updatedProj = [...formData.projects];
                          updatedProj[index].technologies = newTech;
                          onChange({ ...formData, projects: updatedProj });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="relative">
                <input
                  placeholder="Type a tech (e.g. React) and press Enter..."
                  className="w-full bg-secondary rounded-xl p-2 outline-none focus:ring-2 focus:ring-accent text-sm"
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        const currentTech = watch(`projects.${index}.technologies`) || [];
                        if (!currentTech.includes(value)) {
                          const updatedProj = [...formData.projects];
                          updatedProj[index].technologies = [...currentTech, value];
                          onChange({ ...formData, projects: updatedProj });
                        }
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {SKILL_SUGGESTIONS.filter(s => !watch(`projects.${index}.technologies`)?.includes(s)).slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      const currentTech = watch(`projects.${index}.technologies`) || [];
                      const updatedProj = [...formData.projects];
                      updatedProj[index].technologies = [...currentTech, suggestion];
                      onChange({ ...formData, projects: updatedProj });
                    }}
                    className="text-[9px] font-bold uppercase tracking-tighter bg-secondary hover:bg-accent hover:text-background px-2 py-0.5 rounded transition-colors opacity-60"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-50">Project Description</label>
              <div className="space-y-2">
                <AnimatePresence>
                  {(watch(`projects.${index}.description`) || []).map((_, bulletIndex) => (
                    <motion.div 
                      key={`${field.id}-proj-bullet-${bulletIndex}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex gap-2 items-center group/bullet"
                    >
                      <span className="text-accent font-bold">•</span>
                      <input
                        {...register(`projects.${index}.description.${bulletIndex}`)}
                        placeholder="Describe what you built..."
                        className="flex-1 bg-secondary/50 rounded-xl p-2 outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentDesc = watch(`projects.${index}.description`);
                          const newDesc = currentDesc.filter((_, i) => i !== bulletIndex);
                          const updatedProj = [...formData.projects];
                          updatedProj[index].description = newDesc;
                          onChange({ ...formData, projects: updatedProj });
                        }}
                        className="p-1.5 text-red-500 opacity-0 group-hover/bullet:opacity-100 transition-opacity hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentDesc = watch(`projects.${index}.description`) || [];
                  const updatedProj = [...formData.projects];
                  updatedProj[index].description = [...currentDesc, ""];
                  onChange({ ...formData, projects: updatedProj });
                }}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-accent transition-all mt-2"
              >
                <Plus className="w-3 h-3" /> Add Detail
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => appendProj({ id: Math.random().toString(), name: "", description: [""], technologies: [], link: "" })}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </FormSection>
    ),
    certifications: (
      <FormSection title="Certifications">
        {certFields.map((field, index: number) => (
          <div key={field.id} className="p-4 bg-secondary/50 rounded-2xl mb-4 relative group">
            <button
              onClick={() => removeCert(index)}
              className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`certifications.${index}.name`)}
                placeholder="Certification Name"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <input
                {...register(`certifications.${index}.issuer`)}
                placeholder="Issuer"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <Controller
                control={control}
                name={`certifications.${index}.date`}
                render={({ field: dField }) => (
                  <DateSelect 
                    label="Date" 
                    value={dField.value} 
                    onChange={dField.onChange} 
                  />
                )}
              />
              <input
                {...register(`certifications.${index}.link`)}
                placeholder="Credential Link"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => appendCert({ id: Math.random().toString(), name: "", issuer: "", date: "", link: "" })}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </FormSection>
    ),
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-20 relative">
      <AnimatePresence>
        {isOrderOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-secondary/20 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">
                    Section Order
                  </h3>
                </div>
                <button
                  onClick={handleRestoreOrder}
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent hover:text-background transition-all opacity-50 hover:opacity-100"
                >
                  <RotateCcw className="w-3 h-3" /> Restore Default
                </button>
              </div>
              <p className="text-[10px] opacity-40 uppercase tracking-tighter mb-4">Drag handles to rearrange the layout of your resume sections</p>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3 flex items-center gap-1.5">
                    <Type className="w-3 h-3" /> Typography
                  </label>
                  <div className="flex bg-secondary/40 rounded-xl p-1 border border-white/5">
                    {(["sans", "serif", "mono"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setValue("font", f)}
                        className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                          watch("font") === f 
                            ? "bg-accent text-background shadow-lg" 
                            : "hover:bg-white/5 opacity-50 hover:opacity-100"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-end">
                  <p className="text-[10px] opacity-40 leading-relaxed italic">
                    Choose a font style that matches your industry. Serif is classic, Sans is modern, and Mono is technical.
                  </p>
                </div>
              </div>

              <Reorder.Group 
                axis="y" 
                values={orderedSections} 
                onReorder={(newOrder) => {
                  setOrderedSections(newOrder);
                  setValue("sectionOrder", newOrder);
                }}
                className="space-y-2"
              >
                {orderedSections.map((section) => (
                  <Reorder.Item 
                    key={section} 
                    value={section}
                    className="bg-secondary/40 p-3 rounded-xl flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-secondary/60 transition-colors border border-white/5 group"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm font-bold capitalize">{section}</span>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FormSection title="Personal Information">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-white/10 group-hover:border-accent/50 transition-all">
                {watch("personalInfo.profilePic") ? (
                  <img src={watch("personalInfo.profilePic")} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 opacity-20" />
                )}
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("profile-pic-upload")?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer"
              >
                <Image className="w-6 h-6 text-white mb-1" />
                <span className="text-[8px] font-bold uppercase text-white">Upload</span>
              </button>
              {watch("personalInfo.profilePic") && (
                <button
                  type="button"
                  onClick={() => setValue("personalInfo.profilePic", "")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setValue("personalInfo.profilePic", reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <p className="text-[8px] font-bold uppercase opacity-30 tracking-widest text-center">Profile Photo<br/>(Optional)</p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
            <label className="block text-sm font-medium opacity-70">Full Name</label>
            <input
              {...register("personalInfo.fullName")}
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70">Email</label>
            <input
              {...register("personalInfo.email")}
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70">Phone</label>
            <input
              {...register("personalInfo.phone")}
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70">Location</label>
            <input
              {...register("personalInfo.location")}
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70">Website</label>
            <input
              {...register("personalInfo.website")}
              placeholder="https://example.com"
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70">GitHub</label>
            <input
              {...register("personalInfo.github")}
              placeholder="github.com/username"
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium opacity-70">LinkedIn</label>
            <input
              {...register("personalInfo.linkedin")}
              placeholder="linkedin.com/in/username"
              className="w-full bg-secondary rounded-xl p-2 mt-1 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          </div>
        </div>
      </FormSection>



      <div className="space-y-6">
        {(formData.sectionOrder || DEFAULT_SECTION_ORDER).map((sectionKey: SectionType) => (
          <div key={sectionKey}>
            {sections[sectionKey]}
          </div>
        ))}
      </div>
    </div>
  );
}

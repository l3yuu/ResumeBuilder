"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { ResumeData, Experience, Education, Project } from "@/lib/types";
import { FormSection } from "./form-section";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeFormProps {
  initialData: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function ResumeForm({ initialData, onChange }: ResumeFormProps) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ResumeData>({
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

  // Watch for changes and call onChange
  const formData = watch();
  
  // Real-time update
  useState(() => {
    const subscription = watch((value) => onChange(value as ResumeData));
    return () => subscription.unsubscribe();
  });

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      <FormSection title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </FormSection>

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
              <input
                {...register(`experience.${index}.startDate`)}
                placeholder="Start Date"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
              <input
                {...register(`experience.${index}.endDate`)}
                placeholder="End Date"
                className="w-full bg-secondary rounded-xl p-2 outline-none"
              />
            </div>
            <textarea
              {...register(`experience.${index}.description.0`)}
              placeholder="Key Achievement (One per line suggested)"
              className="w-full bg-secondary rounded-xl p-2 mt-4 outline-none min-h-[100px]"
            />
          </div>
        ))}
        <button
          onClick={() => appendExp({ id: Math.random().toString(), company: "", position: "", location: "", startDate: "", endDate: "", description: [""] })}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </FormSection>

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

      <FormSection title="Skills">
        <textarea
          defaultValue={initialData.skills.join(", ")}
          onChange={(e) => {
            const skills = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
            onChange({ ...formData, skills });
          }}
          placeholder="React, Next.js, TypeScript..."
          className="w-full bg-secondary rounded-xl p-2 outline-none min-h-[80px]"
        />
        <p className="text-xs opacity-50">Separate skills with commas.</p>
      </FormSection>

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
            <textarea
              {...register(`projects.${index}.description`)}
              placeholder="Project Description"
              className="w-full bg-secondary rounded-xl p-2 mt-4 outline-none min-h-[80px]"
            />
          </div>
        ))}
        <button
          onClick={() => appendProj({ id: Math.random().toString(), name: "", description: "", technologies: [], link: "" })}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </FormSection>
    </div>
  );
}

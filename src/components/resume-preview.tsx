"use client";

import { ResumeData } from "@/lib/types";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";
import React from "react";

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="resume-container w-full max-w-[800px] mx-auto bg-white text-black p-10 shadow-2xl min-h-[1100px] font-sans"
      >
        {/* Header */}
        <header className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
            {data.personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {data.personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {data.personalInfo.location}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-1">
            {data.personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {data.personalInfo.website.replace(/^https?:\/\//, "")}
              </span>
            )}
            {data.personalInfo.github && (
              <span className="flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> {data.personalInfo.github}
              </span>
            )}
            {data.personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> {data.personalInfo.linkedin}
              </span>
            )}
          </div>
        </header>

        {/* Experience */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 uppercase mb-3">
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg">{exp.company}</h3>
                <span className="text-sm font-medium">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="italic">{exp.position}</span>
                <span className="text-sm">{exp.location}</span>
              </div>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {exp.description.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 uppercase mb-3">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{edu.school}</h3>
                <span className="text-sm font-medium">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span>{edu.degree}</span>
                <span className="text-sm">{edu.location}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 uppercase mb-3">
            Skills
          </h2>
          <div className="text-sm">
            <span className="font-bold">Technologies:</span> {data.skills.join(", ")}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 uppercase mb-3">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{proj.name}</h3>
                {proj.link && (
                  <span className="text-xs text-blue-600 underline">
                    {proj.link.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>
              <p className="text-sm">{proj.description}</p>
              <p className="text-xs mt-1 opacity-70 italic">
                {proj.technologies.join(", ")}
              </p>
            </div>
          ))}
        </section>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

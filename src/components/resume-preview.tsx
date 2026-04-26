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
        className={`resume-container w-full max-w-[800px] mx-auto bg-white text-black p-8 shadow-2xl min-h-0 ${
          data.font === "serif" ? "font-serif" : data.font === "mono" ? "font-mono" : "font-sans"
        }`}
      >
        {/* Header */}
        <header className="border-b-2 border-black pb-2 mb-4 flex gap-6 items-start">
          {data.personalInfo.profilePic && (
            <div className="w-24 h-24 overflow-hidden border-2 border-black flex-shrink-0 shadow-sm">
              <img src={data.personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">
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
          </div>
        </header>

        <div className="space-y-4">
          {data.sectionOrder.map((sectionKey) => {
            switch (sectionKey) {
              case "summary":
                return data.summary && (
                  <section key="summary">
                    <h2 className="text-lg font-bold border-b-2 border-black uppercase mb-1.5">
                      Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {data.summary}
                    </p>
                  </section>
                );
              case "experience":
                return (
                  <section key="experience">
                    <h2 className="text-lg font-bold border-b-2 border-black uppercase mb-2">
                      Professional Experience
                    </h2>
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="mb-3">
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
                );
              case "education":
                return (
                  <section key="education">
                    <h2 className="text-lg font-bold border-b-2 border-black uppercase mb-2">
                      Education
                    </h2>
                    {data.education.map((edu) => (
                      <div key={edu.id} className="mb-1.5">
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
                );
              case "skills":
                return (
                  <section key="skills">
                    <h2 className="text-lg font-bold border-b-2 border-black uppercase mb-2">
                      Skills
                    </h2>
                    <div className="space-y-1">
                      {data.skillGroups.map((group) => (
                        <div key={group.id} className="text-sm">
                          <span className="font-bold">{group.category}:</span> {group.skills.join(", ")}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              case "certifications":
                return data.certifications && data.certifications.length > 0 && (
                  <section key="certifications">
                    <h2 className="text-lg font-bold border-b-2 border-black uppercase mb-2">
                      Certifications
                    </h2>
                    <div className="space-y-2">
                      {data.certifications.map((cert) => (
                        <div key={cert.id} className="flex justify-between items-baseline">
                          <div>
                            <span className="font-bold">{cert.name}</span>
                            <span className="mx-1.5 opacity-50">|</span>
                            <span className="text-sm italic">{cert.issuer}</span>
                          </div>
                          <span className="text-sm">{cert.date}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              case "projects":
                return (
                  <section key="projects">
                    <h2 className="text-lg font-bold border-b-2 border-black uppercase mb-2">
                      Projects
                    </h2>
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="mb-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">{proj.name}</h3>
                          {proj.link && (
                            <span className="text-xs text-blue-600 underline">
                              {proj.link.replace(/^https?:\/\//, "")}
                            </span>
                          )}
                        </div>
                        <ul className="list-disc ml-5 text-sm space-y-1 mb-1">
                          {proj.description.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                        <p className="text-xs mt-1 opacity-70 italic">
                          {proj.technologies.join(", ")}
                        </p>
                      </div>
                    ))}
                  </section>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

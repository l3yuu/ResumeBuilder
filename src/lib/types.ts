export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  profilePic?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  isInternship?: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string[];
  technologies: string[];
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description: string[];
  }[];
}

export type SectionType = "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "custom";

export interface ResumeData {
  personalInfo: PersonalInfo;
  sectionOrder: SectionType[];
  summary: string;
  experience: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  theme: "modern" | "executive" | "creative" | "minimal";
  accentColor: string;
  font: "sans" | "serif" | "mono";
}

export const initialData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    profilePic: "",
  },
  font: "sans",
  sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
  summary: "",
  experience: [],
  education: [],
  skillGroups: [],
  projects: [],
  certifications: [],
  customSections: [],
  theme: "modern",
  accentColor: "#000000",
};

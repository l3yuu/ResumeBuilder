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
  font: "sans" | "serif" | "mono";
}

export const initialData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    location: "New York, NY",
    website: "https://johndoe.com",
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    profilePic: "",
  },
  font: "sans",
  sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications", "custom"],
  summary: "Results-driven Senior Developer with 5+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture.",
  experience: [
    {
      id: "1",
      company: "Tech Solutions",
      position: "Senior Developer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: [
        "Led a team of 5 developers to build a scalable microservices architecture.",
        "Optimized database queries, reducing response time by 40%.",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "State University",
      degree: "B.S. in Computer Science",
      location: "New York, NY",
      startDate: "Jan 2016",
      endDate: "Jan 2020",
    },
  ],
  skillGroups: [
    {
      id: "1",
      category: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
    },
    {
      id: "2",
      category: "Technologies",
      skills: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker"],
    },
  ],
  projects: [
    {
      id: "1",
      name: "Resume Builder",
      description: [
        "A premium, ATS-friendly resume builder with real-time preview.",
        "Integrated Framer Motion for smooth animations and micro-interactions.",
      ],
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
      link: "https://github.com/johndoe/resume-builder",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Mar 2023",
      link: "https://aws.amazon.com/certification/",
    },
  ],
  customSections: [],
};

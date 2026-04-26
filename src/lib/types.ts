export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
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
  description: string;
  technologies: string[];
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
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
  },
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
      startDate: "2016",
      endDate: "2020",
    },
  ],
  skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  projects: [
    {
      id: "1",
      name: "Resume Builder",
      description: "A premium, ATS-friendly resume builder with real-time preview.",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
      link: "https://github.com/johndoe/resume-builder",
    },
  ],
};

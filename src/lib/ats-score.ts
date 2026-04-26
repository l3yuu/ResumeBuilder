import { ResumeData } from "./types";

export interface ATSResult {
  score: number;
  wordCount: number;
  checks: {
    label: string;
    status: "pass" | "warn" | "fail";
    message: string;
  }[];
}

export function analyzeATS(data: ResumeData): ATSResult {
  const checks: ATSResult["checks"] = [];
  let score = 0;

  // 1. Word Count Calculation
  const allText = [
    data.summary,
    data.personalInfo.fullName,
    data.personalInfo.location,
    ...data.experience.map(e => `${e.company} ${e.position} ${e.description.join(" ")}`),
    ...data.education.map(e => `${e.school} ${e.degree}`),
    ...data.skillGroups.flatMap(g => g.skills),
    ...data.projects.map(p => `${p.name} ${p.description.join(" ")}`),
    ...data.certifications.map(c => c.name),
    ...data.customSections.flatMap(s => s.items.map(i => `${i.title} ${i.description.join(" ")}`))
  ].join(" ");

  const words = allText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Word Count Scoring
  if (wordCount >= 400 && wordCount <= 800) {
    score += 10;
    checks.push({ label: "Word Count", status: "pass", message: "Ideal length (400-800 words)." });
  } else if (wordCount > 0 && (wordCount < 400 || wordCount > 1000)) {
    checks.push({ label: "Word Count", status: "warn", message: "Length is outside the ideal range (400-800 words)." });
  } else if (wordCount === 0) {
    checks.push({ label: "Word Count", status: "fail", message: "Your resume is empty." });
  }

  // 2. Personal Info
  const hasContact = data.personalInfo.email && data.personalInfo.phone && data.personalInfo.location;
  if (hasContact) {
    score += 15;
    checks.push({ label: "Contact Info", status: "pass", message: "All essential contact details present." });
  } else {
    checks.push({ label: "Contact Info", status: "warn", message: "Missing email, phone, or location." });
  }

  // 3. Summary
  const summaryWords = data.summary.split(/\s+/).filter(w => w.length > 0).length;
  if (summaryWords >= 20 && summaryWords <= 60) {
    score += 15;
    checks.push({ label: "Professional Summary", status: "pass", message: "Concise and impactful summary." });
  } else if (summaryWords > 0) {
    checks.push({ label: "Professional Summary", status: "warn", message: "Summary is either too short or too long." });
  } else {
    checks.push({ label: "Professional Summary", status: "fail", message: "Missing professional summary." });
  }

  // 4. Experience
  const totalBullets = data.experience.reduce((acc, exp) => acc + exp.description.length, 0);
  if (data.experience.length >= 1 && totalBullets >= 3) {
    score += 30;
    checks.push({ label: "Experience", status: "pass", message: "Good number of experience entries and bullets." });
  } else {
    checks.push({ label: "Experience", status: "fail", message: "Add more experience or detailed bullet points." });
  }

  // 5. Skills
  const totalSkills = data.skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
  if (totalSkills >= 8) {
    score += 15;
    checks.push({ label: "Skills", status: "pass", message: "Comprehensive skills section." });
  } else if (totalSkills > 0) {
    checks.push({ label: "Skills", status: "warn", message: "Add more technical skills (8+ recommended)." });
  } else {
    checks.push({ label: "Skills", status: "fail", message: "Missing skills section." });
  }

  // 6. Education
  if (data.education.length > 0) {
    score += 15;
    checks.push({ label: "Education", status: "pass", message: "Education details included." });
  } else {
    checks.push({ label: "Education", status: "fail", message: "Missing education details." });
  }

  return {
    score: Math.min(100, score),
    wordCount,
    checks
  };
}

/**
 * Professional Action Verbs for Resume Optimization
 * Categorized by skill area
 */
const ACTION_VERBS: Record<string, string[]> = {
  leadership: ["Spearheaded", "Orchestrated", "Directed", "Guided", "Mentored", "Pioneered", "Strategized", "Cultivated"],
  development: ["Architected", "Engineered", "Implemented", "Deployed", "Optimized", "Refactored", "Standardized", "Automated"],
  results: ["Accelerated", "Amplified", "Enhanced", "Surpassed", "Maximized", "Generated", "Realized", "Secured", "Catalyzed"],
  communication: ["Collaborated", "Presented", "Negotiated", "Persuaded", "Articulated", "Advocated", "Mediated"],
  creative: ["Conceptualized", "Visualized", "Curated", "Designed", "Revitalized", "Authored"],
};

const ROLE_KEYWORDS: Record<string, string[]> = {
  technical: ["developer", "engineer", "code", "software", "backend", "frontend", "api", "database", "cloud", "aws"],
  management: ["manager", "lead", "director", "team", "project", "strategic", "budget", "operations"],
  creative: ["design", "ui", "ux", "creative", "artist", "brand", "marketing", "content"],
};

const METRIC_SUGGESTIONS = [
  "resulting in a 20% increase in team productivity",
  "reducing operational costs by $15,000 annually",
  "improving system uptime to 99.99%",
  "boosting user engagement by 35% within the first quarter",
  "leading to a 50% faster deployment cycle",
  "cutting load times by 2 seconds on average",
];

const COMMON_REPLACEMENTS: Record<string, string> = {
  "worked on": "Spearheaded the development of",
  "made a": "Engineered a high-performance",
  "helped with": "Collaborated on the optimization of",
  "responsible for": "Directly oversaw the lifecycle of",
  "used": "Leveraged",
  "built": "Architected",
  "created": "Pioneered",
  "fixed": "Resolved critical bottlenecks in",
  "improved": "Significantly enhanced the efficiency of",
  "led": "Orchestrated",
  "I am a": "Accomplished",
  "I have": "Possessing a robust background in",
  "looking for": "Seeking to leverage expertise in",
};

const SUMMARY_TRANSITIONS = [
  "Adept at",
  "Expertise in",
  "Specializing in",
  "Focusing on",
  "Committed to",
];

export async function polishText(text: string): Promise<string> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!text || text.length < 5) return text;

  let polished = text.trim();

  // 0. Basic Grammar & Cleaning
  polished = polished.replace(/\s\s+/g, ' '); // Fix double spaces
  polished = polished.replace(/([,.!?;:])([^\s])/g, '$1 $2'); // Ensure space after punctuation

  // 1. Role Detection
  const lowerText = polished.toLowerCase();
  let detectedRole = "development"; // default
  if (ROLE_KEYWORDS.technical.some(k => lowerText.includes(k))) detectedRole = "development";
  else if (ROLE_KEYWORDS.management.some(k => lowerText.includes(k))) detectedRole = "leadership";
  else if (ROLE_KEYWORDS.creative.some(k => lowerText.includes(k))) detectedRole = "creative";

  // 2. Capitalize first letter
  polished = polished.charAt(0).toUpperCase() + polished.slice(1);

  // 3. Smart replacements based on common weak phrases
  Object.entries(COMMON_REPLACEMENTS).forEach(([weak, strong]) => {
    const regex = new RegExp(`\\b${weak}\\b`, "i"); // More robust regex
    if (regex.test(polished)) {
      polished = polished.replace(regex, (match) => {
        // Keep capitalization if needed
        return match.charAt(0) === match.charAt(0).toUpperCase() 
          ? strong.charAt(0).toUpperCase() + strong.slice(1)
          : strong.toLowerCase();
      });
    }
  });

  // 4. Professional Tone Check (Summary vs Bullet point)
  const isSummary = polished.split(" ").length > 15;
  
  if (isSummary) {
    if (!/^(Accomplished|Results-oriented|Strategic|Experienced|Visionary)/i.test(polished)) {
      const transition = SUMMARY_TRANSITIONS[Math.floor(Math.random() * SUMMARY_TRANSITIONS.length)];
      const prefix = detectedRole === "leadership" ? "Strategic leader" : "Results-oriented professional";
      polished = `${prefix} with a strong background in ${polished.charAt(0).toLowerCase() + polished.slice(1)}`;
    }
  } else {
    // 5. Ensure it starts with an action verb for bullet points
    const words = polished.split(" ");
    const allVerbs = Object.values(ACTION_VERBS).flat();
    const startsWithVerb = allVerbs.some(v => polished.startsWith(v));

    if (!startsWithVerb && words.length > 1) {
      const roleVerbs = ACTION_VERBS[detectedRole] || ACTION_VERBS.development;
      const randomVerb = roleVerbs[Math.floor(Math.random() * roleVerbs.length)];
      
      if (!/^(I|We|My|The|Provided|This)/i.test(polished)) {
        polished = `${randomVerb} ${polished.charAt(0).toLowerCase() + polished.slice(1)}`;
      }
    }
  }

  // 6. Smarter Metric Injection
  if (!isSummary) {
    const hasNumber = /\d+/.test(polished);
    const wordCount = polished.split(" ").length;
    
    if (!hasNumber && wordCount > 6 && wordCount < 15) {
      const randomMetric = METRIC_SUGGESTIONS[Math.floor(Math.random() * METRIC_SUGGESTIONS.length)];
      polished = `${polished.replace(/\.$/, "")}, ${randomMetric}.`;
    }
  }

  // 7. Power Word Injection (The "Smart" part)
  const powerWords = ["scalable", "seamless", "high-impact", "mission-critical", "strategic", "innovative"];
  if (polished.split(" ").length > 10 && !powerWords.some(pw => lowerText.includes(pw))) {
    const pw = powerWords[Math.floor(Math.random() * powerWords.length)];
    polished = polished.replace(/\b(system|process|solution|project|development)\b/i, `${pw} $1`);
  }

  // 8. Final Polish
  if (!polished.endsWith(".")) polished += ".";
  
  // Clean up overlaps
  polished = polished.replace(/Results-oriented professional with a strong background in accomplished/gi, "Accomplished professional with a strong background in");

  return polished;
}

export async function generateSummary(data: any): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const jobTitles = data.experience?.map((e: any) => e.position).filter(Boolean) || [];
  const topSkills = data.skillGroups?.flatMap((g: any) => g.skills).slice(0, 5) || [];
  const years = data.experience?.length * 2 + 1 || 3;

  const mainTitle = jobTitles[0] || "Professional";
  const skillsList = topSkills.join(", ");

  return `Highly motivated ${mainTitle} with over ${years} years of experience in high-growth environments. Expert at leveraging ${skillsList} to build scalable solutions and drive organizational success. Proven track record of delivering high-quality results and leading cross-functional teams toward technical excellence.`;
}

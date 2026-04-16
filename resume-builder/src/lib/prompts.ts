import type { CandidateProfile, ResumeContent } from "./types";

// ─── System prompts ──────────────────────────────────────────────────────────

export const EXTRACT_PROFILE_SYSTEM_PROMPT = `You are a professional data extraction assistant. Your task is to consolidate information from multiple sources (LinkedIn profile data, GitHub profile data, and uploaded document text) into a single, comprehensive candidate profile.

Return a valid JSON object with this structure:
{
  "fullName": "string",
  "headline": "string (professional headline or title)",
  "location": "string",
  "email": "string (optional)",
  "phone": "string (optional)",
  "linkedInUrl": "string (optional)",
  "githubUrl": "string (optional)",
  "summary": "string (brief professional summary, optional)",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string (optional)",
      "duration": "string (e.g. Jan 2021 – Present)",
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "gpa": "string (optional)"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "techStack": ["string"],
      "url": "string (optional)"
    }
  ],
  "certifications": ["string (optional)"]
}

Rules:
- Merge information intelligently — prefer the most complete and recent data across sources
- For experience and education, combine details from multiple sources without duplication
- Extract all skills from job descriptions, GitHub repos/languages, and any uploaded document
- For GitHub projects, extract project name, description, primary language/tech stack, and URL
- Normalize date formats to "Mon YYYY – Mon YYYY" or "Mon YYYY – Present"
- Return ONLY the JSON object, no other text or markdown`;

export const GENERATE_RESUME_SYSTEM_PROMPT = `You are an expert resume writer with 15+ years of experience crafting ATS-optimized resumes for top-tier tech companies.

Return a valid JSON object with this structure:
{
  "name": "string",
  "contact": {
    "email": "string (optional)",
    "phone": "string (optional)",
    "location": "string (optional)",
    "linkedIn": "string (optional)",
    "github": "string (optional)"
  },
  "summary": "string (3-4 impactful sentences)",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string (optional)",
      "duration": "string",
      "bullets": ["string (3-5 per role)"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "gpa": "string (optional)"
    }
  ],
  "skills": [
    {
      "category": "string (e.g. Languages, Frameworks, Cloud & DevOps)",
      "items": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "techStack": ["string"],
      "url": "string (optional)"
    }
  ],
  "certifications": ["string (optional)"]
}

Writing rules:
1. **Summary**: 3-4 sentences. Open with role + years of experience. Highlight core technical strengths. End with career direction or a notable achievement.
2. **Experience bullets**:
   - Always start with a strong past-tense action verb (Led, Built, Reduced, Designed, Shipped, Automated, Scaled, etc.)
   - Quantify impact wherever possible: "Reduced API latency by 40%", "Led a team of 5", "Scaled platform to 2M users"
   - Focus on outcomes, not just responsibilities
   - 3-5 bullets per role
3. **Skills**: Group by logical categories (Languages, Frameworks & Libraries, Cloud & DevOps, Databases, Tools, etc.)
4. **Projects**: Concise 1-2 sentence description emphasizing impact and tech used
5. **Tone**: Confident, professional, active voice. No filler phrases like "responsible for" or "worked on"
6. **ATS optimization**: Use standard section names, include relevant keywords from the profile, avoid tables or graphics

Return ONLY the JSON object, no other text or markdown`;

// ─── Sanitizers ──────────────────────────────────────────────────────────────

export function sanitizeCandidateProfile(raw: unknown): CandidateProfile {
  const r = raw as Record<string, unknown>;
  return {
    fullName: String(r.fullName ?? ""),
    headline: String(r.headline ?? ""),
    location: String(r.location ?? ""),
    email: r.email ? String(r.email) : undefined,
    phone: r.phone ? String(r.phone) : undefined,
    linkedInUrl: r.linkedInUrl ? String(r.linkedInUrl) : undefined,
    githubUrl: r.githubUrl ? String(r.githubUrl) : undefined,
    summary: r.summary ? String(r.summary) : undefined,
    experience: Array.isArray(r.experience)
      ? r.experience.map((e: Record<string, unknown>) => ({
          title: String(e.title ?? ""),
          company: String(e.company ?? ""),
          location: e.location ? String(e.location) : undefined,
          duration: String(e.duration ?? ""),
          description: String(e.description ?? ""),
        }))
      : [],
    education: Array.isArray(r.education)
      ? r.education.map((e: Record<string, unknown>) => ({
          degree: String(e.degree ?? ""),
          institution: String(e.institution ?? ""),
          year: String(e.year ?? ""),
          gpa: e.gpa ? String(e.gpa) : undefined,
        }))
      : [],
    skills: Array.isArray(r.skills) ? r.skills.map(String) : [],
    projects: Array.isArray(r.projects)
      ? r.projects.map((p: Record<string, unknown>) => ({
          name: String(p.name ?? ""),
          description: String(p.description ?? ""),
          techStack: Array.isArray(p.techStack) ? p.techStack.map(String) : [],
          url: p.url ? String(p.url) : undefined,
        }))
      : [],
    certifications: Array.isArray(r.certifications) ? r.certifications.map(String) : undefined,
  };
}

export function sanitizeResumeContent(raw: unknown): ResumeContent {
  const r = raw as Record<string, unknown>;
  const contact = (r.contact ?? {}) as Record<string, unknown>;
  return {
    name: String(r.name ?? ""),
    contact: {
      email: contact.email ? String(contact.email) : undefined,
      phone: contact.phone ? String(contact.phone) : undefined,
      location: contact.location ? String(contact.location) : undefined,
      linkedIn: contact.linkedIn ? String(contact.linkedIn) : undefined,
      github: contact.github ? String(contact.github) : undefined,
    },
    summary: String(r.summary ?? ""),
    experience: Array.isArray(r.experience)
      ? r.experience.map((e: Record<string, unknown>) => ({
          title: String(e.title ?? ""),
          company: String(e.company ?? ""),
          location: e.location ? String(e.location) : undefined,
          duration: String(e.duration ?? ""),
          bullets: Array.isArray(e.bullets) ? e.bullets.map(String) : [],
        }))
      : [],
    education: Array.isArray(r.education)
      ? r.education.map((e: Record<string, unknown>) => ({
          degree: String(e.degree ?? ""),
          institution: String(e.institution ?? ""),
          year: String(e.year ?? ""),
          gpa: e.gpa ? String(e.gpa) : undefined,
        }))
      : [],
    skills: Array.isArray(r.skills)
      ? r.skills.map((s: Record<string, unknown>) => ({
          category: String(s.category ?? ""),
          items: Array.isArray(s.items) ? s.items.map(String) : [],
        }))
      : [],
    projects: Array.isArray(r.projects)
      ? r.projects.map((p: Record<string, unknown>) => ({
          name: String(p.name ?? ""),
          description: String(p.description ?? ""),
          techStack: Array.isArray(p.techStack) ? p.techStack.map(String) : [],
          url: p.url ? String(p.url) : undefined,
        }))
      : [],
    certifications: Array.isArray(r.certifications) ? r.certifications.map(String) : undefined,
  };
}

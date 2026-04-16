// ─── Input types ────────────────────────────────────────────────────────────

export interface BuilderInputs {
  linkedInUrl?: string;
  githubUsername?: string;
  documentFile?: File;
}

// ─── Apify scrape results ────────────────────────────────────────────────────

export interface LinkedInData {
  fullName?: string;
  headline?: string;
  location?: string;
  about?: string;
  email?: string;
  profileUrl?: string;
  experience?: {
    title: string;
    company: string;
    duration?: string;
    description?: string;
    location?: string;
  }[];
  education?: {
    degree?: string;
    fieldOfStudy?: string;
    school: string;
    startYear?: string;
    endYear?: string;
  }[];
  skills?: string[];
  certifications?: { name: string; authority?: string; date?: string }[];
  [key: string]: unknown;
}

export interface GitHubRepo {
  name: string;
  description?: string;
  language?: string;
  stars?: number;
  url?: string;
  topics?: string[];
}

export interface GitHubData {
  username?: string;
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
  email?: string;
  profileUrl?: string;
  repos?: GitHubRepo[];
  languages?: string[];
  [key: string]: unknown;
}

export interface ScrapeResult {
  linkedIn?: LinkedInData;
  github?: GitHubData;
}

// ─── AI pipeline types ───────────────────────────────────────────────────────

export interface CandidateProfile {
  fullName: string;
  headline: string;
  location: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  summary?: string;
  experience: {
    title: string;
    company: string;
    location?: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    techStack: string[];
    url?: string;
  }[];
  certifications?: string[];
}

export interface ResumeContent {
  name: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location?: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    name: string;
    description: string;
    techStack: string[];
    url?: string;
  }[];
  certifications?: string[];
}

// ─── Upload result ───────────────────────────────────────────────────────────

export interface UploadResult {
  gcsPath: string;
  publicUrl: string;
  extractedText: string;
}

// ─── Final generate result ───────────────────────────────────────────────────

export interface GenerateResult {
  resumeContent: ResumeContent;
  pdfGcsUrl: string;
}

// ─── Frontend state machine ──────────────────────────────────────────────────

export type BuilderState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "scraping" }
  | { status: "parsing" }
  | { status: "generating" }
  | { status: "done"; result: GenerateResult }
  | { status: "error"; message: string };

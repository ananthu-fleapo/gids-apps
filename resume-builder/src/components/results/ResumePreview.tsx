"use client";

import { motion } from "framer-motion";
import type { ResumeContent } from "@/lib/types";

interface ResumePreviewProps {
  resume: ResumeContent;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-1 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const { name, contact, summary, experience, education, skills, projects, certifications } = resume;

  const contactItems = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedIn,
    contact.github,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 max-w-2xl w-full font-[Georgia,serif] text-gray-800"
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-indigo-700 mb-1">{name}</h1>
        {contactItems.length > 0 && (
          <p className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
            {contactItems.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </p>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Summary">
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-bold">{exp.title}</p>
                <p className="text-xs text-gray-400">{exp.duration}</p>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {exp.company}{exp.location ? ` · ${exp.location}` : ""}
              </p>
              <ul className="list-none space-y-1">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-xs text-gray-700 flex gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline mb-2">
              <div>
                <p className="text-sm font-bold">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
              <p className="text-xs text-gray-400">
                {edu.year}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div className="space-y-2">
            {skills.map((group, i) => (
              <div key={i} className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-bold text-gray-600 mr-1">{group.category}:</span>
                {group.items.map((item, j) => (
                  <span
                    key={j}
                    className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <p className="text-sm font-bold">{proj.name}</p>
              <p className="text-xs text-gray-600 mb-1">{proj.description}</p>
              <p className="text-xs text-gray-400">{proj.techStack.join(" · ")}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="space-y-1">
            {certifications.map((cert, i) => (
              <li key={i} className="text-xs text-gray-700 flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </motion.div>
  );
}

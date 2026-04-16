// Server-only: renders ResumeContent to a PDF buffer using @react-pdf/renderer

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";
import type { ResumeContent } from "./types";

// Register Helvetica as default (no external fonts needed)
Font.registerHyphenationCallback((word) => [word]);

const INDIGO = "#4f46e5";
const DARK = "#1e293b";
const MUTED = "#64748b";
const LIGHT_BG = "#f1f5f9";
const BORDER = "#e2e8f0";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    paddingHorizontal: 40,
    paddingVertical: 36,
    lineHeight: 1.4,
  },
  // Header
  header: { marginBottom: 16 },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: INDIGO,
    marginBottom: 10,
  },
  headline: { fontSize: 11, color: MUTED, marginBottom: 6 },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9,
    color: MUTED,
  },
  contactItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  divider: { borderBottom: `1pt solid ${BORDER}`, marginVertical: 10 },
  // Section
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INDIGO,
    textTransform: "uppercase",
    marginBottom: 6,
    borderBottom: `1pt solid ${INDIGO}`,
    paddingBottom: 2,
  },
  // Experience
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  expTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  expMeta: { fontSize: 9, color: MUTED },
  bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 8 },
  bulletDot: { width: 10, fontSize: 10, color: INDIGO },
  bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  // Education
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  eduDegree: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  eduMeta: { fontSize: 9, color: MUTED },
  // Skills
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginRight: 4,
  },
  skillTag: {
    backgroundColor: LIGHT_BG,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    fontSize: 8.5,
    color: DARK,
    marginRight: 4,
    marginBottom: 2,
  },
  // Projects
  projectName: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 1 },
  projectDesc: { fontSize: 9.5, lineHeight: 1.4, marginBottom: 2 },
  projectTech: { fontSize: 8.5, color: MUTED },
  // Summary
  summaryText: { fontSize: 9.5, lineHeight: 1.5 },
});

function ContactItem({ label }: { label: string }) {
  return (
    <View style={styles.contactItem}>
      <Text style={{ fontSize: 9, color: MUTED }}>{label}</Text>
    </View>
  );
}

function ResumePdf({ resume }: { resume: ResumeContent }) {
  const {
    name = "",
    contact = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications,
  } = resume;

  const contactItems = [
    contact?.email,
    contact?.phone,
    contact?.location,
    contact?.linkedIn,
    contact?.github,
  ].filter(Boolean) as string[];

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.name }, name),
        React.createElement(
          View,
          { style: styles.contactRow },
          contactItems.map((item, i) =>
            React.createElement(ContactItem, { key: i, label: item }),
          ),
        ),
      ),
      React.createElement(View, { style: styles.divider }),
      // Summary
      summary
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              Text,
              { style: styles.sectionTitle },
              "Summary",
            ),
            React.createElement(Text, { style: styles.summaryText }, summary),
          )
        : null,
      // Experience
      experience.length > 0
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              Text,
              { style: styles.sectionTitle },
              "Experience",
            ),
            experience.map((exp, i) =>
              React.createElement(
                View,
                { key: i, style: { marginBottom: 8 } },
                React.createElement(
                  View,
                  { style: styles.expHeader },
                  React.createElement(
                    Text,
                    { style: styles.expTitle },
                    `${exp.title} — ${exp.company}${exp.location ? `, ${exp.location}` : ""}`,
                  ),
                  React.createElement(
                    Text,
                    { style: styles.expMeta },
                    exp.duration,
                  ),
                ),
                exp.bullets.map((b, j) =>
                  React.createElement(
                    View,
                    { key: j, style: styles.bullet },
                    React.createElement(Text, { style: styles.bulletDot }, "•"),
                    React.createElement(Text, { style: styles.bulletText }, b),
                  ),
                ),
              ),
            ),
          )
        : null,
      // Education
      education.length > 0
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              Text,
              { style: styles.sectionTitle },
              "Education",
            ),
            education.map((edu, i) =>
              React.createElement(
                View,
                { key: i, style: styles.eduRow },
                React.createElement(
                  View,
                  null,
                  React.createElement(
                    Text,
                    { style: styles.eduDegree },
                    edu.degree,
                  ),
                  React.createElement(
                    Text,
                    { style: styles.expMeta },
                    edu.institution,
                  ),
                ),
                React.createElement(
                  Text,
                  { style: styles.eduMeta },
                  `${edu.year}${edu.gpa ? ` · GPA: ${edu.gpa}` : ""}`,
                ),
              ),
            ),
          )
        : null,
      // Skills
      skills.length > 0
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, "Skills"),
            skills.map((group, i) =>
              React.createElement(
                View,
                { key: i, style: styles.skillRow },
                React.createElement(
                  Text,
                  { style: styles.skillCategory },
                  `${group.category}:`,
                ),
                group.items.map((item, j) =>
                  React.createElement(
                    Text,
                    { key: j, style: styles.skillTag },
                    item,
                  ),
                ),
              ),
            ),
          )
        : null,
      // Projects
      projects.length > 0
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              Text,
              { style: styles.sectionTitle },
              "Projects",
            ),
            projects.map((proj, i) =>
              React.createElement(
                View,
                { key: i, style: { marginBottom: 6 } },
                React.createElement(
                  Text,
                  { style: styles.projectName },
                  `${proj.name}${proj.url ? `  ↗ ${proj.url}` : ""}`,
                ),
                React.createElement(
                  Text,
                  { style: styles.projectDesc },
                  proj.description,
                ),
                React.createElement(
                  Text,
                  { style: styles.projectTech },
                  proj.techStack.join(" · "),
                ),
              ),
            ),
          )
        : null,
      // Certifications
      certifications && certifications.length > 0
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(
              Text,
              { style: styles.sectionTitle },
              "Certifications",
            ),
            certifications.map((cert, i) =>
              React.createElement(
                View,
                { key: i, style: styles.bullet },
                React.createElement(Text, { style: styles.bulletDot }, "•"),
                React.createElement(Text, { style: styles.bulletText }, cert),
              ),
            ),
          )
        : null,
    ),
  );
}

export async function renderResumePdf(resume: ResumeContent): Promise<Buffer> {
  // Ensure all required fields have safe values
  const safeResume: ResumeContent = {
    name: resume.name || "Unnamed",
    contact: resume.contact || {},
    summary: resume.summary || "",
    experience: Array.isArray(resume.experience) ? resume.experience : [],
    education: Array.isArray(resume.education) ? resume.education : [],
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    projects: Array.isArray(resume.projects) ? resume.projects : [],
    certifications: resume.certifications || undefined,
  };

  try {
    console.log({ safeResume });
    const buffer = await renderToBuffer(<ResumePdf resume={safeResume} />);
    return Buffer.from(buffer);
  } catch (error) {
    console.error("PDF rendering error:", error);
    // Fallback: return a simple text-based PDF
    const simpleDoc = (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.name}>{safeResume.name}</Text>
          <Text>{safeResume.summary || "Resume"}</Text>
        </Page>
      </Document>
    );
    const buffer = await renderToBuffer(simpleDoc);
    return Buffer.from(buffer);
  }
}

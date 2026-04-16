import type { Metadata } from "next";
import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Builder",
  description:
    "Build a polished, ATS-optimized resume from your LinkedIn, GitHub, and uploaded documents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

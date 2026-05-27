import type { Metadata } from "next";
import { AppProviders } from "@/components/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeIQ — AI Resume Analyzer & ATS Optimizer",
  description:
    "Optimize your resume with AI-powered ATS scoring, keyword analysis, and personalized improvement suggestions.",
  keywords: "resume, ATS, optimizer, AI, job search, career",
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('ats-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (stored !== 'light' && (stored === 'system' ? prefersDark : true));
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased transition-theme font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

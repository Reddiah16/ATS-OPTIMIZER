"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { resumeApi, analysisApi, getErrorMessage } from "@/lib/api";
import { notify } from "@/lib/toast";
import Navbar from "@/components/Navbar";
import { Resume } from "@/types";
import {
  DropZone,
  FilePreviewCard,
  UploadProgressBar,
  ExistingResumesPicker,
  JobDescriptionPanel,
  AnalyzingScreen,
  StepIndicator,
  type UploadStep,
} from "@/components/upload";
import { MIN_JOB_DESC_CHARS } from "@/components/upload/types";

// ─── Upload progress simulator ────────────────────────────────────────────────
function useUploadProgress(isUploading: boolean) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isUploading) {
      if (progress > 0) {
        setProgress(100);
        const t = setTimeout(() => setProgress(0), 600);
        return () => clearTimeout(t);
      }
      return;
    }

    setProgress(5);
    // Simulate realistic S-curve progress
    const intervals: ReturnType<typeof setTimeout>[] = [];
    const schedule = [
      { delay: 200, value: 20 },
      { delay: 600, value: 45 },
      { delay: 1200, value: 65 },
      { delay: 2000, value: 80 },
      { delay: 3200, value: 90 },
    ];
    schedule.forEach(({ delay, value }) => {
      intervals.push(setTimeout(() => setProgress(value), delay));
    });
    return () => intervals.forEach(clearTimeout);
  }, [isUploading]); // eslint-disable-line react-hooks/exhaustive-deps

  return progress;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const router = useRouter();

  const [step, setStep] = useState<UploadStep>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedResume, setSavedResume] = useState<Resume | null>(null);
  const [existingResumes, setExistingResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const uploadProgress = useUploadProgress(isUploading);

  // Load existing resumes
  useEffect(() => {
    resumeApi
      .list()
      .then((r) => setExistingResumes(r.data.resumes ?? []))
      .catch(() => {});
  }, []);

  // ── File drop handler ───────────────────────────────────────────────────────
  const handleFileDrop = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await resumeApi.upload(file);
      setSavedResume(res.data);
      setSelectedResumeId(res.data.id);
      notify.success("Resume uploaded and parsed! 📄");
      setStep("describe");
    } catch (err) {
      const msg = getErrorMessage(err);
      setUploadError(msg);
      notify.error(msg);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleUploadError = useCallback((message: string) => {
    notify.error(message);
  }, []);

  // ── Select existing resume ──────────────────────────────────────────────────
  const handleSelectExisting = useCallback((resume: Resume) => {
    setSavedResume(resume);
    setSelectedResumeId(resume.id);
    setStep("describe");
    notify.success(`Selected: ${resume.original_filename}`);
  }, []);

  // ── Remove file ─────────────────────────────────────────────────────────────
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setSavedResume(null);
    setSelectedResumeId(null);
    setUploadError(null);
    setStep("upload");
  }, []);

  // ── Run analysis ────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      notify.error("Please upload or select a resume first");
      return;
    }
    if (jobDesc.trim().length < MIN_JOB_DESC_CHARS) {
      notify.error(`Job description must be at least ${MIN_JOB_DESC_CHARS} characters`);
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");

    try {
      const res = await analysisApi.create({
        resume_id: selectedResumeId,
        job_description: jobDesc.trim(),
        job_title: jobTitle.trim() || undefined,
      });
      notify.success("Analysis complete! 🎉");
      router.push(`/analysis/${res.data.id}`);
    } catch (err) {
      notify.error(getErrorMessage(err));
      setStep("describe");
      setIsAnalyzing(false);
    }
  };

  const uploadStatus = isUploading
    ? "uploading"
    : uploadError
    ? "error"
    : uploadedFile && savedResume
    ? "success"
    : "idle";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Ambient background ─────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(243 75% 59%) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-20 dark:opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(262 65% 60%) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-15" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-20 pt-10 sm:px-6">
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {step === "analyzing"
              ? "AI Analysis Running"
              : step === "describe"
              ? "Describe the Job"
              : "Upload Your Resume"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "analyzing"
              ? "Sit tight while our AI engine processes your resume"
              : step === "describe"
              ? "Paste the job description to get a precise ATS match score"
              : "PDF or DOCX · Max 10 MB · Secure & private"}
          </p>
        </motion.div>

        {/* ── Step indicator ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10"
        >
          <StepIndicator current={step} />
        </motion.div>

        {/* ── Glassmorphism card ─────────────────────────────────────────────── */}
        <motion.div
          layout
          className={
            "relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/8 " +
            "bg-white/75 dark:bg-white/[0.04] backdrop-blur-2xl " +
            "shadow-[0_8px_32px_hsl(228_30%_4%/0.12),0_2px_8px_hsl(228_30%_4%/0.08)] " +
            "dark:shadow-[0_8px_48px_hsl(228_30%_2%/0.5),0_2px_12px_hsl(228_30%_2%/0.35)]"
          }
        >
          {/* Card shimmer overlay */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.04] via-transparent to-violet-500/[0.06]"
            aria-hidden
          />

          <div className="relative p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Upload ─────────────────────────────────────────── */}
              {step === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <DropZone
                    onFileDrop={handleFileDrop}
                    onError={handleUploadError}
                    isUploading={isUploading}
                  />

                  <UploadProgressBar
                    progress={uploadProgress}
                    status={uploadStatus}
                    filename={uploadedFile?.name}
                    errorMessage={uploadError ?? undefined}
                  />

                  <ExistingResumesPicker
                    resumes={existingResumes}
                    onSelect={handleSelectExisting}
                    selectedId={selectedResumeId}
                  />
                </motion.div>
              )}

              {/* ── Step 2: Job description ─────────────────────────────────── */}
              {step === "describe" && (
                <motion.div
                  key="describe"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {/* Selected resume chip */}
                  {savedResume && (
                    <FilePreviewCard
                      filename={savedResume.original_filename}
                      isParsed={savedResume.has_text}
                      onRemove={handleRemoveFile}
                    />
                  )}

                  <JobDescriptionPanel
                    jobTitle={jobTitle}
                    jobDesc={jobDesc}
                    onJobTitleChange={setJobTitle}
                    onJobDescChange={setJobDesc}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                  />
                </motion.div>
              )}

              {/* ── Step 3: Analyzing ────────────────────────────────────────── */}
              {step === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AnalyzingScreen
                    resumeFilename={savedResume?.original_filename}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Footer tip ────────────────────────────────────────────────────── */}
        {step === "upload" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground/60"
          >
            Your resume is processed securely and never shared. · Supports PDF and DOCX formats.
          </motion.p>
        )}
      </main>
    </div>
  );
}

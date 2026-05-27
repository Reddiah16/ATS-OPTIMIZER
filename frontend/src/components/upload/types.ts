export type UploadStep = "upload" | "describe" | "analyzing";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const ACCEPTED_MIME_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
} as const;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MIN_JOB_DESC_CHARS = 50;

export function validateFile(file: File): FileValidationResult {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["pdf", "docx", "doc"].includes(ext ?? "")) {
    return { valid: false, error: "Only PDF and DOCX files are supported" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File must be under ${MAX_FILE_SIZE_MB} MB` };
  }
  return { valid: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(filename: string): "pdf" | "docx" | "doc" | "generic" {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "docx";
  if (ext === "doc") return "doc";
  return "generic";
}


import type { GeneratedFile } from "@/lib/ai/code-schema";

export function validateGeneratedFiles(
  value: unknown
): value is GeneratedFile[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) {
    return false;
  }

  const seen = new Set<string>();

  for (const file of value) {
    if (
      !file ||
      typeof file.filename !== "string" ||
      typeof file.language !== "string" ||
      typeof file.content !== "string"
    ) {
      return false;
    }

    const filename = file.filename.replace(/\\/g, "/");
    const parts = filename.split("/");

    if (
      filename.length > 200 ||
      filename.startsWith("/") ||
      /^[a-zA-Z]:/.test(filename) ||
      parts.some((part:string) => !part || part === "." || part === "..") ||
      !/^[a-zA-Z0-9._/-]+$/.test(filename) ||
      file.language.length > 50 ||
      file.content.length > 50000 ||
      !file.content.trim() ||
      seen.has(filename)
    ) {
      return false;
    }

    file.filename = filename;
    seen.add(filename);
  }

  return true;
}

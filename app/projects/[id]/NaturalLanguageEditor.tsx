
"use client";

import { useState } from "react";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type Props = {
  projectId: string;
  files: GeneratedFile[];
  onFilesUpdated: (files: GeneratedFile[]) => void;
};

export default function NaturalLanguageEditor({
  projectId,
  files,
  onFilesUpdated,
}: Props) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  async function applyChanges() {
    if (!instruction.trim() || files.length === 0 || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instruction: instruction.trim(),
            files,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not apply your changes."
        );
      }

      onFilesUpdated(data.files);
      setSummary(data.summary || "Your changes have been saved.");
      setInstruction("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 space-y-4 rounded-2xl border border-green-200 bg-white p-5 shadow-sm ">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Ask Shippable to make changes
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Describe what you want in plain English. Your existing code
          editor remains available for manual changes.
        </p>
      </div>

      <textarea
        value={instruction}
        onChange={(event) => setInstruction(event.target.value)}
        placeholder="Example: Change the background to warm beige, make the buttons dark green, and keep all existing features working."
        rows={4}
        maxLength={4000}
        disabled={loading || files.length === 0}
        className="w-full resize-y rounded-xl border border-gray-300 p-4 text-gray-600 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          {files.length === 0
            ? "Generate your code first."
            : `${files.length} files available for editing`}
        </p>

        <button
          type="button"
          onClick={applyChanges}
          disabled={
            loading ||
            !instruction.trim() ||
            files.length === 0
          }
          className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Applying changes..." : "Apply changes"}
        </button>
      </div>

      {loading && (
        <p className="text-sm text-gray-600">
          Shippable is reviewing your files and applying your request.
          Larger changes may take a little while.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {summary && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900"
        >
          <strong>Changes saved</strong>
          <p className="mt-1">{summary}</p>
          <p className="mt-2 text-xs">
            Review the live preview to confirm the result looks right.
          </p>
        </div>
      )}
    </section>
  );
}

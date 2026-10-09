
"use client";

import { useState } from "react";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type GeneratedFilesProps = {
  summary: string;
  files: GeneratedFile[];
};

export default function GeneratedFiles({
  summary,
  files,
}: GeneratedFilesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (files.length === 0) return null;

  const selectedFile = files[selectedIndex] ?? files[0];

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#D1E7D5] bg-white shadow-sm">
      <div className="border-b border-[#D1E7D5] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Generated files
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {files.length} {files.length === 1 ? "file" : "files"} generated
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
            Not executed
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-700">
          {summary}
        </p>
      </div>

      <div className="grid min-w-0 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="Generated files"
          className="border-b border-[#D1E7D5] bg-[#F7FBF7] p-3 md:border-b-0 md:border-r"
        >
          {files.map((file, index) => (
            <button
              key={file.filename}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`mb-1 w-full break-all rounded-lg px-3 py-2 text-left text-sm ${
                index === selectedIndex
                  ? "bg-green-100 font-semibold text-green-900"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              {file.filename}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
            <span className="break-all text-sm font-medium text-gray-800">
              {selectedFile.filename}
            </span>

            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(selectedFile.content);
              }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Copy code
            </button>
          </div>

          <pre className="max-h-[600px] overflow-auto bg-[#111827] p-5 text-sm leading-6 text-gray-100">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

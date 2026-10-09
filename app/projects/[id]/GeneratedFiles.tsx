
// "use client";

// import { useState } from "react";
// import type { GeneratedFile } from "@/lib/ai/code-schema";

// type GeneratedFilesProps = {
//   summary: string;
//   files: GeneratedFile[];
// };

// export default function GeneratedFiles({
//   summary,
//   files,
// }: GeneratedFilesProps) {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   if (files.length === 0) return null;

//   const selectedFile = files[selectedIndex] ?? files[0];

//   return (
//     <section className="mt-8 overflow-hidden rounded-2xl border border-[#D1E7D5] bg-white shadow-sm">
//       <div className="border-b border-[#D1E7D5] p-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               Generated files
//             </h2>
//             <p className="mt-1 text-sm text-gray-600">
//               {files.length} {files.length === 1 ? "file" : "files"} generated
//             </p>
//           </div>

//           <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
//             Not executed
//           </span>
//         </div>

//         <p className="mt-4 text-sm leading-6 text-gray-700">
//           {summary}
//         </p>
//       </div>

//       <div className="grid min-w-0 md:grid-cols-[220px_minmax(0,1fr)]">
//         <nav
//           aria-label="Generated files"
//           className="border-b border-[#D1E7D5] bg-[#F7FBF7] p-3 md:border-b-0 md:border-r"
//         >
//           {files.map((file, index) => (
//             <button
//               key={file.filename}
//               type="button"
//               onClick={() => setSelectedIndex(index)}
//               className={`mb-1 w-full break-all rounded-lg px-3 py-2 text-left text-sm ${
//                 index === selectedIndex
//                   ? "bg-green-100 font-semibold text-green-900"
//                   : "text-gray-700 hover:bg-green-50"
//               }`}
//             >
//               {file.filename}
//             </button>
//           ))}
//         </nav>

//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
//             <span className="break-all text-sm font-medium text-gray-800">
//               {selectedFile.filename}
//             </span>

//             <button
//               type="button"
//               onClick={() => {
//                 void navigator.clipboard.writeText(selectedFile.content);
//               }}
//               className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//             >
//               Copy code
//             </button>
//           </div>

//           <pre className="max-h-[600px] overflow-auto bg-[#111827] p-5 text-sm leading-6 text-gray-100">
//             <code>{selectedFile.content}</code>
//           </pre>
//         </div>
//       </div>
//     </section>
//   );
// }






// "use client";

// import { useState } from "react";
// import type { GeneratedFile } from "@/lib/ai/code-schema";

// type GeneratedFilesProps = {
//   projectId: string;
//   summary: string;
//   files: GeneratedFile[];
//   onFilesSaved: (files: GeneratedFile[]) => void;
// };

// export default function GeneratedFiles({
//   projectId,
//   summary,
//   files,
//   onFilesSaved,
// }: GeneratedFilesProps) {
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [saving, setSaving] = useState(false);
//   const [saveMessage, setSaveMessage] = useState("");
//   const [saveError, setSaveError] = useState("");

//   if (files.length === 0) return null;

//   const selectedFile = files[selectedIndex] ?? files[0];

//   async function handleSave() {
//     setSaving(true);
//     setSaveMessage("");
//     setSaveError("");

//     try {
//       const response = await fetch(`/api/projects/${projectId}/files`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ files }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Could not save files.");
//       }

//       onFilesSaved(data.files ?? files);
//       setSaveMessage("Files saved to your project.");
//     } catch (error) {
//       setSaveError(
//         error instanceof Error ? error.message : "Could not save files."
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <section className="mt-8 overflow-hidden rounded-2xl border border-[#D1E7D5] bg-white shadow-sm">
//       <div className="border-b border-[#D1E7D5] p-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               Generated files
//             </h2>
//             <p className="mt-1 text-sm text-gray-600">
//               {files.length} {files.length === 1 ? "file" : "files"}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={saving}
//             className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {saving ? "Saving..." : "Save files"}
//           </button>
//         </div>

//         <p className="mt-4 text-sm leading-6 text-gray-700">{summary}</p>

//         {saveMessage && (
//           <p role="status" className="mt-3 text-sm text-green-800">
//             {saveMessage}
//           </p>
//         )}

//         {saveError && (
//           <p role="alert" className="mt-3 text-sm text-red-700">
//             {saveError}
//           </p>
//         )}
//       </div>

//       <div className="grid min-w-0 md:grid-cols-[240px_minmax(0,1fr)]">
//         <nav
//           aria-label="Generated files"
//           className="border-b border-[#D1E7D5] bg-[#F7FBF7] p-3 md:border-b-0 md:border-r"
//         >
//           {files.map((file, index) => (
//             <button
//               key={file.filename}
//               type="button"
//               onClick={() => setSelectedIndex(index)}
//               className={`mb-1 w-full break-all rounded-lg px-3 py-2 text-left text-sm ${
//                 index === selectedIndex
//                   ? "bg-green-100 font-semibold text-green-900"
//                   : "text-gray-700 hover:bg-green-50"
//               }`}
//             >
//               {file.filename}
//             </button>
//           ))}
//         </nav>

//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
//             <span className="break-all text-sm font-medium text-gray-800">
//               {selectedFile.filename}
//             </span>

//             <button
//               type="button"
//               onClick={() => {
//                 void navigator.clipboard.writeText(selectedFile.content);
//               }}
//               className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
//             >
//               Copy code
//             </button>
//           </div>

//           <pre className="max-h-[600px] overflow-auto bg-[#111827] p-5 text-sm leading-6 text-gray-100">
//             <code>{selectedFile.content}</code>
//           </pre>
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type GeneratedFilesProps = {
  projectId: string;
  summary: string;
  files: GeneratedFile[];
  onFilesSaved: (files: GeneratedFile[]) => void;
};

export default function GeneratedFiles({
  projectId,
  summary,
  files,
  onFilesSaved,
}: GeneratedFilesProps) {
  const [workingFiles, setWorkingFiles] = useState(files);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWorkingFiles(files);
    setSelectedIndex(0);
    setEditing(false);
  }, [files]);

  const selectedFile = workingFiles[selectedIndex];

  function updateSelectedFile(content: string) {
    setWorkingFiles((current) =>
      current.map((file, index) =>
        index === selectedIndex ? { ...file, content } : file
      )
    );
  }

  async function saveFiles() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: workingFiles }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save files.");
      }

      const savedFiles = data.files ?? workingFiles;
      setWorkingFiles(savedFiles);
      onFilesSaved(savedFiles);
      setEditing(false);
      setMessage("Files saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save files.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelectedFile() {
    if (!selectedFile) return;

    const confirmed = window.confirm(
      `Delete ${selectedFile.filename}? This cannot be undone.`
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: selectedFile.filename }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete the file.");
      }

      const remainingFiles = workingFiles.filter(
        (file) => file.filename !== selectedFile.filename
      );

      setWorkingFiles(remainingFiles);
      onFilesSaved(remainingFiles);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      setEditing(false);
      setMessage("File deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the file.");
    } finally {
      setSaving(false);
    }
  }

  async function copyCode() {
    if (!selectedFile) return;

    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setMessage("Code copied to clipboard.");
      setError("");
    } catch {
      setError("Could not copy code to the clipboard.");
    }
  }

  if (workingFiles.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Generated files</h2>
        <p className="mt-3 text-sm text-gray-600">
          No files to display. Generate code to create new files.
        </p>
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Generated files</h2>
      <p className="mt-2 text-sm text-gray-600">{summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {workingFiles.map((file, index) => (
          <button
            key={file.filename}
            onClick={() => {
              setSelectedIndex(index);
              setEditing(false);
              setMessage("");
              setError("");
            }}
            className={`rounded-lg px-3 py-2 text-sm ${
              index === selectedIndex
                ? "bg-green-100 font-medium text-green-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {file.filename}
          </button>
        ))}
      </div>

      {selectedFile && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedFile.filename}
              </h3>
              <p className="text-xs text-gray-500">
                {selectedFile.language}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyCode}
                disabled={saving || editing}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Copy code
              </button>

              <button
                onClick={() => {
                  setEditing(!editing);
                  setMessage("");
                  setError("");
                }}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {editing ? "Cancel edit" : "Edit code"}
              </button>

              <button
                onClick={deleteSelectedFile}
                disabled={saving}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Delete file
              </button>
            </div>
          </div>

          {editing ? (
            <textarea
              value={selectedFile.content}
              onChange={(event) => updateSelectedFile(event.target.value)}
              spellCheck={false}
              aria-label={`Edit ${selectedFile.filename}`}
              className="mt-4 min-h-[400px] w-full rounded-xl border border-gray-300 bg-gray-950 p-4 font-mono text-sm leading-6 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          ) : (
            <pre className="mt-4 max-h-[600px] overflow-auto rounded-xl bg-gray-950 p-4 text-sm leading-6 text-gray-100">
              <code>{selectedFile.content}</code>
            </pre>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={saveFiles}
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? "Working..." : "Save all files"}
            </button>

            {editing && (
              <span className="text-sm text-amber-700">
                Changes are not saved yet.
              </span>
            )}
          </div>
        </>
      )}

      {message && (
        <p role="status" className="mt-3 text-sm text-green-700">{message}</p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </section>
  );
}

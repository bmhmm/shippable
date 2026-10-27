// "use client";

// import { useEffect, useState } from "react";
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
//   const [workingFiles, setWorkingFiles] = useState(files);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setWorkingFiles(files);
//     setSelectedIndex(0);
//     setEditing(false);
//   }, [files]);

//   const selectedFile = workingFiles[selectedIndex];

//   function updateSelectedFile(content: string) {
//     setWorkingFiles((current) =>
//       current.map((file, index) =>
//         index === selectedIndex ? { ...file, content } : file
//       )
//     );
//   }

//   async function saveFiles() {
//     setSaving(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(`/api/projects/${projectId}/files`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ files: workingFiles }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Could not save files.");
//       }

//       const savedFiles = data.files ?? workingFiles;
//       setWorkingFiles(savedFiles);
//       onFilesSaved(savedFiles);
//       setEditing(false);
//       setMessage("Files saved successfully.");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Could not save files.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function deleteSelectedFile() {
//     if (!selectedFile) return;

//     const confirmed = window.confirm(
//       `Delete ${selectedFile.filename}? This cannot be undone.`
//     );

//     if (!confirmed) return;

//     setSaving(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(`/api/projects/${projectId}/files`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ filename: selectedFile.filename }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Could not delete the file.");
//       }

//       const remainingFiles = workingFiles.filter(
//         (file) => file.filename !== selectedFile.filename
//       );

//       setWorkingFiles(remainingFiles);
//       onFilesSaved(remainingFiles);
//       setSelectedIndex(Math.max(0, selectedIndex - 1));
//       setEditing(false);
//       setMessage("File deleted.");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Could not delete the file.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function copyCode() {
//     if (!selectedFile) return;

//     try {
//       await navigator.clipboard.writeText(selectedFile.content);
//       setMessage("Code copied to clipboard.");
//       setError("");
//     } catch {
//       setError("Could not copy code to the clipboard.");
//     }
//   }

//   if (workingFiles.length === 0) {
//     return (
//       <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
//         <h2 className="text-xl font-bold text-gray-900">Generated files</h2>
//         <p className="mt-3 text-sm text-gray-600">
//           No files to display. Generate code to create new files.
//         </p>
//         {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
//         {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
//       </section>
//     );
//   }

//   return (
//     <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
//       <h2 className="text-xl font-bold text-gray-900">Generated files</h2>
//       <p className="mt-2 text-sm text-gray-600">{summary}</p>

//       <div className="mt-5 flex flex-wrap gap-2">
//         {workingFiles.map((file, index) => (
//           <button
//             key={file.filename}
//             onClick={() => {
//               setSelectedIndex(index);
//               setEditing(false);
//               setMessage("");
//               setError("");
//             }}
//             className={`rounded-lg px-3 py-2 text-sm ${
//               index === selectedIndex
//                 ? "bg-green-100 font-medium text-green-800"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             {file.filename}
//           </button>
//         ))}
//       </div>

//       {selectedFile && (
//         <>
//           <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <h3 className="font-semibold text-gray-900">
//                 {selectedFile.filename}
//               </h3>
//               <p className="text-xs text-gray-500">
//                 {selectedFile.language}
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={copyCode}
//                 disabled={saving || editing}
//                 className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Copy code
//               </button>

//               <button
//                 onClick={() => {
//                   setEditing(!editing);
//                   setMessage("");
//                   setError("");
//                 }}
//                 disabled={saving}
//                 className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
//               >
//                 {editing ? "Cancel edit" : "Edit code"}
//               </button>

//               <button
//                 onClick={deleteSelectedFile}
//                 disabled={saving}
//                 className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
//               >
//                 Delete file
//               </button>
//             </div>
//           </div>

//           {editing ? (
//             <textarea
//               value={selectedFile.content}
//               onChange={(event) => updateSelectedFile(event.target.value)}
//               spellCheck={false}
//               aria-label={`Edit ${selectedFile.filename}`}
//               className="mt-4 min-h-[400px] w-full rounded-xl border border-gray-300 bg-gray-950 p-4 font-mono text-sm leading-6 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
//             />
//           ) : (
//             <pre className="mt-4 max-h-[600px] overflow-auto rounded-xl bg-gray-950 p-4 text-sm leading-6 text-gray-100">
//               <code>{selectedFile.content}</code>
//             </pre>
//           )}

//           <div className="mt-4 flex flex-wrap items-center gap-3">
//             <button
//               onClick={saveFiles}
//               disabled={saving}
//               className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
//             >
//               {saving ? "Working..." : "Save all files"}
//             </button>

//             {editing && (
//               <span className="text-sm text-amber-700">
//                 Changes are not saved yet.
//               </span>
//             )}
//           </div>
//         </>
//       )}

//       {message && (
//         <p role="status" className="mt-3 text-sm text-green-700">{message}</p>
//       )}
//       {error && (
//         <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>
//       )}
//     </section>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type GeneratedFilesProps = {
  projectId: string;
  summary: string;
  files: GeneratedFile[];
  onFilesSaved: (files: GeneratedFile[]) => void;
};

type DraftState = {
  sourceKey: string;
  files: GeneratedFile[];
};

function getSourceKey(files: GeneratedFile[]) {
  return JSON.stringify(
    files.map((file) => [file.filename, file.language, file.content])
  );
}

export default function GeneratedFiles({
  projectId,
  summary,
  files,
  onFilesSaved,
}: GeneratedFilesProps) {
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const sourceKey = getSourceKey(files);

  const [draft, setDraft] = useState<DraftState>({
    sourceKey,
    files,
  });
  const [selectedFilename, setSelectedFilename] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Use the incoming files automatically when a new generation arrives.
  // This avoids synchronously setting state inside an effect.
  const workingFiles =
    draft.sourceKey === sourceKey ? draft.files : files;

  const selectedFile =
    workingFiles.find((file) => file.filename === selectedFilename) ??
    workingFiles[0];

  function updateWorkingFiles(nextFiles: GeneratedFile[]) {
    setDraft({
      sourceKey,
      files: nextFiles,
    });
  }

  function updateSelectedFile(content: string) {
    if (!selectedFile) return;

    updateWorkingFiles(
      workingFiles.map((file) =>
        file.filename === selectedFile.filename
          ? { ...file, content }
          : file
      )
    );
  }

  function selectFile(filename: string) {
    setSelectedFilename(filename);
    setEditing(false);
    setMessage("");
    setError("");
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

      const savedFiles: GeneratedFile[] = data.files ?? workingFiles;

      updateWorkingFiles(savedFiles);
      onFilesSaved(savedFiles);
      setEditing(false);
      setMessage("Files saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save files."
      );
    } finally {
      setSaving(false);
    }
  }

  // async function deleteSelectedFile() {
  //   if (!selectedFile) return;

  //   if (
  //     !window.confirm(
  //       `Delete ${selectedFile.filename}? This cannot be undone.`
  //     )
  //   ) {
  //     return;
  //   }

  //   setSaving(true);
  //   setMessage("");
  //   setError("");

  //   try {
  //     const response = await fetch(`/api/projects/${projectId}/files`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ filename: selectedFile.filename }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Could not delete the file.");
  //     }

  //     const remainingFiles = workingFiles.filter(
  //       (file) => file.filename !== selectedFile.filename
  //     );

  //     updateWorkingFiles(remainingFiles);
  //     onFilesSaved(remainingFiles);
  //     setSelectedFilename(remainingFiles[0]?.filename ?? "");
  //     setEditing(false);
  //     setMessage("File deleted.");
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "Could not delete the file."
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // }



  async function deleteSelectedFile() {
    if (!selectedFile) return;

    if (
      !window.confirm(
        `Delete ${selectedFile.filename}? This cannot be undone.`
      )
    ) {
      return;
    }

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

      updateWorkingFiles(remainingFiles);
      onFilesSaved(remainingFiles);
      setSelectedFilename(remainingFiles[0]?.filename ?? "");
      setEditing(false);
      // setMessage("File deleted.");
      setDeleteMessage("File deleted.");
      setTimeout(() => {
        setDeleteMessage("");
      }, 2000);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the file."
      );
    } finally {
      setSaving(false);
    }
  }

  // async function copyCode() {
  //   if (!selectedFile) return;

  //   try {
  //     await navigator.clipboard.writeText(selectedFile.content);
  //     setMessage("Code copied to clipboard.");
  //     setError("");
  //   } catch {
  //     setError("Could not copy code to the clipboard.");
  //   }
  // }


   async function copyCode() {
  if (!selectedFile) return;

  try {
    await navigator.clipboard.writeText(selectedFile.content);
    setMessage("Code copied to clipboard.");
    setError("");
    
    // Show tooltip and auto-hide after 2 seconds
    setShowTooltip(true);
    setTimeout(() => {
      // setShowTooltip(false);
      setMessage(""); // Clear the message after 2 seconds
    }, 2000);
    
  } catch {
    setError("Could not copy code to the clipboard.");
  }
}


  if (workingFiles.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Generated files
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          No files to display. Generate code to create new files.
        </p>
        {message && (
          <p role="status" className="mt-3 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        Generated files
      </h2>
      <p className="mt-2 text-sm text-gray-600">{summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {workingFiles.map((file) => (
          <button
            key={file.filename}
            type="button"
            onClick={() => selectFile(file.filename)}
            className={`rounded-lg px-3 py-2 text-sm ${
              file.filename === selectedFile?.filename
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
              {/* <button
                type="button"
                onClick={copyCode}
                disabled={saving || editing}
                className="rounded-lg border text-gray-600 border-gray-300 px-3 py-2 text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Copy code
              </button> */}

              <div className="relative inline-block">
  {/* Sleek Floating Pop-up Message */}
  {showTooltip && (
    <div className="absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xl transition-all duration-200 ease-out dark:bg-gray-100 dark:text-gray-900 z-50">
      {message}
      {/* Little downward-pointing arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
    </div>
  )}

  {/* Copy Button */}
  <button
    type="button"
    onClick={copyCode}
    disabled={saving || editing}
    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
  >
    Copy code
  </button>
</div> 

              <button
                type="button"
                onClick={() => {
                  setEditing((current) => !current);
                  setMessage("");
                  setError("");
                }}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {editing ? "Finish editing" : "Edit code"}
              </button>

              <button
                type="button"
                onClick={deleteSelectedFile}
                disabled={saving}
                className="rounded-lg  border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
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
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
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

      {message && (
        <p role="status" className="mt-3 text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AiPlan from "./AiPlan";
import GeneratedFiles from "./GeneratedFiles";
import type { GeneratedFile } from "@/lib/ai/code-schema";
import LivePreview from "./LivePreview";
import ProjectCodeSearch from "./ProjectCodeSearch";
import NaturalLanguageEditor from "./NaturalLanguageEditor";


type SavedVersion = {
  id: string;
  label: string;
  created_at: string;
};

type ApiResponse = {
  response?: string;
  summary?: string;
  files?: GeneratedFile[];
  versions?: SavedVersion[];
  error?: string;
  repositoryUrl?: string;
  uploadedFiles?: number;
};

async function readApiResponse(
  response: Response
): Promise<ApiResponse> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The server returned an unexpected response. Check the terminal."
    );
  }

  return response.json();
}

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [pushingToGitHub, setPushingToGitHub] = useState(false);
  const [githubRepoName, setGithubRepoName] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [githubMessage, setGithubMessage] = useState("");
  const [githubPrivate, setGithubPrivate] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [error, setError] = useState("");
  const [versions, setVersions] = useState<SavedVersion[]>([]);
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);
  const [versionMessage, setVersionMessage] = useState("");
  const [activeSection, setActiveSection] = useState("generated-files");

  useEffect(() => {
    let cancelled = false;

    async function loadSavedFiles() {
      try {
        const response = await fetch(`/api/projects/${projectId}/files`);
        const data = await readApiResponse(response);

        if (!response.ok) {
          throw new Error(data.error || "Could not load saved files.");
        }

        if (!cancelled && data.files?.length) {
          setFiles(data.files);
          setSummary("Previously saved files for this project.");
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load saved files."
          );
        }
      } finally {
        if (!cancelled) setLoadingFiles(false);
      }
    }

    loadSavedFiles();

    return () => {
      cancelled = true;
    };
  }, [projectId]);


useEffect(() => {
  let cancelled = false;

  async function loadVersions() {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/versions`
      );

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load version history."
        );
      }

      if (!cancelled) {
        setVersions(data.versions ?? []);
      }
    } catch (error) {
      if (!cancelled) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load version history."
        );
      }
    }
  }

  loadVersions();

  return () => {
    cancelled = true;
  };
}, [projectId]);



  
async function handleRestoreVersion(versionId: string) {
  const confirmed = window.confirm(
    "Restore this saved version? Your current files will be backed up first."
  );

  if (!confirmed) return;

  setRestoringVersion(versionId);
  setError("");
  setVersionMessage("");

  try {
    const response = await fetch(
      `/api/projects/${projectId}/versions/${versionId}`,
      { method: "POST" }
    );

    const data = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Could not restore this version.");
    }

    if (!data.files) {
      throw new Error("The server did not return the restored files.");
    }

    setFiles(data.files);
    setSummary("Restored a saved version of this project.");
    setVersionMessage("Version restored successfully.");

    const historyResponse = await fetch(
      `/api/projects/${projectId}/versions`
    );
    const historyData = await readApiResponse(historyResponse);

    if (historyResponse.ok) {
      setVersions(historyData.versions ?? []);
    }
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong while restoring the version."
    );
  } finally {
    setRestoringVersion(null);
  }
}

   
  async function handlePlan() {
    if (!prompt.trim()) return;

    setLoadingPlan(true);
    setError("");
    setPlan("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Could not generate a plan.");
      }

      setPlan(data.response ?? "");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleGenerateCode() {
    if (!prompt.trim()) return;

    setGeneratingCode(true);
    setError("");
    setSummary("");
    setFiles([]);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Could not generate code.");
      }

      if (!data.files?.length) {
        throw new Error("The AI did not return any files.");
      }

      setSummary(data.summary ?? "Starter files generated.");
      setFiles(data.files);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setGeneratingCode(false);
    }
  }

  
  async function handleDownloadZip() {
    setDownloadingZip(true);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/export`
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        let message = "Could not download the project ZIP.";

        if (contentType.includes("application/json")) {
          const data = await response.json();
          message = data.error || message;
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const disposition = response.headers.get("content-disposition");
      const filename = disposition?.match(/filename="([^"]+)"/)?.[1]
        ?? "shippable-project.zip";

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while downloading the ZIP."
      );
    } finally {
      setDownloadingZip(false);
    }
  }


 async function handlePushToGitHub() {
  const repoName = githubRepoName.trim();

  if (!repoName) {
    setGithubMessage("Enter a repository name first.");
    return;
  }

  setPushingToGitHub(true);
  setGithubMessage("");
  setGithubRepoUrl("");
  setError("");

  try {
    const response = await fetch(`/api/projects/${projectId}/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoName,
        isPrivate: githubPrivate,
      }),
    });

    const data = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Could not push project to GitHub.");
    }

    setGithubRepoUrl(data.repositoryUrl ?? "");
    setGithubMessage(
      `Successfully uploaded ${data.uploadedFiles ?? 0} files to GitHub.`
    );
  } catch (error) {
    setGithubMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong while pushing to GitHub."
    );
  } finally {
    setPushingToGitHub(false);
  }
}

  return (
    <main className="min-h-screen bg-[#E8F5E9]">
      <header className="border-b border-[#D1E7D5] bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-900">Shippable</h1>

          {/* <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </button> */}

         
<div className="flex items-center gap-3">
  <button
    onClick={handleDownloadZip}
    disabled={downloadingZip}
    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {downloadingZip ? "Preparing ZIP..." : "Download ZIP"}
  </button>

  <button
    onClick={() => router.push("/dashboard")}
    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
  >
    Dashboard
  </button>
</div>


        </div>
      </header>

<section className="border-b border-[#D1E7D5] bg-white px-6 py-5">
  <div className="mx-auto flex max-w-7xl flex-col gap-4">
    <div>
      <h2 className="text-lg font-bold text-gray-900">
        GitHub
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Create a repository and upload your generated project files.
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <input
        value={githubRepoName}
        onChange={(event) => setGithubRepoName(event.target.value)}
        placeholder="Repository name"
        maxLength={100}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
        aria-label="GitHub repository name"
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={githubPrivate}
          onChange={(event) => setGithubPrivate(event.target.checked)}
        />
        Private repository
      </label>
      <a
  href="/api/github/connect"
  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
>
  Connect GitHub
</a>
      <button
        onClick={handlePushToGitHub}
        disabled={pushingToGitHub || !githubRepoName.trim()}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pushingToGitHub ? "Pushing..." : "Push to GitHub"}
      </button>
    </div>

    {githubMessage && (
      <p role="status" className="text-sm text-gray-700">
        {githubMessage}
      </p>
    )}

    {githubRepoUrl && (
      <a
        href={githubRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-green-800 underline"
      >
        Open GitHub repository
      </a>
    )}
  </div>
</section>

      
<section className="px-6 py-10">
  <div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {/* Project sidebar */}
      <aside className="w-full shrink-0 rounded-2xl border border-[#D1E7D5] bg-white p-4 shadow-sm md:sticky md:top-6 md:w-64">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
          Project Workspace
        </h3>

        
<nav className="space-y-2">
  {[
    { id: "generated-files", label: "Generated Files" },
    { id: "live-preview", label: "Live Preview" },
    { id: "ask-shippable", label: "Ask Shippable" },
    { id: "search-project-code", label: "Search Project Code" },
    { id: "version-history", label: "Version History" },
  ].map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      onClick={() => setActiveSection(item.id)}
      className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
        activeSection === item.id
          ? "bg-green-50 font-semibold text-green-800"
          : "text-gray-700 hover:bg-green-50"
      }`}
    >
      {item.label}
    </a>
  ))}
</nav>

      </aside>

     
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-800">
          AI application builder
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Turn your idea into code
        </h2>

        <p className="mt-2 max-w-2xl leading-7 text-gray-600">
          Describe your application. Generate a plan or create starter files
          that you can inspect and save to your project.
        </p>

        <div className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
          <label
            htmlFor="app-prompt"
            className="mb-3 block text-sm font-semibold text-gray-900"
          >
            What do you want to build?
          </label>

          <textarea
            id="app-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Build a responsive task manager with a task list, an add-task form, and completion controls."
            rows={7}
            maxLength={8000}
            className="w-full resize-y rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
            <span>Describe the features and design you want.</span>
            <span>{prompt.length}/8000</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handlePlan}
              disabled={!prompt.trim() || loadingPlan || generatingCode}
              className="rounded-lg border border-green-700 px-5 py-3 font-medium text-green-800 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingPlan ? "Creating plan..." : "Generate plan"}
            </button>

            <button
              onClick={handleGenerateCode}
              disabled={!prompt.trim() || loadingPlan || generatingCode}
              className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingCode ? "Generating files..." : "Generate code"}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}
        </div>

        {plan && <AiPlan response={plan} />}

        {loadingFiles && (
          <p className="mt-6 text-sm text-gray-600">
            Checking for saved project files...
          </p>
        )}

        {files.length > 0 && (
          <>
            <div id="generated-files" className="scroll-mt-6">
              <GeneratedFiles
                projectId={projectId}
                summary={summary}
                files={files}
                onFilesSaved={setFiles}
              />
            </div>

            <div id="live-preview" className="scroll-mt-6">
              <LivePreview files={files} />
            </div>

            <div id="ask-shippable" className="scroll-mt-6">
              <NaturalLanguageEditor
                projectId={projectId}
                files={files}
                onFilesUpdated={setFiles}
              />
            </div>

            <div id="search-project-code" className="scroll-mt-6">
              <ProjectCodeSearch files={files} />
            </div>
          </>
        )}

        
        <div id="version-history" className="mt-8 scroll-mt-6">
          <section className="rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              Version History
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Restore an earlier version if an AI edit changes your project
              in an unwanted way.
            </p>

            {versionMessage && (
              <p role="status" className="mt-4 text-sm text-green-700">
                {versionMessage}
              </p>
            )}

            {versions.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No saved versions found yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {version.label}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(version.created_at).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRestoreVersion(version.id)}
                      disabled={restoringVersion !== null}
                      className="rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {restoringVersion === version.id
                        ? "Restoring..."
                        : "Restore"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}

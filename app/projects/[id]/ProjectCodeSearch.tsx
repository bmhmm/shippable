"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type SearchResult = {
  filename: string;
  line: number;
  column: number;
  length: number;
  text: string;
};

type ProjectCodeSearchProps = {
  files: GeneratedFile[];
};

export default function ProjectCodeSearch({
  files,
}: ProjectCodeSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [pendingJump, setPendingJump] = useState<SearchResult | null>(null);

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const results = useMemo(() => {
    const term = caseSensitive ? query : query.toLowerCase();

    if (!term.trim()) return [];

    const matches: SearchResult[] = [];

    for (const file of files) {
      const lines = file.content.split("\n");

      lines.forEach((line, index) => {
        const searchableLine = caseSensitive
          ? line
          : line.toLowerCase();

        let start = 0;

        while (true) {
          const column = searchableLine.indexOf(term, start);

          if (column === -1) break;

          matches.push({
            filename: file.filename,
            line: index + 1,
            column: column + 1,
            length: term.length,
            text: line.trim() || "(empty line)",
          });

          start = column + Math.max(term.length, 1);
        }
      });
    }

    return matches;
  }, [files, query, caseSensitive]);

  const activeFile =
    files.find((file) => file.filename === selectedFile) ?? files[0];

  function openResult(result: SearchResult) {
    setSelectedFile(result.filename);
    setPendingJump(result);
  }

  useEffect(() => {
    const editor = editorRef.current;

    if (
      !editor ||
      !activeFile ||
      !pendingJump ||
      pendingJump.filename !== activeFile.filename
    ) {
      return;
    }

    let timeoutId: number | undefined;
    let frameId = 0;

    frameId = requestAnimationFrame(() => {
      const model = editor.getModel();

      if (!model) return;

      const line = Math.min(
        pendingJump.line,
        model.getLineCount()
      );

      const column = Math.min(
        pendingJump.column,
        model.getLineMaxColumn(line)
      );

      const endColumn = Math.min(
        column + pendingJump.length,
        model.getLineMaxColumn(line)
      );

      
      editor.setPosition({
        lineNumber: line,
        column,
      });

      editor.setSelection({
        startLineNumber: line,
        startColumn: column,
        endLineNumber: line,
        endColumn,
      });

      editor.revealPositionInCenter({
        lineNumber: line,
        column,
      });

      editor.focus();

      
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: {
              startLineNumber: line,
              startColumn: column,
              endLineNumber: line,
              endColumn,
            },
            options: {
              inlineClassName: "shippable-search-highlight",
              stickiness:
                1, 
            },
          },
        ]
      );

      
      timeoutId = window.setTimeout(() => {
        decorationsRef.current = editor.deltaDecorations(
          decorationsRef.current,
          []
        );
      }, 1500);
    });

    return () => {
      cancelAnimationFrame(frameId);

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }

      if (editorRef.current && decorationsRef.current.length) {
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          []
        );
      }
    };
  }, [activeFile, pendingJump]);

  return (
    <section className="mt-8 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Search project code
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Search every generated file and jump straight to a match.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search functions, variables, text..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-600 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(event) =>
              setCaseSensitive(event.target.checked)
            }
          />
          Match case
        </label>
      </div>

      <p className="text-sm text-gray-600">
        {query.trim()
          ? `${results.length} matching occurrence${results.length === 1 ? "" : "s"} across ${files.length} files`
          : `${files.length} generated files available to search`}
      </p>

      {query.trim() && (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {results.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              No matches found. Try another search term.
            </p>
          ) : (
            results.map((result, index) => (
              <button
                key={`${result.filename}-${result.line}-${result.column}-${index}`}
                onClick={() => openResult(result)}
                className="block w-full rounded-lg border border-gray-200 p-3 text-left transition hover:border-green-400 hover:bg-green-50"
              >
                <span className="block text-xs font-semibold text-green-700">
                  {result.filename} : {result.line}, column {result.column}
                </span>
                <code className="mt-1 block overflow-hidden text-ellipsis whitespace-pre text-sm text-gray-800">
                  {result.text}
                </code>
              </button>
            ))
          )}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <label
          htmlFor="search-file"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Code editor
        </label>

        <select
          id="search-file"
          value={activeFile?.filename ?? ""}
          onChange={(event) => setSelectedFile(event.target.value)}
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-600 text-sm"
        >
          {files.map((file) => (
            <option key={file.filename} value={file.filename}>
              {file.filename}
            </option>
          ))}
        </select>

        {activeFile && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Editor
              height="400px"
              path={activeFile.filename}
              language={
                activeFile.filename.endsWith(".tsx") ||
                activeFile.filename.endsWith(".ts")
                  ? "typescript"
                  : activeFile.filename.endsWith(".css")
                    ? "css"
                    : activeFile.filename.endsWith(".json")
                      ? "json"
                      : activeFile.filename.endsWith(".html")
                        ? "html"
                        : "javascript"
              }
              value={activeFile.content}
              theme="vs-dark"
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          This search editor is read-only. Use Edit Code mode to modify
          and save your files.
        </p>
      </div>
    </section>
  );
}

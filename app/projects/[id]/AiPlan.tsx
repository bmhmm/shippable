"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AiPlanProps = {
  response: string;
};

export default function AiPlan({ response }: AiPlanProps) {
  if (!response) return null;

  // Clean escaped Markdown markers if the AI returns them.
  const cleanedResponse = response
    .replace(/\\([#*_`~])/g, "$1");

  return (
    <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Shippable's plan
      </h2>

      <div className="prose prose-gray max-w-none break-words
        prose-headings:font-semibold
        prose-h2:mt-8 prose-h2:text-xl
        prose-h3:mt-6 prose-h3:text-lg
        prose-p:leading-7
        prose-li:my-1
        prose-strong:text-gray-900">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {cleanedResponse}
        </ReactMarkdown>
      </div>
    </section>
  );
}
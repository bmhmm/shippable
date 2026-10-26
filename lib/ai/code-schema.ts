
// export type GeneratedFile = {
//   filename: string;
//   language: string;
//   content: string;
// };

// export type GeneratedCode = {
//   summary: string;
//   files: GeneratedFile[];
// };

// export const GENERATED_CODE_JSON_SCHEMA = {
//   type: "object",
//   properties: {
//     summary: {
//       type: "string",
//       description: "A brief summary of the generated starter application.",
//     },
//     files: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           filename: {
//             type: "string",
//             description: "A relative project file path.",
//           },
//           language: {
//             type: "string",
//             description: "The programming language or file format.",
//           },
//           content: {
//             type: "string",
//             description: "The complete source code for this file.",
//           },
//         },
//         required: ["filename", "language", "content"],
//         additionalProperties: false,
//       },
//     },
//   },
//   required: ["summary", "files"],
//   additionalProperties: false,
// } as const;






export type GeneratedFile = {
  filename: string;
  language: string;
  content: string;
};

export type GeneratedCode = {
  summary: string;
  files: GeneratedFile[];
};

export const GENERATED_CODE_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description:
        "A concise summary of the application generated and its implemented features.",
    },
    files: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          filename: {
            type: "string",
            description:
              "A unique, safe, relative file path from the project root.",
          },
          language: {
            type: "string",
            description:
              "The programming language or file format, such as typescript, tsx, css, or json.",
          },
          content: {
            type: "string",
            description:
              "The complete source code or file content, without Markdown fences.",
          },
        },
        required: ["filename", "language", "content"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "files"],
  additionalProperties: false,
} as const;

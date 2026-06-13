import { highlightCode } from "@/lib/highlight";
import CodeBlockTabs from "./CodeBlockTabs";

export interface CodeSnippets {
  tsx: string;
  html: string;
}

export default async function CodeBlock({ code }: { code: CodeSnippets }) {
  const [tsxHtml, htmlHtml] = await Promise.all([
    highlightCode(code.tsx, "tsx"),
    highlightCode(code.html, "html"),
  ]);

  const tabs = [
    {
      id: "tsx",
      label: "React + Tailwind + Motion",
      raw: code.tsx,
      html: tsxHtml,
    },
    {
      id: "html",
      label: "HTML + CSS + JS",
      raw: code.html,
      html: htmlHtml,
    },
  ];

  return <CodeBlockTabs tabs={tabs} />;
}

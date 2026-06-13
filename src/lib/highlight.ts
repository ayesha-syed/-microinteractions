import { codeToHtml } from "shiki";

export type SnippetLang = "tsx" | "html";

export async function highlightCode(code: string, lang: SnippetLang) {
  return codeToHtml(code.trim(), {
    lang,
    theme: "github-dark-default",
  });
}

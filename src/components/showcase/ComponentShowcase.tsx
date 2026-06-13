import CodeBlock, { type CodeSnippets } from "./CodeBlock";
import DemoStage from "./DemoStage";

interface ComponentShowcaseProps {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  demo: React.ReactNode;
  code: CodeSnippets;
}

export default function ComponentShowcase({
  id,
  title,
  description,
  tags,
  demo,
  code,
}: ComponentShowcaseProps) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <div className="mb-8">
        <a href={`#${id}`} className="group inline-flex items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {title}
          </h2>
        </a>
        <p className="mt-2 max-w-2xl text-muted">{description}</p>
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DemoStage>{demo}</DemoStage>
        <CodeBlock code={code} />
      </div>
    </section>
  );
}

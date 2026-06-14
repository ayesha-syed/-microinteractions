import CodeBlock, { type CodeSnippets } from "./CodeBlock";
import DemoStage from "./DemoStage";

interface ComponentShowcaseProps {
  id: string;
  title: string;
  description: string;
  demo: React.ReactNode;
  code: CodeSnippets;
}

export default function ComponentShowcase({
  id,
  title,
  description,
  demo,
  code,
}: ComponentShowcaseProps) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <div className="mb-8">
        <a href={`#${id}`} className="group inline-flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-[rgb(237,237,237)] sm:text-2xl">
            {title}
          </h2>
        </a>
        <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DemoStage>{demo}</DemoStage>
        <CodeBlock code={code} />
      </div>
    </section>
  );
}

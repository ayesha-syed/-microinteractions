export default function DemoStage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dot-grid relative flex min-h-[32rem] items-center justify-center rounded-2xl border border-border bg-surface p-4 sm:p-8">
      {children}
    </div>
  );
}

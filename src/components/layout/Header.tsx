import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-text"
        >
          interactive<span className="text-accent">labs</span>
        </Link>
      </div>
    </header>
  );
}

import { components } from "@/lib/components-data";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center sm:pt-28">
      <h1 className="text-4xl font-bold tracking-tight text-text sm:text-6xl">
        Fine-tuned{" "}
        <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
          microinteractions
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted">
        A hands-on collection of smooth, multi-step UI interactions. Play
        with each one, then copy the code in React or plain HTML/CSS/JS.
      </p>
      <div className="mt-8">
        <a
          href={`#${components[0].id}`}
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-soft"
        >
          Start exploring
        </a>
      </div>
    </section>
  );
}

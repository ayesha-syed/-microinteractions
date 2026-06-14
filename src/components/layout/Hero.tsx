export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 sm:pt-28">
      <h1 className="font-display text-3xl font-bold tracking-tight text-[rgb(237,237,237)] uppercase sm:text-5xl">
        Clean,{" "}
        <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
          fine-tuned
        </span>
        , microinteractions
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        A hands-on collection of smooth, multi-step UI interactions.
      </p>
    </section>
  );
}

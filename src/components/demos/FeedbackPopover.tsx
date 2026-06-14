"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

const moods = [
  { id: "bad", emoji: "😞", label: "Bad" },
  { id: "meh", emoji: "😐", label: "Meh" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "great", emoji: "🤩", label: "Great" },
];

export default function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!mood) return;
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setMood(null);
        setMessage("");
      }, 200);
    }, 1600);
  }

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col-reverse items-center gap-2"
    >
      <motion.button
        layout="position"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="group flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-sm transition-colors hover:border-border-strong"
      >
        <MessageSquarePlus className="size-4 text-text" />
        <span className="text-muted transition-colors group-hover:text-text">
          Feedback
        </span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="overflow-hidden"
          >
            <motion.div
              className="z-10 w-[min(18rem,calc(100vw-3rem))] origin-bottom rounded-xl border border-border bg-surface-elevated p-4 shadow-2xl shadow-black/40"
            >
            <AnimatePresence mode="popLayout" initial={false}>
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-sm font-medium text-text">
                    How&apos;s your experience?
                  </p>
                  <div className="flex items-center justify-between">
                    {moods.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-label={option.label}
                        aria-pressed={mood === option.id}
                        onClick={() => setMood(option.id)}
                        className="relative flex size-10 items-center justify-center rounded-full text-xl"
                      >
                        {mood === option.id && (
                          <motion.span
                            layoutId="mood-highlight"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute inset-0 rounded-full bg-accent/20 ring-2 ring-accent"
                          />
                        )}
                        <motion.span
                          animate={{ scale: mood === option.id ? 1.2 : 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                          className="relative"
                        >
                          {option.emoji}
                        </motion.span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us more (optional)"
                    rows={2}
                    className="feedback-textarea-field w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-subtle"
                  />
                  <button
                    type="submit"
                    disabled={!mood}
                    className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send feedback
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3 py-4 text-center"
                >
                  <motion.div className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      Thanks for your feedback!
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      We&apos;ll use this to improve.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

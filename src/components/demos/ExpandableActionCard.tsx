"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const particleCount = 8;

export default function ExpandableActionCard() {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  function toggleLike() {
    setLiked((value) => {
      if (!value) setBurstKey((key) => key + 1);
      return !value;
    });
  }

  function handleShare() {
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1200);
  }

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={() => setExpanded((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setExpanded((value) => !value);
        }
      }}
      className="w-full max-w-sm cursor-pointer rounded-2xl border border-border bg-surface-elevated p-5"
      transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
    >
      <motion.div layout="position" className="flex items-start gap-4">
        <div className="size-12 shrink-0 rounded-xl bg-gradient-to-br from-accent to-accent-soft" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text">
            Designing with motion
          </h3>
          <p className="mt-1 text-sm text-muted">
            Notes on building interfaces that feel alive without getting in
            the way.
          </p>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 shrink-0 text-subtle"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mt-4 flex items-center gap-2 border-t border-border pt-4"
          >
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={(event) => {
                event.stopPropagation();
                toggleLike();
              }}
              className={`relative flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition-colors ${
                liked ? "text-rose-400" : "text-muted hover:text-text"
              }`}
            >
              <Heart
                className="size-4"
                fill={liked ? "currentColor" : "none"}
              />
              Like
              <AnimatePresence>
                {Array.from({ length: particleCount }).map((_, i) => {
                  const angle = (i / particleCount) * Math.PI * 2;
                  return (
                    liked && (
                      <motion.span
                        key={`${burstKey}-${i}`}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{
                          opacity: 0,
                          scale: 1,
                          x: Math.cos(angle) * 28,
                          y: Math.sin(angle) * 28,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="pointer-events-none absolute left-4 top-1/2 size-1.5 rounded-full bg-rose-400"
                      />
                    )
                  );
                })}
              </AnimatePresence>
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={(event) => {
                event.stopPropagation();
                setSaved((value) => !value);
              }}
              className={`flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition-colors ${
                saved ? "text-accent" : "text-muted hover:text-text"
              }`}
            >
              <motion.span
                animate={saved ? { rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.35 }}
              >
                <Bookmark
                  className="size-4"
                  fill={saved ? "currentColor" : "none"}
                />
              </motion.span>
              Save
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={(event) => {
                event.stopPropagation();
                handleShare();
              }}
              className="relative flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-text"
            >
              <Share2 className="size-4" />
              Share
              <AnimatePresence>
                {shareCopied && (
                  <motion.span
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-surface px-2 py-1 text-xs whitespace-nowrap text-text shadow-lg"
                  >
                    Link copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.span
              variants={itemVariants}
              className="ml-auto flex items-center gap-1.5 text-sm text-subtle"
            >
              <MessageCircle className="size-4" />
              12
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

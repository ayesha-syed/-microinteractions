"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart,
  Calendar,
  Check,
  CreditCard,
  FileText,
  Folder,
  LayoutGrid,
  Mail,
  Search,
  Settings,
  User,
} from "lucide-react";

const items = [
  { id: "new-file", label: "New file", icon: FileText, group: "Create" },
  { id: "new-folder", label: "New folder", icon: Folder, group: "Create" },
  { id: "dashboard", label: "Go to dashboard", icon: LayoutGrid, group: "Navigate" },
  { id: "profile", label: "Open profile", icon: User, group: "Navigate" },
  { id: "calendar", label: "Open calendar", icon: Calendar, group: "Navigate" },
  { id: "analytics", label: "View analytics", icon: BarChart, group: "Navigate" },
  { id: "billing", label: "Manage billing", icon: CreditCard, group: "Settings" },
  { id: "settings", label: "Open settings", icon: Settings, group: "Settings" },
  { id: "email", label: "Compose email", icon: Mail, group: "Create" },
];

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  function openMenu() {
    setOpen(true);
    setQuery("");
    setSelectedId(null);
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    function handleGlobalKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => {
          if (value) return false;
          openMenu();
          return true;
        });
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (!item) return;
      setSelectedId(item.id);
      setTimeout(() => setOpen(false), 400);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div>
      <motion.button
        layout="position"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openMenu}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-sm text-muted transition-colors hover:border-border-strong hover:text-text"
      >
        <Search className="size-4" />
        Search commands...
        <kbd className="ml-2 rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-subtle">
          ⌘K
        </kbd>
      </motion.button>

      <AnimatePresence mode="popLayout">
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[18vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl shadow-black/50"
            >
              <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                <Search className="size-4 text-subtle" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent text-sm text-text placeholder:text-subtle focus:outline-none"
                />
                <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-subtle">
                  esc
                </kbd>
              </div>

              <div className="max-h-80 overflow-auto p-2 scrollbar-thin">
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-subtle">
                    No results found.
                  </p>
                )}
                {filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setSelectedId(item.id);
                        setTimeout(() => setOpen(false), 400);
                      }}
                      className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-text"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="command-highlight"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          className="absolute inset-0 rounded-lg bg-accent/15"
                        />
                      )}
                      <Icon className="relative z-10 size-4 text-muted" />
                      <span className="relative z-10 flex-1">{item.label}</span>
                      <span className="relative z-10 text-xs text-subtle">
                        {item.group}
                      </span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="relative z-10 flex items-center text-accent"
                          >
                            <Check className="size-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  LogOut,
  Moon,
  Settings,
  User,
} from "lucide-react";

const menuItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const moreItems = ["Keyboard shortcuts", "Integrations", "Download data"];

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setMoreOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <motion.div
      ref={ref}
      layout
      transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
      className="relative flex flex-col items-center gap-2"
    >
      <motion.button
        layout="position"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1.5 pr-2.5 text-sm text-text transition-colors hover:border-border-strong"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
          AY
        </span>
        Account
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4 text-subtle" />
        </motion.span>
      </motion.button>

      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            className="z-10 w-60 origin-top rounded-xl border border-border bg-surface-elevated p-1.5 shadow-2xl shadow-black/40"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-text"
              >
                {hovered === item.id && (
                  <motion.span
                    layoutId="dropdown-highlight"
                    className="absolute inset-0 rounded-lg bg-surface"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon className="relative z-10 size-4 text-muted" />
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}

            <div
              role="menuitem"
              onMouseEnter={() => setHovered("dark-mode")}
              onMouseLeave={() => setHovered(null)}
              className="relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-text"
            >
              {hovered === "dark-mode" && (
                <motion.span
                  layoutId="dropdown-highlight"
                  className="absolute inset-0 rounded-lg bg-surface"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2.5">
                <Moon className="size-4 text-muted" />
                Dark mode
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={darkMode}
                onClick={() => setDarkMode((value) => !value)}
                className={`relative z-10 flex h-5 w-9 items-center rounded-full transition-colors ${
                  darkMode ? "bg-accent" : "bg-border-strong"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className="size-3.5 rounded-full bg-white"
                  style={{ marginLeft: darkMode ? "calc(100% - 1.125rem)" : "0.125rem" }}
                />
              </button>
            </div>

            <div>
              <button
                type="button"
                role="menuitem"
                aria-expanded={moreOpen}
                onMouseEnter={() => setHovered("more")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setMoreOpen((value) => !value)}
                className="relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-text"
              >
                {hovered === "more" && (
                  <motion.span
                    layoutId="dropdown-highlight"
                    className="absolute inset-0 rounded-lg bg-surface"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Settings className="size-4 text-muted" />
                  More options
                </span>
                <motion.span
                  className="relative z-10"
                  animate={{ rotate: moreOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="size-4 text-subtle" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {moreOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 py-0.5 pl-7">
                      {moreItems.map((label) => (
                        <button
                          key={label}
                          type="button"
                          role="menuitem"
                          onMouseEnter={() => setHovered(label)}
                          onMouseLeave={() => setHovered(null)}
                          className="relative flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-sm text-muted"
                        >
                          {hovered === label && (
                            <motion.span
                              layoutId="dropdown-highlight"
                              className="absolute inset-0 rounded-lg bg-surface"
                              transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                          )}
                          <span className="relative z-10">{label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="my-1 h-px bg-border" />

            <button
              type="button"
              role="menuitem"
              onMouseEnter={() => setHovered("logout")}
              onMouseLeave={() => setHovered(null)}
              className="relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-400"
            >
              {hovered === "logout" && (
                <motion.span
                  layoutId="dropdown-highlight"
                  className="absolute inset-0 rounded-lg bg-surface"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <LogOut className="relative z-10 size-4" />
              <span className="relative z-10">Log out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Save, SlidersHorizontal, Volume2 } from "lucide-react";

const colors = [
  { id: "violet", value: "#8b5cf6" },
  { id: "blue", value: "#3b82f6" },
  { id: "emerald", value: "#10b981" },
  { id: "rose", value: "#f43f5e" },
  { id: "amber", value: "#f59e0b" },
];

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="flex items-center gap-2.5 text-sm text-text">
        <Icon className="size-4 text-muted" />
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border-strong"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="size-3.5 rounded-full bg-white"
          style={{ marginLeft: checked ? "calc(100% - 1.125rem)" : "0.125rem" }}
        />
      </button>
    </div>
  );
}

export default function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(60);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [color, setColor] = useState("violet");
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  function updateFromPointer(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setVolume(Math.round(Math.min(100, Math.max(0, pct))));
  }

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
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-sm text-text transition-colors hover:border-border-strong"
      >
        <SlidersHorizontal className="size-4 text-muted" />
        Customize
      </motion.button>

      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 w-[min(18rem,calc(100vw-3rem))] origin-top rounded-xl border border-border bg-surface-elevated p-4 shadow-2xl shadow-black/40"
          >
            <div className="mb-1 flex items-center justify-between text-sm text-text">
              <span className="flex items-center gap-2.5">
                <Volume2 className="size-4 text-muted" />
                Volume
              </span>
              <span className="font-mono text-xs text-muted">{volume}%</span>
            </div>
            <div
              ref={trackRef}
              onClick={(event) => updateFromPointer(event.clientX)}
              className="relative mb-3 h-1.5 cursor-pointer rounded-full bg-border-strong"
            >
              <div
                className="absolute h-full rounded-full bg-accent"
                style={{ width: `${volume}%` }}
              />
              <motion.div
                onPan={(_event, info) => updateFromPointer(info.point.x)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.25 }}
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full bg-white shadow-md active:cursor-grabbing"
                style={{ left: `${volume}%` }}
              />
            </div>

            <div className="my-2 h-px bg-border" />

            <ToggleRow
              icon={Bell}
              label="Notifications"
              checked={notifications}
              onChange={setNotifications}
            />
            <ToggleRow
              icon={Save}
              label="Auto-save"
              checked={autoSave}
              onChange={setAutoSave}
            />

            <div className="my-2 h-px bg-border" />

            <p className="mb-2 text-sm text-text">Accent color</p>
            <div className="flex gap-2">
              {colors.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  aria-label={swatch.id}
                  onClick={() => setColor(swatch.id)}
                  className="relative flex size-7 items-center justify-center rounded-full"
                  style={{ backgroundColor: swatch.value }}
                >
                  <AnimatePresence>
                    {color === swatch.id && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-white/80 ring-offset-2 ring-offset-surface-elevated"
                      >
                        <Check className="size-3.5 text-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

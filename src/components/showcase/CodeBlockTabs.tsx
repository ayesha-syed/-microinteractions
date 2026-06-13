"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CopyButton from "./CopyButton";

export interface CodeTab {
  id: string;
  label: string;
  raw: string;
  html: string;
}

export default function CodeBlockTabs({ tabs }: { tabs: CodeTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-border px-2">
        <div role="tablist" className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeId}
              onClick={() => setActiveId(tab.id)}
              className="relative px-3 py-2.5 text-xs font-medium transition-colors"
            >
              {tab.id === activeId && (
                <motion.span
                  layoutId="code-tab-indicator"
                  className="absolute inset-x-1 inset-y-1 rounded-md bg-surface"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  tab.id === activeId ? "text-text" : "text-subtle"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <CopyButton text={active.raw} />
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-auto text-sm [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4!">
        <div dangerouslySetInnerHTML={{ __html: active.html }} />
      </div>
    </div>
  );
}

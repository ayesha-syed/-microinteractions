export const commandMenuTsx = `'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart, Calendar, Check, CreditCard, FileText, Folder,
  LayoutGrid, Mail, Search, Settings, User,
} from 'lucide-react';

const items = [
  { id: 'new-file', label: 'New file', icon: FileText, group: 'Create' },
  { id: 'new-folder', label: 'New folder', icon: Folder, group: 'Create' },
  { id: 'dashboard', label: 'Go to dashboard', icon: LayoutGrid, group: 'Navigate' },
  { id: 'profile', label: 'Open profile', icon: User, group: 'Navigate' },
  { id: 'calendar', label: 'Open calendar', icon: Calendar, group: 'Navigate' },
  { id: 'analytics', label: 'View analytics', icon: BarChart, group: 'Navigate' },
  { id: 'billing', label: 'Manage billing', icon: CreditCard, group: 'Settings' },
  { id: 'settings', label: 'Open settings', icon: Settings, group: 'Settings' },
  { id: 'email', label: 'Compose email', icon: Mail, group: 'Create' },
];

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  function openMenu() {
    setOpen(true);
    setQuery('');
    setSelectedId(null);
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  // Global Cmd+K / Ctrl+K shortcut to toggle the menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => {
          if (v) return false;
          openMenu();
          return true;
        });
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (!item) return;
      setSelectedId(item.id);
      setTimeout(() => setOpen(false), 400);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <motion.div ref={ref} className="relative flex flex-col items-center">
      {/* The shell only morphs its width and border radius — its height never
          changes, so this layout animation stays decoupled from the results
          panel growing in below it. The two pieces sit flush with matching
          radii so they read as one component. */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        style={{
          borderTopLeftRadius: open ? 16 : 9999,
          borderTopRightRadius: open ? 16 : 9999,
          borderBottomLeftRadius: open ? 0 : 9999,
          borderBottomRightRadius: open ? 0 : 9999,
        }}
        className={\`command-shell \${open ? 'command-shell--open' : 'command-shell--closed'}\`}
      >
        {open ? (
          <>
            <Search className="size-4 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
            />
            <kbd className="shrink-0">esc</kbd>
          </>
        ) : (
          <button type="button" onClick={openMenu} className="command-trigger">
            <Search className="size-4 shrink-0" />
            <span className="command-trigger-label">Search commands...</span>
            <kbd className="shrink-0">⌘K</kbd>
          </button>
        )}
      </motion.div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="command-results-wrapper"
          >
            <div className="command-results">
              <div className="command-list">
                {filtered.length === 0 && <p className="command-empty">No results found.</p>}
                {filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setSelectedId(item.id);
                        setTimeout(() => setOpen(false), 400);
                      }}
                      className="command-item"
                    >
                      {/* layoutId makes the highlight glide between items as activeIndex changes */}
                      {isActive && (
                        <motion.span
                          layoutId="command-highlight"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                          className="command-highlight"
                        />
                      )}
                      <Icon className="relative size-4" />
                      <span className="relative flex-1">{item.label}</span>
                      <span className="relative command-group">{item.group}</span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="relative command-check"
                          >
                            <Check className="size-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

export const commandMenuHtml = `<div class="command">
  <div class="command-shell command-shell--closed" id="shell">
    <button class="command-trigger" id="trigger" type="button">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <span class="command-trigger-label">Search commands...</span>
      <kbd>⌘K</kbd>
    </button>
  </div>
  <div class="command-results-wrapper" id="resultsWrapper">
    <div class="command-results">
      <div class="command-list" id="list"></div>
    </div>
  </div>
</div>

<style>
.command { position: relative; display: flex; flex-direction: column; align-items: center; }

/* The shell only morphs its width and border radius — its height never
   changes, so the trigger reads as a stable element sliding into its
   new size while the results panel grows in below it. */
.command-shell {
  display: flex; align-items: center; gap: 10px; padding: 8px 14px;
  overflow: hidden; border: 1px solid #27272a; background: #1a1a1d;
  transition: width 0.35s cubic-bezier(0.04,0.62,0.23,0.98), border-radius 0.35s cubic-bezier(0.04,0.62,0.23,0.98);
}
.command-shell--closed { width: fit-content; border-radius: 9999px; }
.command-shell--closed:hover { border-color: #3f3f46; }
.command-shell--open {
  width: 28rem; max-width: calc(100vw - 3rem);
  border-radius: 16px 16px 0 0; border-bottom: none;
}

.command-shell .icon { width: 16px; height: 16px; fill: none; stroke: #71717a; stroke-width: 2; flex-shrink: 0; }
.command-shell input {
  flex: 1; width: 100%; background: none; border: none; color: #fafafa; font-size: 14px; font-family: inherit;
}
.command-shell input:focus,
.command-shell input:focus-visible {
  outline: none; border: none; box-shadow: none;
}
.command-shell input::placeholder { color: #52525b; }
.command-shell kbd {
  font-family: monospace; font-size: 11px; color: #71717a; border: 1px solid #27272a;
  background: #0a0a0b; border-radius: 6px; padding: 2px 6px; flex-shrink: 0;
}

/* The closed trigger renders the exact same icon/text/kbd row as the open
   search input, so the shell only resizes — it never changes appearance. */
.command-trigger {
  display: flex; width: 100%; align-items: center; gap: 10px; padding: 0; border: none; background: none;
  color: #71717a; font-size: 14px; cursor: pointer; font-family: inherit;
}
.command-trigger-label { flex: 1; text-align: left; }

/* Grows in below the shell once it has expanded */
.command-results-wrapper {
  width: 28rem; max-width: calc(100vw - 3rem);
  transform-origin: top center; transform: scale(0.96) translateY(-8px); opacity: 0;
  transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), opacity 0.18s ease; pointer-events: none;
  display: none;
}
.command-results-wrapper.open { display: block; transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }

.command-results {
  border: 1px solid #27272a; border-top: none; background: #1a1a1d;
  border-radius: 0 0 16px 16px; overflow: hidden;
}
.command-list { max-height: 320px; overflow: auto; padding: 8px; }
.command-empty { padding: 24px 12px; text-align: center; color: #52525b; font-size: 14px; }

.command-item {
  position: relative; display: flex; width: 100%; align-items: center; gap: 12px; border-radius: 8px;
  padding: 8px 12px; text-align: left; font-size: 14px; color: #fafafa; background: none; border: none;
}
.command-item.active .command-highlight { opacity: 1; }
.command-highlight {
  position: absolute; inset: 0; border-radius: 8px; background: rgba(139,92,246,0.15); opacity: 0;
}
.command-item .icon, .command-item svg:not(.command-check svg) { width: 16px; height: 16px; fill: none; stroke: #a1a1aa; stroke-width: 2; position: relative; flex-shrink: 0; }
.command-group { position: relative; font-size: 12px; color: #52525b; }
.command-check { position: relative; display: flex; align-items: center; color: #8b5cf6; transform: scale(0); opacity: 0;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease; }
.command-check.show { transform: scale(1); opacity: 1; }
.command-check svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.5; }
</style>

<script>
const items = [
  { id: 'new-file', label: 'New file', group: 'Create', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>' },
  { id: 'new-folder', label: 'New folder', group: 'Create', icon: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>' },
  { id: 'dashboard', label: 'Go to dashboard', group: 'Navigate', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
  { id: 'profile', label: 'Open profile', group: 'Navigate', icon: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>' },
  { id: 'calendar', label: 'Open calendar', group: 'Navigate', icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  { id: 'analytics', label: 'View analytics', group: 'Navigate', icon: '<path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-5"/>' },
  { id: 'billing', label: 'Manage billing', group: 'Settings', icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
  { id: 'settings', label: 'Open settings', group: 'Settings', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
  { id: 'email', label: 'Compose email', group: 'Create', icon: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' },
];

const shell = document.getElementById('shell');
const resultsWrapper = document.getElementById('resultsWrapper');
const list = document.getElementById('list');

let search = null;
let activeIndex = 0;
let selectedId = null;
let filtered = items;

function render() {
  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p class="command-empty">No results found.</p>';
    return;
  }
  filtered.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'command-item' + (i === activeIndex ? ' active' : '');
    btn.innerHTML = \`
      <span class="command-highlight"></span>
      <svg class="icon" viewBox="0 0 24 24">\${item.icon}</svg>
      <span style="position:relative;flex:1">\${item.label}</span>
      <span class="command-group">\${item.group}</span>
      <span class="command-check\${selectedId === item.id ? ' show' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg>
      </span>
    \`;
    btn.addEventListener('mouseenter', () => { activeIndex = i; render(); });
    btn.addEventListener('click', () => select(item));
    list.appendChild(btn);
  });
}

function select(item) {
  selectedId = item.id;
  render();
  setTimeout(close, 400);
}

function isOpen() {
  return shell.classList.contains('command-shell--open');
}

// The shell only resizes (width + border radius) — the icon, label and kbd
// stay in the same row and same styling, so swapping the trigger for the
// search input reads as the bar simply sliding into its new size, while the
// results panel grows in underneath on its own.
function open() {
  shell.classList.remove('command-shell--closed');
  shell.classList.add('command-shell--open');
  shell.innerHTML = \`
    <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input id="search" placeholder="Type a command or search..." />
    <kbd>esc</kbd>
  \`;
  search = document.getElementById('search');
  search.addEventListener('input', handleInput);
  search.addEventListener('keydown', handleKeydown);

  selectedId = null;
  activeIndex = 0;
  filtered = items;
  render();
  resultsWrapper.classList.add('open');
  requestAnimationFrame(() => search.focus());
}

function close() {
  resultsWrapper.classList.remove('open');
  shell.classList.remove('command-shell--open');
  shell.classList.add('command-shell--closed');
  shell.innerHTML = \`
    <button class="command-trigger" id="trigger" type="button">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <span class="command-trigger-label">Search commands...</span>
      <kbd>⌘K</kbd>
    </button>
  \`;
  document.getElementById('trigger').addEventListener('click', open);
}

function handleInput() {
  const q = search.value.trim().toLowerCase();
  filtered = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  activeIndex = 0;
  render();
}

function handleKeydown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
    render();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    render();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const item = filtered[activeIndex];
    if (item) select(item);
  } else if (e.key === 'Escape') {
    close();
  }
}

document.getElementById('trigger').addEventListener('click', open);

document.addEventListener('mousedown', (e) => {
  if (isOpen() && !shell.contains(e.target)) close();
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isOpen() ? close() : open();
  }
});
</script>`;

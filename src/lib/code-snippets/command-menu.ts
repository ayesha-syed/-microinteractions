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
    <div>
      <motion.button
        layout="position"
        onClick={openMenu}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="command-trigger"
      >
        <Search className="size-4" />
        Search commands...
        <kbd>⌘K</kbd>
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
              className="command-overlay"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="command-modal"
            >
              <div className="command-input-row">
                <Search className="size-4" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                />
                <kbd>esc</kbd>
              </div>

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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}`;

export const commandMenuHtml = `<div class="command">
  <button class="command-trigger" id="trigger">
    <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    Search commands...
    <kbd>⌘K</kbd>
  </button>

  <div class="command-overlay" id="overlay" hidden></div>
  <div class="command-modal" id="modal" role="dialog" aria-modal="true" hidden>
    <div class="command-input-row">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="search" placeholder="Type a command or search..." />
      <kbd>esc</kbd>
    </div>
    <div class="command-list" id="list"></div>
  </div>
</div>

<style>
.command-trigger {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 9999px;
  border: 1px solid #27272a; background: #1a1a1d; color: #a1a1aa; font-size: 14px;
}
.command-trigger .icon { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; }
.command-trigger kbd, .command-input-row kbd {
  font-family: monospace; font-size: 11px; color: #71717a; border: 1px solid #27272a;
  background: #0a0a0b; border-radius: 6px; padding: 2px 6px; margin-left: 4px;
}

.command-overlay {
  position: fixed; inset: 0; z-index: 40; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  opacity: 0; transition: opacity 0.15s ease;
}
.command-overlay.open { opacity: 1; }

.command-modal {
  position: fixed; top: 18vh; left: 50%; z-index: 50; width: 100%; max-width: 28rem;
  transform: translateX(-50%) translateY(-8px) scale(0.96); opacity: 0;
  background: #1a1a1d; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  transition: transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease;
}
.command-modal.open { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }

.command-input-row { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #27272a; }
.command-input-row .icon { width: 16px; height: 16px; fill: none; stroke: #71717a; stroke-width: 2; flex-shrink: 0; }
.command-input-row input {
  flex: 1; background: none; border: none; color: #fafafa; font-size: 14px; font-family: inherit;
}
.command-input-row input:focus { outline: none; }
.command-input-row input::placeholder { color: #52525b; }

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

const trigger = document.getElementById('trigger');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const search = document.getElementById('search');
const list = document.getElementById('list');

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

function open() {
  overlay.hidden = false;
  modal.hidden = false;
  search.value = '';
  selectedId = null;
  activeIndex = 0;
  filtered = items;
  render();
  requestAnimationFrame(() => {
    overlay.classList.add('open');
    modal.classList.add('open');
    search.focus();
  });
}

function close() {
  overlay.classList.remove('open');
  modal.classList.remove('open');
  setTimeout(() => { overlay.hidden = true; modal.hidden = true; }, 150);
}

trigger.addEventListener('click', open);
overlay.addEventListener('click', close);

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    modal.hidden ? open() : close();
  }
});

search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  filtered = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  activeIndex = 0;
  render();
});

search.addEventListener('keydown', (e) => {
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
});
</script>`;

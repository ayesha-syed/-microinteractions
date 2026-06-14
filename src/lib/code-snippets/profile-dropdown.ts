export const profileDropdownTsx = `'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, CreditCard, LogOut, Moon, Settings, User } from 'lucide-react';

const menuItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setMoreOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center gap-2"
    >
      <motion.button
        layout="position"
        onClick={() => setOpen((v) => !v)}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="dropdown-trigger"
      >
        Account
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <motion.div className="dropdown-panel">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="dropdown-item"
              >
                {/* Shared layoutId makes the highlight glide between items */}
                {hovered === item.id && (
                  <motion.span
                    layoutId="dropdown-highlight"
                    className="dropdown-highlight"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}

            {/* Toggle switch row */}
            <div className="dropdown-item dropdown-item--row">
              <span><Moon className="size-4" /> Dark mode</span>
              <button
                role="switch"
                aria-checked={darkMode}
                onClick={() => setDarkMode((v) => !v)}
                className={\`switch \${darkMode ? 'switch--on' : ''}\`}
              >
                <motion.span layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} className="switch-knob" />
              </button>
            </div>

            {/* Expandable submenu */}
            <button onClick={() => setMoreOpen((v) => !v)} className="dropdown-item dropdown-item--row">
              <span><Settings className="size-4" /> More options</span>
              <motion.span animate={{ rotate: moreOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {moreOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="dropdown-submenu">
                    <button className="dropdown-item">Keyboard shortcuts</button>
                    <button className="dropdown-item">Integrations</button>
                    <button className="dropdown-item">Download data</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="dropdown-item dropdown-item--danger">
              <LogOut className="size-4" /> Log out
            </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

export const profileDropdownHtml = `<div class="dropdown">
  <button class="dropdown-trigger" id="trigger">
    Account
    <svg id="chevron" class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
  </button>

  <div class="dropdown-panel" id="panel" hidden>
    <div class="dropdown-list">
      <button class="dropdown-item" data-hover>Profile</button>
      <button class="dropdown-item" data-hover>Billing</button>

      <div class="dropdown-item dropdown-item--row" data-hover>
        <span>Dark mode</span>
        <button class="switch" id="theme-switch" role="switch" aria-checked="true">
          <span class="switch-knob"></span>
        </button>
      </div>

      <button class="dropdown-item dropdown-item--row" id="more-toggle" data-hover>
        <span>More options</span>
        <svg class="chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <div class="dropdown-submenu" id="submenu">
        <button class="dropdown-item" data-hover>Keyboard shortcuts</button>
        <button class="dropdown-item" data-hover>Integrations</button>
        <button class="dropdown-item" data-hover>Download data</button>
      </div>

      <button class="dropdown-item dropdown-item--danger" data-hover>Log out</button>
    </div>
    <!-- Highlight pill that glides under the hovered item -->
    <span class="dropdown-highlight" id="highlight"></span>
  </div>
</div>

<style>
.dropdown { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.dropdown-trigger {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 9999px;
  border: 1px solid #27272a; background: #1a1a1d; color: #fafafa;
}
.chevron { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;
  transition: transform 0.2s ease; }
.dropdown-trigger[aria-expanded="true"] .chevron { transform: rotate(180deg); }

/* Renders in normal flow below the trigger, so the column grows (and stays centered
   in a flex-centered stage) instead of overlaying with absolute positioning */
.dropdown-panel {
  width: 240px;
  background: #1a1a1d; border: 1px solid #27272a; border-radius: 12px; padding: 6px;
  transform-origin: top center;
  transform: scale(0.96) translateY(-8px); opacity: 0;
  transition: transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease;
  pointer-events: none; display: none;
}
.dropdown-panel.open { display: block; transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }
.dropdown-list { position: relative; }

.dropdown-item {
  position: relative; display: flex; width: 100%; align-items: center; justify-content: space-between;
  gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 14px; color: #fafafa; background: none; text-align: left;
}
.dropdown-item--row { display: flex; }
.dropdown-item--danger { color: #f87171; }

/* Sliding highlight, positioned with JS on hover */
.dropdown-highlight {
  position: absolute; left: 6px; right: 6px; height: 0; border-radius: 8px;
  background: #111113; opacity: 0; pointer-events: none;
  transition: top 0.2s cubic-bezier(0.2,0.8,0.2,1), height 0.2s cubic-bezier(0.2,0.8,0.2,1), opacity 0.15s ease;
  z-index: 0;
}
.dropdown-item { z-index: 1; }

.switch { width: 36px; height: 20px; border-radius: 9999px; background: #3f3f46; position: relative; transition: background 0.2s; }
.switch.switch--on { background: #8b5cf6; }
.switch-knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 9999px; background: #fff;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.switch.switch--on .switch-knob { transform: translateX(16px); }

.dropdown-submenu { padding-left: 22px; max-height: 0; overflow: hidden; transition: max-height 0.25s ease; }
.dropdown-submenu.open { max-height: 160px; }
</style>

<script>
const trigger = document.getElementById('trigger');
const panel = document.getElementById('panel');
const highlight = document.getElementById('highlight');
const themeSwitch = document.getElementById('theme-switch');
const moreToggle = document.getElementById('more-toggle');
const submenu = document.getElementById('submenu');

trigger.addEventListener('click', () => {
  const isOpen = panel.classList.toggle('open');
  panel.hidden = false;
  trigger.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('[data-hover]').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    const rect = item.getBoundingClientRect();
    const parentRect = item.closest('.dropdown-list').getBoundingClientRect();
    highlight.style.top = rect.top - parentRect.top + 'px';
    highlight.style.height = rect.height + 'px';
    highlight.style.opacity = '1';
  });
  item.addEventListener('mouseleave', () => {
    highlight.style.opacity = '0';
  });
});

themeSwitch.addEventListener('click', () => {
  const isOn = themeSwitch.classList.toggle('switch--on');
  themeSwitch.setAttribute('aria-checked', String(isOn));
});

moreToggle.addEventListener('click', () => submenu.classList.toggle('open'));

document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
    panel.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    panel.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }
});
</script>`;

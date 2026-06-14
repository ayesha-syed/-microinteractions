export const settingsPopoverTsx = `'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, Save, SlidersHorizontal, Volume2 } from 'lucide-react';

const colors = [
  { id: 'violet', value: '#8b5cf6' },
  { id: 'blue', value: '#3b82f6' },
  { id: 'emerald', value: '#10b981' },
  { id: 'rose', value: '#f43f5e' },
];

export default function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(60);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [color, setColor] = useState('violet');
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  // Convert a pointer position into a 0-100 value along the track
  const updateFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setVolume(Math.round(Math.min(100, Math.max(0, pct))));
  };

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center gap-2"
    >
      <motion.button
        layout="position"
        onClick={() => setOpen((v) => !v)}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="settings-trigger"
      >
        <SlidersHorizontal className="size-4 settings-trigger-icon" />
        <span className="settings-trigger-label">Customize</span>
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
          <div className="settings-panel">
            {/* Draggable slider */}
            <div className="settings-row">
              <span><Volume2 className="size-4" /> Volume</span>
              <span>{volume}%</span>
            </div>
            <div
              ref={trackRef}
              onClick={(e) => updateFromPointer(e.clientX)}
              className="slider-track"
            >
              <div className="slider-fill" style={{ width: \`\${volume}%\` }} />
              <motion.div
                onPan={(_e, info) => updateFromPointer(info.point.x)}
                whileTap={{ scale: 1.25 }}
                className="slider-knob"
                style={{ left: \`\${volume}%\` }}
              />
            </div>

            {/* Toggle switches */}
            <ToggleRow icon={Bell} label="Notifications" checked={notifications} onChange={setNotifications} />
            <ToggleRow icon={Save} label="Auto-save" checked={autoSave} onChange={setAutoSave} />

            {/* Color picker with animated checkmark */}
            <div className="swatch-row">
              {colors.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => setColor(swatch.id)}
                  className="swatch"
                  style={{ backgroundColor: swatch.value }}
                >
                  {color === swatch.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="swatch-check"
                    >
                      <Check className="size-3.5" />
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ToggleRow({ icon: Icon, label, checked, onChange }: any) {
  return (
    <div className="settings-row">
      <span><Icon className="size-4" /> {label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={\`switch \${checked ? 'switch--on' : ''}\`}
      >
        <motion.span layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} className="switch-knob" />
      </button>
    </div>
  );
}`;

export const settingsPopoverHtml = `<div class="settings">
  <button class="settings-trigger" id="trigger">Customize</button>

  <div class="settings-panel" id="panel" hidden>
    <div class="settings-row">
      <span>Volume</span>
      <span id="volume-label">60%</span>
    </div>
    <div class="slider-track" id="track">
      <div class="slider-fill" id="fill" style="width: 60%"></div>
      <div class="slider-knob" id="knob" style="left: 60%"></div>
    </div>

    <div class="settings-row">
      <span>Notifications</span>
      <button class="switch switch--on" id="notif-switch" role="switch" aria-checked="true">
        <span class="switch-knob"></span>
      </button>
    </div>
    <div class="settings-row">
      <span>Auto-save</span>
      <button class="switch" id="autosave-switch" role="switch" aria-checked="false">
        <span class="switch-knob"></span>
      </button>
    </div>

    <p class="settings-label">Accent color</p>
    <div class="swatch-row">
      <button class="swatch swatch--active" data-color style="background:#8b5cf6">
        <span class="swatch-check">&#10003;</span>
      </button>
      <button class="swatch" data-color style="background:#3b82f6">
        <span class="swatch-check">&#10003;</span>
      </button>
      <button class="swatch" data-color style="background:#10b981">
        <span class="swatch-check">&#10003;</span>
      </button>
      <button class="swatch" data-color style="background:#f43f5e">
        <span class="swatch-check">&#10003;</span>
      </button>
    </div>
  </div>
</div>

<style>
.settings { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.settings-trigger {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 9999px;
  border: 1px solid #27272a; background: #1a1a1d; color: #fafafa; font-size: 14px; cursor: pointer;
}
.settings-trigger-icon { color: #fafafa; }
.settings-trigger-label { color: #a1a1aa; transition: color 0.15s ease; }
.settings-trigger:hover .settings-trigger-label { color: #fafafa; }
/* Renders in normal flow below the trigger, so the column grows (and stays centered
   in a flex-centered stage) instead of overlaying with absolute positioning */
.settings-panel {
  width: 280px; padding: 16px;
  background: #1a1a1d; border: 1px solid #27272a; border-radius: 12px;
  transform-origin: top center; transform: scale(0.96) translateY(-8px); opacity: 0;
  transition: transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease; pointer-events: none;
  display: none;
}
.settings-panel.open { display: block; transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }

.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #fafafa; }
.settings-label { font-size: 14px; color: #fafafa; margin: 8px 0; }

.slider-track { position: relative; height: 6px; border-radius: 9999px; background: #3f3f46; cursor: pointer; margin-bottom: 8px; }
.slider-fill { position: absolute; height: 100%; border-radius: 9999px; background: #8b5cf6; }
.slider-knob {
  position: absolute; top: 50%; width: 16px; height: 16px; border-radius: 9999px; background: #fff;
  transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(0,0,0,.4); cursor: grab;
}
.slider-knob:active { cursor: grabbing; transform: translate(-50%, -50%) scale(1.25); }

.switch { width: 36px; height: 20px; border-radius: 9999px; background: #3f3f46; position: relative; transition: background 0.2s; }
.switch.switch--on { background: #8b5cf6; }
.switch-knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 9999px; background: #fff;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.switch.switch--on .switch-knob { transform: translateX(16px); }

.swatch-row { display: flex; gap: 8px; }
.swatch { width: 28px; height: 28px; border-radius: 9999px; position: relative; display: flex; align-items: center; justify-content: center; }
.swatch-check {
  color: #fff; opacity: 0; transform: scale(0); transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.8);
  width: 100%; height: 100%; border-radius: 9999px; align-items: center; justify-content: center; display: flex;
}
.swatch--active .swatch-check { opacity: 1; transform: scale(1); }
</style>

<script>
const trigger = document.getElementById('trigger');
const panel = document.getElementById('panel');
const track = document.getElementById('track');
const fill = document.getElementById('fill');
const knob = document.getElementById('knob');
const volumeLabel = document.getElementById('volume-label');

trigger.addEventListener('click', () => {
  const isOpen = panel.classList.toggle('open');
  panel.hidden = false;
  trigger.setAttribute('aria-expanded', String(isOpen));
});
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !trigger.contains(e.target)) panel.classList.remove('open');
});

function setVolume(clientX) {
  const rect = track.getBoundingClientRect();
  const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  fill.style.width = pct + '%';
  knob.style.left = pct + '%';
  volumeLabel.textContent = Math.round(pct) + '%';
}
track.addEventListener('click', (e) => setVolume(e.clientX));
knob.addEventListener('pointerdown', (e) => {
  knob.setPointerCapture(e.pointerId);
  const onMove = (ev) => setVolume(ev.clientX);
  const onUp = () => {
    knob.removeEventListener('pointermove', onMove);
    knob.removeEventListener('pointerup', onUp);
  };
  knob.addEventListener('pointermove', onMove);
  knob.addEventListener('pointerup', onUp);
});

document.querySelectorAll('.switch').forEach((el) => {
  el.addEventListener('click', () => {
    const isOn = el.classList.toggle('switch--on');
    el.setAttribute('aria-checked', String(isOn));
  });
});

document.querySelectorAll('[data-color]').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('[data-color]').forEach((s) => s.classList.remove('swatch--active'));
    swatch.classList.add('swatch--active');
  });
});
</script>`;

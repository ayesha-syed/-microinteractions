export const feedbackPopoverTsx = `'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';

const moods = [
  { id: 'bad', emoji: '😞', label: 'Bad' },
  { id: 'meh', emoji: '😐', label: 'Meh' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'great', emoji: '🤩', label: 'Great' },
];

export default function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const ref = useRef<HTMLDivElement>(null);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) return;
    setSubmitted(true);
    // Auto-close after the success state has been shown for a moment
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setMood(null);
        setMessage('');
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
        onClick={() => setOpen((v) => !v)}
        transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
        className="feedback-trigger"
      >
        <MessageSquarePlus className="size-4 feedback-trigger-icon" />
        <span className="feedback-trigger-label">Feedback</span>
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
          <div className="feedback-panel">
            {/* AnimatePresence cross-fades between the form and the success state */}
            <AnimatePresence mode="popLayout" initial={false}>
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="feedback-form"
                >
                  <p className="feedback-title">How's your experience?</p>
                  <div className="mood-row">
                    {moods.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={mood === option.id}
                        onClick={() => setMood(option.id)}
                        className="mood-btn"
                      >
                        {mood === option.id && (
                          <motion.span
                            layoutId="mood-highlight"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="mood-highlight"
                          />
                        )}
                        <motion.span
                          animate={{ scale: mood === option.id ? 1.2 : 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          className="mood-emoji"
                        >
                          {option.emoji}
                        </motion.span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more (optional)"
                    rows={2}
                    className="feedback-textarea"
                  />
                  <button type="submit" disabled={!mood} className="feedback-submit">
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
                  className="feedback-success"
                >
                  <div className="feedback-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* pathLength animates from 0 to 1, drawing the checkmark stroke */}
                      <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="feedback-title">Thanks for your feedback!</p>
                    <p className="feedback-subtitle">We'll use this to improve.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

export const feedbackPopoverHtml = `<div class="feedback" id="feedback">
  <button class="feedback-trigger" id="trigger">
    <svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M12 8v4M12 16h.01"/></svg>
    Feedback
  </button>

  <div class="feedback-panel" id="panel" hidden>
    <form class="feedback-form" id="form">
      <p class="feedback-title">How's your experience?</p>
      <div class="mood-row" id="mood-row">
        <button type="button" class="mood-btn" data-mood="bad">😞</button>
        <button type="button" class="mood-btn" data-mood="meh">😐</button>
        <button type="button" class="mood-btn" data-mood="good">🙂</button>
        <button type="button" class="mood-btn" data-mood="great">🤩</button>
      </div>
      <textarea class="feedback-textarea" placeholder="Tell us more (optional)" rows="2"></textarea>
      <button type="submit" class="feedback-submit" id="submit" disabled>Send feedback</button>
    </form>

    <div class="feedback-success" id="success" hidden>
      <div class="feedback-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path class="check-path" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <p class="feedback-title">Thanks for your feedback!</p>
        <p class="feedback-subtitle">We'll use this to improve.</p>
      </div>
    </div>
  </div>
</div>

<style>
.feedback { position: relative; display: flex; flex-direction: column-reverse; align-items: center; gap: 8px; }
.feedback-trigger {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 9999px;
  border: 1px solid #27272a; background: #1a1a1d; color: #fafafa; font-size: 14px; cursor: pointer;
}
.feedback-trigger .icon { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; }
.feedback-trigger-icon { color: #fafafa; }
.feedback-trigger-label { color: #a1a1aa; transition: color 0.15s ease; }
.feedback-trigger:hover .feedback-trigger-label { color: #fafafa; }

/* Renders in normal flow above the trigger (column-reverse), so the column grows (and stays
   centered in a flex-centered stage) instead of overlaying with absolute positioning */
.feedback-panel {
  width: 288px; padding: 16px;
  background: #1a1a1d; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;
  transform-origin: bottom center; transform: scale(0.96) translateY(8px); opacity: 0;
  transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), opacity 0.18s ease; pointer-events: none;
  display: none;
}
.feedback-panel.open { display: block; transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }

.feedback-form, .feedback-success { display: flex; flex-direction: column; gap: 12px; }
.feedback-title { font-size: 14px; font-weight: 500; color: #fafafa; margin: 0; }
.feedback-subtitle { font-size: 12px; color: #a1a1aa; margin: 2px 0 0; }

.mood-row { display: flex; align-items: center; justify-content: space-between; }
.mood-btn {
  position: relative; display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 9999px; font-size: 20px; background: none; border: none;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.mood-btn.active { transform: scale(1.2); }
.mood-btn.active::before {
  content: ''; position: absolute; inset: 0; border-radius: 9999px;
  background: rgba(139,92,246,0.2); border: 2px solid #8b5cf6;
}
.mood-btn span { position: relative; }

.feedback-textarea {
  width: 100%; resize: none; border-radius: 8px; border: 1px solid #27272a; background: #0a0a0b;
  color: #fafafa; font-size: 14px; padding: 8px 12px; font-family: inherit;
}
.feedback-textarea:focus { border: none; outline-offset: 0; }
.feedback-textarea::placeholder { color: #52525b; }

.feedback-submit {
  border-radius: 8px; background: #8b5cf6; color: #fff; font-size: 14px; font-weight: 500; padding: 8px 12px; border: none;
  transition: opacity 0.15s;
}
.feedback-submit:disabled { opacity: 0.4; cursor: not-allowed; }

.feedback-success { align-items: center; text-align: center; padding: 16px 0; }
.feedback-check {
  display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;
  border-radius: 9999px; background: rgba(139,92,246,0.15); color: #8b5cf6;
}
.feedback-check svg { width: 24px; height: 24px; }
.check-path { stroke-dasharray: 16; stroke-dashoffset: 16; }
.check-path.draw { animation: check-draw 0.4s ease-out forwards; }
@keyframes check-draw { to { stroke-dashoffset: 0; } }
</style>

<script>
const trigger = document.getElementById('trigger');
const feedback = document.getElementById('feedback');
const panel = document.getElementById('panel');
const form = document.getElementById('form');
const success = document.getElementById('success');
const moodRow = document.getElementById('mood-row');
const submitBtn = document.getElementById('submit');
let selectedMood = null;

function openPanel() {
  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add('open'));
}
function closePanel() {
  panel.classList.remove('open');
  setTimeout(() => {
    panel.hidden = true;
    form.hidden = false;
    success.hidden = true;
    moodRow.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));
    selectedMood = null;
    submitBtn.disabled = true;
    form.querySelector('textarea').value = '';
    panel.querySelector('.check-path').classList.remove('draw');
  }, 180);
}

trigger.addEventListener('click', () => {
  panel.hidden ? openPanel() : closePanel();
});
document.addEventListener('mousedown', (e) => {
  if (!feedback.contains(e.target) && !panel.hidden) closePanel();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) closePanel();
});

moodRow.querySelectorAll('.mood-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    moodRow.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedMood = btn.dataset.mood;
    submitBtn.disabled = false;
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!selectedMood) return;
  form.hidden = true;
  success.hidden = false;
  // Trigger the stroke-dashoffset checkmark draw animation
  requestAnimationFrame(() => panel.querySelector('.check-path').classList.add('draw'));
  setTimeout(closePanel, 1600);
});
</script>`;

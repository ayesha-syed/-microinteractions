export const expandableActionCardTsx = `'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, ChevronDown, Heart, MessageCircle, Share2 } from 'lucide-react';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function ExpandableActionCard() {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const toggleLike = () => {
    setLiked((v) => {
      if (!v) setBurstKey((k) => k + 1);
      return !v;
    });
  };

  return (
    // "layout" animates the card's height smoothly as content is added/removed
    <motion.div
      layout
      onClick={() => setExpanded((v) => !v)}
      className="card"
      transition={{ layout: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
    >
      <motion.div layout="position" className="card-header">
        <div className="card-thumb" />
        <div>
          <h3>Designing with motion</h3>
          <p>Notes on building interfaces that feel alive.</p>
        </div>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>

      <AnimatePresence initial={false}>
        {expanded && (
          // staggerChildren makes each action button pop in one after another
          <motion.div variants={listVariants} initial="hidden" animate="visible" exit="hidden" className="card-actions">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); toggleLike(); }}
              className={\`action \${liked ? 'action--liked' : ''}\`}
            >
              <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
              Like
              {/* Particle burst radiating outward on like */}
              <AnimatePresence>
                {liked && Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  return (
                    <motion.span
                      key={\`\${burstKey}-\${i}\`}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: 0, scale: 1, x: Math.cos(angle) * 28, y: Math.sin(angle) * 28 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="particle"
                    />
                  );
                })}
              </AnimatePresence>
            </motion.button>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setSaved((v) => !v); }}
              className={\`action \${saved ? 'action--saved' : ''}\`}
            >
              <motion.span animate={saved ? { rotate: [0, -15, 15, 0] } : {}} transition={{ duration: 0.35 }}>
                <Bookmark className="size-4" fill={saved ? 'currentColor' : 'none'} />
              </motion.span>
              Save
            </motion.button>

            <motion.button variants={itemVariants} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} className="action">
              <Share2 className="size-4" /> Share
            </motion.button>

            <motion.span variants={itemVariants} className="card-meta">
              <MessageCircle className="size-4" /> 12
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

export const expandableActionCardHtml = `<div class="card" id="card">
  <div class="card-header">
    <div class="card-thumb"></div>
    <div>
      <h3>Designing with motion</h3>
      <p>Notes on building interfaces that feel alive.</p>
    </div>
    <svg id="chevron" class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
  </div>

  <div class="card-actions" id="actions">
    <button class="action" id="like-btn">
      <svg class="icon" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"/></svg>
      Like
      <span class="particles" id="particles"></span>
    </button>
    <button class="action" id="save-btn">
      <svg class="icon" viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      Save
    </button>
    <button class="action">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51 15.42 17.5M15.41 6.51 8.59 10.5"/></svg>
      Share
    </button>
    <span class="card-meta">12 comments</span>
  </div>
</div>

<style>
.card { width: 100%; max-width: 380px; cursor: pointer; border-radius: 16px; border: 1px solid #27272a; background: #1a1a1d; padding: 20px; }
.card-header { display: flex; align-items: flex-start; gap: 16px; }
.card-thumb { flex-shrink: 0; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.card-header h3 { font-size: 14px; font-weight: 600; color: #fafafa; margin: 0; }
.card-header p { font-size: 14px; color: #a1a1aa; margin: 4px 0 0; }
.chevron { width: 16px; height: 16px; fill: none; stroke: #71717a; stroke-width: 2; margin-top: 4px;
  transition: transform 0.2s ease; flex-shrink: 0; }
.card.open .chevron { transform: rotate(180deg); }

.card-actions {
  display: flex; align-items: center; gap: 8px; margin-top: 0; padding-top: 0;
  border-top: 1px solid transparent; overflow: hidden;
  max-height: 0; opacity: 0;
  transition: max-height 0.35s cubic-bezier(0.04,0.62,0.23,0.98), opacity 0.25s ease, margin-top 0.35s, padding-top 0.35s, border-color 0.35s;
}
.card.open .card-actions { max-height: 60px; opacity: 1; margin-top: 16px; padding-top: 16px; border-color: #27272a; }

.action {
  position: relative; display: flex; align-items: center; gap: 6px; padding: 6px 12px;
  border-radius: 9999px; border: 1px solid #27272a; background: none; color: #a1a1aa; font-size: 14px;
  transition: transform 0.15s ease, color 0.15s ease;
}
.action:hover { transform: scale(1.08); color: #fafafa; }
.action:active { transform: scale(0.9); }
.icon { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; }
.action.liked { color: #fb7185; }
.action.liked .icon { fill: currentColor; }
.action.saved { color: #8b5cf6; }
.action.saved .icon { fill: currentColor; }

.card-meta { margin-left: auto; font-size: 14px; color: #71717a; }

.particle {
  position: absolute; left: 16px; top: 50%; width: 6px; height: 6px; border-radius: 9999px; background: #fb7185;
  opacity: 0; pointer-events: none;
}
@keyframes particle-burst {
  from { opacity: 1; transform: translate(0, -50%) scale(0); }
  to { opacity: 0; transform: translate(var(--dx), calc(-50% + var(--dy))) scale(1); }
}
.particle.burst { animation: particle-burst 0.5s ease-out forwards; }
</style>

<script>
const card = document.getElementById('card');
const likeBtn = document.getElementById('like-btn');
const saveBtn = document.getElementById('save-btn');
const particles = document.getElementById('particles');

card.addEventListener('click', () => card.classList.toggle('open'));

likeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const liking = likeBtn.classList.toggle('liked');
  if (liking) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const span = document.createElement('span');
      span.className = 'particle burst';
      span.style.setProperty('--dx', Math.cos(angle) * 28 + 'px');
      span.style.setProperty('--dy', Math.sin(angle) * 28 + 'px');
      particles.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    }
  }
});

saveBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  saveBtn.classList.toggle('saved');
});
</script>`;

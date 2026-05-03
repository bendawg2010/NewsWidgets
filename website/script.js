/* News Widgets — landing page interactivity
 * Vanilla JS, no dependencies. Two jobs:
 *   1. Reveal-on-scroll for elements marked with .reveal
 *   2. Copy-to-clipboard buttons inside .code-block
 */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------- 1. Reveal on scroll --------------
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Schedule via rAF so we don't fight the browser's paint
          window.requestAnimationFrame(() => el.classList.add('in'));
          io.unobserve(el);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );
    reveals.forEach((el) => io.observe(el));
  }

  // -------------- 2. Copy buttons --------------
  document.querySelectorAll('.code-block .copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      if (!text) return;

      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          // Legacy fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand('copy');
          document.body.removeChild(ta);
        }
      } catch (e) {
        ok = false;
      }

      const original = btn.textContent;
      btn.textContent = ok ? 'Copied' : 'Press Cmd+C';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1600);
    });
  });

  // -------------- 3. Pause hero video when offscreen (battery friendly) --------------
  const heroVideo = document.querySelector('.video-frame video');
  if (heroVideo && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = heroVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {/* autoplay blocked, ignore */});
            }
          } else {
            heroVideo.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    vio.observe(heroVideo);
  }
})();

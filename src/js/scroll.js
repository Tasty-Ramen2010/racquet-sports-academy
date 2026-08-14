// Home scroll orchestration: flip the ASCII trail + nav glass at the
// hero→site boundary (black stage → white site), reveal-on-scroll, counters.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScroll({ trail, island } = {}) {
  const site = document.querySelector('.site');

  // ---- Trail + nav theme flip when the white site comes into view ----
  if (site) {
    ScrollTrigger.create({
      trigger: site,
      start: 'top 60%',
      onEnter: () => {
        trail?.setDark(true);
        island?.setLight(true);
      },
      onLeaveBack: () => {
        trail?.setDark(false);
        island?.setLight(false);
      },
    });
  }

  // ---- Reveal on scroll ----
  const revealSel = [
    '.section__head',
    '.split',
    '.stats__grid',
    '.band__inner',
    '.rows li',
    '.contact__block',
    '.tile',
  ];
  document.querySelectorAll(revealSel.join(',')).forEach((el) => {
    el.classList.add('reveal');
    ScrollTrigger.create({ trigger: el, start: 'top 88%', onEnter: () => el.classList.add('is-in') });
  });

  // ---- Animated counters ----
  document.querySelectorAll('.stats__n[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => (el.firstChild.textContent = Math.round(obj.v) + suffix),
        }),
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// Sub-page entry: shared chrome, ASCII trail (dark glyphs on the light page),
// parallax hero, reveals. No loader, no black→white flip.
import './styles/main.css';
import { initChrome } from './js/chrome.js';
import { initAsciiTrail } from './js/asciiTrail.js';
import { cutoutAll } from './js/cutout.js';
import { initParallax } from './js/parallax.js';
import { initAccordion } from './js/accordion.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.body.classList.add('is-page');

const page = document.body.dataset.page || 'home';
const trail = initAsciiTrail();
trail.setDark(true); // dark glyphs over the light page

initChrome({ page });
cutoutAll('.js-cutout');
initParallax();
initAccordion('.acc');

// reveal-on-scroll + counters (shared with home, scoped here)
document
  .querySelectorAll('.section__head, .split, .stats__grid, .band__inner, .rows li, .contact__block, .tile')
  .forEach((el) => {
    el.classList.add('reveal');
    ScrollTrigger.create({ trigger: el, start: 'top 88%', onEnter: () => el.classList.add('is-in') });
  });

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

// Booking form: confirm in place (no backend wired yet)
const form = document.querySelector('.bookform');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = form.querySelector('[data-note]');
    if (!form.reportValidity()) return;
    if (note) {
      note.textContent = '// Thanks — request received. We\'ll be in touch shortly.';
      note.classList.add('is-sent');
    }
    form.querySelector('button[type="submit"]').textContent = 'Sent ✓';
  });
}

window.addEventListener('load', () => {
  document.querySelectorAll('.player, .phero__player').forEach((p, i) => {
    setTimeout(() => p.classList.add('is-in'), 150 + i * 120);
  });
  ScrollTrigger.refresh();
});

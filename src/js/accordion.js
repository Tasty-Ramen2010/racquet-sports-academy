// Signature element: a pinned, diagonal scroll-accordion.
// The section pins; scroll progress maps to an active panel (discrete, no snap
// — snapping was the source of the jank), which expands to reveal its image +
// copy while the others collapse to angled slivers. Click a sliver to jump.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initAccordion(selector = '.acc') {
  document.querySelectorAll(selector).forEach(setup);
}

function setup(section) {
  const panels = [...section.querySelectorAll('.panel')];
  const dots = [...section.querySelectorAll('.acc__progress span')];
  const n = panels.length;
  if (!n) return;

  let active = -1;
  function setActive(i) {
    i = Math.max(0, Math.min(n - 1, i));
    if (i === active) return;
    active = i;
    panels.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('is-on', idx === i));
  }
  setActive(0);

  const mm = gsap.matchMedia();

  // Desktop / tablet: pin and drive the active panel from scroll progress.
  mm.add('(min-width: 721px)', () => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => '+=' + window.innerHeight * n,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
      onRefresh: (self) => setActive(Math.round(self.progress * (n - 1))),
    });

    const handlers = panels.map((p, idx) => {
      const h = () => {
        if (p.classList.contains('is-active')) return;
        const y = st.start + (st.end - st.start) * (idx / (n - 1)) + 2;
        gsap.to(window, { scrollTo: y, duration: 0.6, ease: 'power2.inOut' });
      };
      p.addEventListener('click', h);
      return [p, h];
    });

    return () => {
      st.kill();
      handlers.forEach(([p, h]) => p.removeEventListener('click', h));
    };
  });

  // Mobile: no pin — panels are shown stacked (CSS handles layout).
  mm.add('(max-width: 720px)', () => {
    panels.forEach((p) => p.classList.add('is-active'));
    return () => panels.forEach((p) => p.classList.remove('is-active'));
  });
}

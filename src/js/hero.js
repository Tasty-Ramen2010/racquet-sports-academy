// Pinned parallax hero (hyperframer-style): the stage is sticky, and a single
// scrubbed timeline drives the whole reveal — the green court rises in behind,
// six big player cutouts rise from the bottom and overlap, and FORTIUS resolves
// in the centre. First frame is just black + an ASCII scroll arrow.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const court = hero.querySelector('.hero__court');
  const title = hero.querySelector('.hero__title');
  const arrow = hero.querySelector('.hero__arrow');
  // back-to-front: small/high players first, big foreground last
  const rises = gsap.utils.toArray('.rise', hero);

  // starting state — everything below / hidden, only the arrow shows
  gsap.set(rises, { yPercent: 132, autoAlpha: 0 });
  gsap.set(court, { autoAlpha: 0, yPercent: 24, scale: 0.9, transformOrigin: '50% 100%' });
  gsap.set(title, { autoAlpha: 0, yPercent: 26 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // arrow fades almost immediately
  tl.to(arrow, { autoAlpha: 0, y: 16, duration: 0.06, ease: 'none' }, 0);
  // court rises in behind
  tl.to(court, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.42, ease: 'power2.out' }, 0.03);
  // players rise, staggered for depth (front ones land later, over the others)
  rises.forEach((el, i) => {
    tl.to(el, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out' }, 0.08 + i * 0.045);
  });
  // FORTIUS resolves — composition complete by ~70%, then holds before release
  tl.to(title, { autoAlpha: 1, yPercent: 0, duration: 0.34, ease: 'power2.out' }, 0.36);
}

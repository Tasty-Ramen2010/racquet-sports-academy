// Home entry: pinned parallax hero (court + rising players + FORTIUS)
// → diagonal accordion → white site.
import './styles/main.css';
import { initChrome } from './js/chrome.js';
import { initAsciiTrail } from './js/asciiTrail.js';
import { cutoutAll } from './js/cutout.js';
import { initHero } from './js/hero.js';
import { initParallax } from './js/parallax.js';
import { initAccordion } from './js/accordion.js';
import { initScroll } from './js/scroll.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const trail = initAsciiTrail();
const island = initChrome({ page: 'home' });

cutoutAll('.js-cutout');     // knock white out of the player photos
initHero();                  // pinned rise sequence
initParallax();              // depth on content media
initAccordion('.acc');       // the signature membership accordion
initScroll({ trail, island }); // theme flip, reveals, counters

// the cutouts replace their own src after processing — refresh triggers once
// the heaviest images are in so pin/positions are measured correctly
window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 400));

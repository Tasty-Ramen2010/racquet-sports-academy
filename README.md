# Racquet Sports Academy

A modern, responsive website for a premier badminton, pickleball, and table tennis facility in Alpharetta, GA.

## Features

- **Mountain Range Hero** — Dynamically rising player silhouettes form two mountain ranges with faces as peaks
- **Scroll-Driven Animations** — GSAP timeline orchestrated by scroll position
- **Diagonal Accordion** — Interactive side-scrolling sports selector with skewed panels
- **Liquid Glass Navigation** — Dynamic island nav with backdrop blur effects
- **ASCII Trail** — Mouse-following ASCII art particle system
- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Multi-page Site** — Home, membership, coaching, events, about, and contact pages

## Tech Stack

- **Vite** — Fast build tool and dev server
- **GSAP** — Timeline animation library
- **Three.js** — 3D graphics (prepared for future enhancements)
- **Vanilla JS** — No framework dependencies
- **CSS Grid/Flexbox** — Modern layout system

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions workflow on push to `master` branch.

- **Repository**: https://github.com/Tasty-Ramen2010/racquet-sports-academy
- **Live Site**: https://tasty-ramen2010.github.io/racquet-sports-academy/

## Project Structure

```
├── index.html              # Main homepage
├── src/
│   ├── main.js            # Entry point
│   ├── page.js            # Sub-page loader
│   ├── js/
│   │   ├── hero.js        # Hero section scroll animation
│   │   ├── scroll.js      # Global scroll orchestration
│   │   ├── accordion.js   # Side-scroll accordion panels
│   │   ├── chrome.js      # Navigation and UI chrome
│   │   ├── parallax.js    # Parallax scroll effects
│   │   ├── cutout.js      # Image loading utilities
│   │   └── asciiTrail.js  # ASCII particle system
│   └── styles/
│       └── main.css       # Global styles + design system
├── public/
│   └── img/               # Images and assets
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
└── vite.config.js         # Vite build configuration
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

© 2025 Racquet Sports Academy

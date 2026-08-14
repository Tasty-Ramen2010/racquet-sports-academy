// Shared scroll cell + postprocessing handles (updated each frame by the scene).
export const progress = { v: 0, vel: 0 }
export const fx = { pixel: null, ca: null }

// Timeline (scroll offset 0 -> 1): side-to-side through 3 sports, then all-together,
// then the Fortius diagonal accordion.
export const T = {
  ttDwell: 0.10,    // table tennis centered
  badDwell: 0.30,   // badminton centered
  pickDwell: 0.50,  // pickleball centered
  pullback: 0.64,   // all three tools together
  accordion: 0.72,  // Fortius info accordion begins
}

// station x-positions in world space
export const SX = { tt: -9, bad: 0, pick: 9 }

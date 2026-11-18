// Per-game settings: the only file (besides levels and puzzles) that changes between games.
window.GameMeta = {
  key: 'driftSignal.v1',
  title: 'Drift Signal',
  image: 'assets/title.webp',
  imageAlt: 'Illustration: a small worn survey ship drifting beside a huge dying red star.',
  tagline: 'You wake alone on a drifting ship near a dying star. Nothing here can be fought. Everything can be solved.',
  // First matching flag wins; the last entry is the fallback.
  endings: [
    { flag: 'ending_peace', text: 'You answered the signal as a friend. Two lonely ships found each other, and nobody had to fight.' },
    { flag: 'ending_study', text: 'You mapped the signal and carried its secrets home. Knowledge was the cargo that mattered.' },
    { flag: null, text: 'You fixed the ship and drifted on. The signal still plays, waiting for the next listener.' } ]
};

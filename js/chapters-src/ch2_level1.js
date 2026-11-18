// Level 1: Docking Ring. Pattern-memory puzzle + a frightened pilot on the radio.
window.Levels = window.Levels || [];
(function () {
  var tamsin = { start: 'a', nodes: {
    a: { speaker: 'Pilot Tamsin (radio)', text: 'Harbor Nine, Harbor Nine, this is the Reed. Hull intact, fuel low, static everywhere. I cannot see your docking lights. Is anyone there?',
      choices: [
        { text: '"I am here, Tamsin. We will do this one step at a time."', req: { stat: 'emp', min: 4 }, next: 'calm', setFlag: 'tamsin_calm', xp: 15, id: 'tamsin_calm' },
        { text: '"Hold position. What is your fuel?"', next: 'fuel' },
        { text: '"The lights are out. Give me a minute."', next: 'fuel' } ] },
    calm: { speaker: 'Pilot Tamsin (radio)', text: 'Thank you. That is the steadiest voice I have heard all day. My computer will only recognise the ring if its pads light in the right order. Watch the pattern, then repeat it on the pads.',
      choices: [ { text: '"Watching now."', next: 'end' } ] },
    fuel: { speaker: 'Pilot Tamsin (radio)', text: 'Ten percent, maybe less. My computer will only recognise the ring if its pads light in the right order. Watch the pattern, then repeat it on the pads. Please hurry.',
      choices: [ { text: '"On it."', next: 'end' } ] },
    end: { speaker: 'Pilot Tamsin (radio)', text: 'Holding position. Holding... holding.' } } };

  window.Levels[0] = { id: 1, title: 'Docking Ring',
    image: 'assets/level1.webp', imageAlt: 'Illustration: four glowing round pads, a triangle, a square, a diamond and a star, on a control desk before a nebula window.',
    intro: 'Static hisses on every channel. The docking ring around Harbor Nine is dark, and four coloured pads on the control desk wait for a pattern. Outside the window, a small ship turns slowly in the nebula light.',
    hotspots: [
      { id: 'look1', label: 'Look out the window', text: 'Three ships hover at the edge of the nebula, each a faint dot of running lights. Nobody is armed. Everybody is tired.', xp: 5 },
      { id: 'radio1', label: 'Answer the radio', dialogue: tamsin },
      { id: 'p_memory', label: 'Light the docking ring', puzzle: 'memory', setFlag: 'ring_lit', xp: 30,
        text: 'The ring wakes up in a slow circle of light. Out in the dark, a small ship answers with one blink.' },
      { id: 'door1', label: 'Head down to the cargo bay', needFlag: 'ring_lit', exit: true } ] };
})();

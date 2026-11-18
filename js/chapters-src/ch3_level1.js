// Level 1: Seed Vault. Lights-out puzzle + the worn-out gardener AI.
window.Levels = window.Levels || [];
(function () {
  var fern = { start: 'a', nodes: {
    a: { speaker: 'Fern (garden AI)', text: 'Gardener? The vault doors are frozen. The seeds are fine, I think. I count them every night and the count keeps changing. I may be ill.',
      choices: [
        { text: '"You are not ill, Fern. You are tired. So am I."', req: { stat: 'emp', min: 4 }, next: 'calm', setFlag: 'fern_calm', xp: 15, id: 'fern_calm' },
        { text: '"What exactly is frozen?"', next: 'what' },
        { text: '"Show me the doors."', next: 'what' } ] },
    calm: { speaker: 'Fern (garden AI)', text: 'Tired. Yes, tired. I can work with tired. There are sixteen locks in a grid. Each switch flips itself and its neighbours. They must all be dark to open the vault.',
      choices: [ { text: '"I can do fiddly."', next: 'end' } ] },
    what: { speaker: 'Fern (garden AI)', text: 'Sixteen locks in a grid. Each switch flips itself and the ones next to it, above, below, left and right. They must all be dark to open the vault. It is dreadfully fiddly. I am sorry.',
      choices: [ { text: '"I can do fiddly."', next: 'end' } ] },
    end: { speaker: 'Fern (garden AI)', text: 'I will be here, watering things that do not need water.' } } };

  window.Levels[0] = { id: 1, title: 'Seed Vault',
    image: 'assets/level1.webp', imageAlt: 'Illustration: a seed vault with glass drawers of seeds and a round vault door with a four by four grid of lock-lights.',
    intro: 'Rows of frosted glass drawers, each holding a thousand seeds from a world that no longer exists. A grid of sixteen lock-lights glows on the vault door, mostly lit. The whole room smells of cold soil.',
    hotspots: [
      { id: 'look1', label: 'Look at the seed drawers', text: 'Labels in a dead language. Tomato. Rice. A flower you do not know the name of. Each drawer hums softly.', xp: 5 },
      { id: 'fern1', label: 'Answer Fern', dialogue: fern },
      { id: 'p_lights', label: 'Work the vault locks', puzzle: 'lights', setFlag: 'vault_open', xp: 30,
        text: 'Every light goes dark, then the vault door slides open with a soft puff of cold air.' },
      { id: 'door1', label: 'Walk to the dome', needFlag: 'vault_open', exit: true } ] };
})();

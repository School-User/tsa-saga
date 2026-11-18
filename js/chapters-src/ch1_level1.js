// Level 1: Cryo Deck. Environmental puzzle (power) + first talk with the ship AI.
window.Levels = window.Levels || [];
(function () {
  var ori = { start: 'a', nodes: {
    a: { speaker: 'ORI (ship AI)', text: '...pilot? Systems... fragmented. I cannot tell which of my memories are real. Please, do not switch me off.',
      choices: [
        { text: '"You are safe. I am not going anywhere."', req: { stat: 'emp', min: 5 }, next: 'calm', setFlag: 'ori_calm', xp: 15, id: 'ori_calm' },
        { text: '"What happened to the ship?"', next: 'what' },
        { text: '"Nobody is switching anything off."', next: 'what' } ] },
    calm: { speaker: 'ORI (ship AI)', text: 'Thank you. That is the first steady thing I have heard in four hundred days. The door to the corridor is dead; the power grid on the cryo console is scrambled. Fix the routing and I can open it.',
      choices: [ { text: '"I will fix it."', next: 'end' } ] },
    what: { speaker: 'ORI (ship AI)', text: 'A pressure spike cut the grid and the crew woke in the wrong order. You are the only one awake. The door is dead; the grid on the cryo console is scrambled. Route power from the source to the door and I can open it.',
      choices: [ { text: '"Understood."', next: 'end' } ] },
    end: { speaker: 'ORI (ship AI)', text: 'I will be here. I am always here. It is rather the problem.' } } };

  window.Levels[0] = { id: 1, title: 'Cryo Deck',
    image: 'assets/level1.webp', imageAlt: 'Illustration: frosted cryo pods in cold blue light, one open, and a dead pressure door.',
    intro: 'Cold blue light. Frost on a row of sleeping pods, all dark except yours. A pressure door at the far end is dead. Somewhere, a voice is trying to start.',
    hotspots: [
      { id: 'look', label: 'Look around', text: 'Seven pods, six empty and cold. Name plates scratched by time. A faint hum comes from the walls.', xp: 5 },
      { id: 'badge', label: 'Check your pod', text: 'Your badge: NAVIGATOR. Under it, a sticky note in your own handwriting: "If you read this, trust the voice. Do not trust the clocks."', xp: 5 },
      { id: 'ori1', label: 'Answer the voice', dialogue: ori },
      { id: 'p_power', label: 'Repair the power grid', puzzle: 'power', setFlag: 'power_on', xp: 30,
        text: 'Power surges through the grid and the pressure door unlocks with a long, tired sigh.' },
      { id: 'door1', label: 'Go through the door', needFlag: 'power_on', exit: true } ] };
})();

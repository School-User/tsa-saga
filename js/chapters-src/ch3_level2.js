// Level 2: The Dome. Logic assignment puzzle + two botanists in an argument.
window.Levels = window.Levels || [];
(function () {
  var quarrel = { start: 'a', nodes: {
    a: { speaker: 'Dr. Ana and Cy', text: 'Ana: Cy keeps watering the Vine house on my day! Cy: It is MY day, you never read the rota. [They both look at you.]',
      choices: [
        { text: '"You both love these plants. That is why this hurts."', req: { stat: 'emp', min: 4 }, next: 'win', setFlag: 'crew_calm', xp: 20, id: 'quarrel_emp' },
        { text: '"The rota assigns houses, not days. Let me read it out."', req: { stat: 'sci', min: 4 }, next: 'win', setFlag: 'crew_calm', xp: 20, id: 'quarrel_sci' },
        { text: '"Fine. Show me the rota and we will sort it."', next: 'rota' } ] },
    rota: { speaker: 'Dr. Ana and Cy', text: 'Ana: Fine. But Bo is on it too and Bo is hiding in the compost room. Cy: We just need to know who tends which house.',
      choices: [ { text: '"I will fix the rota."', next: 'end', setFlag: 'crew_calm', xp: 10, id: 'quarrel_rota' } ] },
    win: { speaker: 'Dr. Ana and Cy', text: 'Ana: ...you are right. Sorry, Cy. Cy: Me too. Just tell us who tends which house.',
      choices: [ { text: '"I will."', next: 'end' } ] },
    end: { speaker: 'Dr. Ana and Cy', text: 'Ana: Good. Please tell us the answer when you have it.' } } };

  window.Levels[1] = { id: 2, title: 'The Dome',
    image: 'assets/level2.webp', imageAlt: 'Illustration: the inside of a great glass dome with three greenhouses side by side and a notice board.',
    intro: 'A great glass dome, three greenhouses growing side by side: Dome, Vine and Moss. A notice board lists three botanists, Ana, Bo and Cy, and a rota that nobody can agree on.',
    hotspots: [
      { id: 'look2', label: 'Read the notice board', text: 'Handwritten notes: "Cy does not tend Vine." "Not my house." "Bo, where are you?" The Moss house is wilting.', xp: 5 },
      { id: 'quarrel', label: 'Calm the argument', dialogue: quarrel },
      { id: 'p_assign', label: 'Fix the rota', puzzle: 'assign', setFlag: 'crew_set', xp: 30,
        text: 'The rota clicks into place. Three botanists, three greenhouses, no more quarrels.' },
      { id: 'door2', label: 'Go to the water room', needAll: ['crew_set', 'crew_calm'], exit: true } ] };
})();

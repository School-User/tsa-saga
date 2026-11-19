// Chapter 3: Verdant. Room numbers here are local to this chapter.
window.Chapters = window.Chapters || {};
window.Chapters[3] = {
  title: 'Verdant',
  tagline: 'The last seeds of a world are waiting for water.',
  intro: 'Harbor Nine’s relay sends you the Verdant’s distress call. You board the ark ship, which carries the last seeds of a lost world. Fern, the gardener AI, is waiting by the vault.',
  image: 'assets/ch3/title.webp',
  imageAlt: 'Illustration: the ark ship Verdant with a huge glass dome full of glowing green plants.',
  endings: [
    { flag: 'ending_release', text: 'You opened the glass and let the seeds drift into the dark. Some will find a world. Some will not. All of them are free.' },
    { flag: 'ending_vault', text: 'You sealed the seeds in the vault, safe and patient, for the next world and the next gardener.' },
    { flag: 'ending_replant', text: 'You replanted the dome. Green came back to the Verdant, and for the first time in years the air smelled alive.' } ],
  levels: []
};

// Level 1: Seed Vault. Lights-out puzzle + the worn-out gardener AI.
(function () {
  var fern = { start: 'a', nodes: {
    a: { speaker: 'Fern (garden AI)', text: 'Navigator? The vault doors are frozen. The seeds are fine, I think. I count them every night and the count keeps changing. I may be ill.',
      choices: [
        { text: '"You are not ill, Fern. You are tired. So am I."', req: { stat: 'emp', min: 4 }, next: 'calm', setFlag: 'fern_calm', xp: 15, id: 'fern_calm' },
        { text: '"What exactly is frozen?"', next: 'what' },
        { text: '"Show me the doors."', next: 'what' } ] },
    calm: { speaker: 'Fern (garden AI)', text: 'Tired. Yes, tired. I can work with tired. There are sixteen locks in a grid. Each switch flips itself and its neighbours. They must all be dark to open the vault.',
      choices: [ { text: '"I can do fiddly."', next: 'end' } ] },
    what: { speaker: 'Fern (garden AI)', text: 'Sixteen locks in a grid. Each switch flips itself and the ones next to it, above, below, left and right. They must all be dark to open the vault. It is dreadfully fiddly. I am sorry.',
      choices: [ { text: '"I can do fiddly."', next: 'end' } ] },
    end: { speaker: 'Fern (garden AI)', text: 'I will be here, watering things that do not need water.' } } };

  window.Chapters[3].levels[0] = { id: 1, title: 'Seed Vault',
    image: 'assets/ch3/level1.webp', imageAlt: 'Illustration: a seed vault with glass drawers of seeds and a round vault door with a four by four grid of lock-lights.',
    intro: 'Rows of frosted glass drawers, each holding a thousand seeds from a world that no longer exists. A grid of sixteen lock-lights glows on the vault door, mostly lit. The whole room smells of cold soil.',
    goals: [{ text: 'Open the seed vault', needFlag: 'vault_open' }],
    hotspots: [
      { id: 'look1', label: 'Look at the seed drawers', text: 'Labels in a dead language. Tomato. Rice. A flower you do not know the name of. Each drawer hums softly.', xp: 5 },
      { id: 'fern1', label: 'Answer Fern', dialogue: fern },
      { id: 'p_lights', label: 'Work the vault locks', puzzle: 'lights', setFlag: 'vault_open', xp: 30,
        text: 'Every light goes dark, then the vault door slides open with a soft puff of cold air.' },
      { id: 'door1', label: 'Walk to the dome', needFlag: 'vault_open', exit: true } ] };
})();

// Level 2: The Dome. Logic assignment puzzle + two botanists in an argument.
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

  window.Chapters[3].levels[1] = { id: 2, title: 'The Dome',
    image: 'assets/ch3/level2.webp', imageAlt: 'Illustration: the inside of a great glass dome with three greenhouses side by side and a notice board.',
    intro: 'A great glass dome, three greenhouses growing side by side: Dome, Vine and Moss. A notice board lists three botanists, Ana, Bo and Cy, and a rota that nobody can agree on.',
    goals: [
      { text: 'Fix the rota', needFlag: 'crew_set' },
      { text: 'Settle the argument', needFlag: 'crew_calm' } ],
    hotspots: [
      { id: 'look2', label: 'Read the notice board', text: 'Handwritten notes: "Cy does not tend Vine." "Not my house." "Bo, where are you?" The Moss house is wilting.', xp: 5 },
      { id: 'quarrel', label: 'Calm the argument', dialogue: quarrel },
      { id: 'p_assign', label: 'Fix the rota', puzzle: 'assign', setFlag: 'crew_set', xp: 30,
        text: 'The rota clicks into place. Three botanists, three greenhouses, no more quarrels.' },
      { id: 'door2', label: 'Go to the water room', needAll: ['crew_set', 'crew_calm'], exit: true } ] };
})();

// Level 3: Water Room. Sliding-pipe puzzle + the final decision about the garden's future.
(function () {
  var fern = { start: 'a', nodes: {
    a: { speaker: 'Fern (garden AI)', text: 'Water flows again. Thank you. Now I have to ask you something no one has dared to ask: the garden can only do one thing with what is left. What should it be?',
      choices: [
        { text: '"Replant the dome. Let it live, right here, right now."', next: 'replant' },
        { text: '"Seal the seeds in the vault, safe for the next world."', next: 'vault' },
        { text: '"Open the glass. Let the seeds go. They deserve their own chance."', req: { stat: 'emp', min: 4 }, next: 'release', xp: 25, id: 'fern_release' },
        { text: '"Let me think about it a little longer."', next: 'a' } ] },
    replant: { speaker: 'Fern (garden AI)', text: 'Then we will dig. It will take years, and I will be here for all of them.',
      choices: [ { text: 'Begin replanting.', next: 'fin', setFlag: 'ending_replant' } ] },
    vault: { speaker: 'Fern (garden AI)', text: 'Safe, patient, cold. A good plan. I will keep them company.',
      choices: [ { text: 'Seal the vault.', next: 'fin', setFlag: 'ending_vault' } ] },
    release: { speaker: 'Fern (garden AI)', text: 'Oh. Oh, that is the bravest thing anyone has said on this ship. Opening the glass.',
      choices: [ { text: 'Open the glass.', next: 'fin', setFlag: 'ending_release' } ] },
    fin: { speaker: 'Fern (garden AI)', text: 'Thank you, Navigator. I think I am not ill any more.',
      choices: [ { text: 'Close the channel.', setFlag: 'contacted' } ] } } };

  window.Chapters[3].levels[2] = { id: 3, title: 'Water Room',
    image: 'assets/ch3/level3.webp', imageAlt: 'Illustration: a water room with a tangle of ceiling pipes and a frame of eight numbered pipe sections with one empty slot.',
    intro: 'Pipes cross the ceiling in a tangle. Eight numbered pipe sections sit in a frame with one empty slot. Until they are in order, no water reaches the dome.',
    goals: [
      { text: 'Restore water to the dome', needFlag: 'water_flows' },
      { text: 'Decide what happens to the seeds', needFlag: 'contacted' } ],
    hotspots: [
      { id: 'look3', label: 'Listen to the pipes', text: 'A slow drip, then silence. Somewhere up the line there is a missing segment of the tangle.', xp: 5 },
      { id: 'p_sliding', label: 'Rebuild the water line', puzzle: 'sliding', setFlag: 'water_flows', xp: 30,
        text: 'The sections click into order. A rush of water sounds through the ceiling and the dome lights flicker green.' },
      { id: 'talk3', label: 'Speak with Fern', needFlag: 'water_flows', notFlag: 'contacted', dialogue: fern },
      { id: 'finish3', label: 'Leave the water room', needFlag: 'contacted', exit: true } ] };
})();

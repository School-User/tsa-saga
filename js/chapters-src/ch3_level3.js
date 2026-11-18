// Level 3: Water Room. Sliding-pipe puzzle + the final decision about the garden's future.
window.Levels = window.Levels || [];
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
    fin: { speaker: 'Fern (garden AI)', text: 'Thank you, Gardener. I think I am not ill any more.',
      choices: [ { text: 'Close the channel.', setFlag: 'contacted' } ] } } };

  window.Levels[2] = { id: 3, title: 'Water Room',
    image: 'assets/level3.webp', imageAlt: 'Illustration: a water room with a tangle of ceiling pipes and a frame of eight numbered pipe sections with one empty slot.',
    intro: 'Pipes cross the ceiling in a tangle. Eight numbered pipe sections sit in a frame with one empty slot. Until they are in order, no water reaches the dome.',
    hotspots: [
      { id: 'look3', label: 'Listen to the pipes', text: 'A slow drip, then silence. Somewhere up the line there is a missing segment of the tangle.', xp: 5 },
      { id: 'p_sliding', label: 'Rebuild the water line', puzzle: 'sliding', setFlag: 'water_flows', xp: 30,
        text: 'The sections click into order. A rush of water sounds through the ceiling and the dome lights flicker green.' },
      { id: 'talk3', label: 'Speak with Fern', needFlag: 'water_flows', notFlag: 'contacted', dialogue: fern },
      { id: 'finish3', label: 'Set the garden free to its fate', needFlag: 'contacted', exit: true } ] };
})();

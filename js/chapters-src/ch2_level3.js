// Level 3: Beacon Tower. Tuning puzzle + the final decision about who docks and when.
window.Levels = window.Levels || [];
(function () {
  var captains = { start: 'a', nodes: {
    a: { speaker: 'Three captains (one channel)', text: 'The Reed, the Halcyon and the Marigold, all low on fuel, all asking to dock first, all talking at once. The Halcyon reports hurt crew aboard.',
      choices: [
        { text: '"One at a time, in the order you arrived. Tamsin, you have waited longest."', next: 'fair' },
        { text: '"Halcyon, you have injured crew. You dock first, then the others."', next: 'medic' },
        { text: '"There are three bays. Follow my beacon and I can open all of them at once."', req: { stat: 'emp', min: 5 }, next: 'all', xp: 25, id: 'cap_all' },
        { text: '"Everyone hold. I will decide in a moment."', next: 'a' } ] },
    fair: { speaker: 'Pilot Tamsin (radio)', text: 'Thank you. Order is order. We will wait, and we will not forget it.',
      choices: [ { text: 'Guide them in, one by one.', next: 'fin', setFlag: 'ending_fair' } ] },
    medic: { speaker: 'Halcyon captain', text: 'We will not forget this. Medics are standing by at the airlock.',
      choices: [ { text: 'Guide them in, hurt crew first.', next: 'fin', setFlag: 'ending_medic' } ] },
    all: { speaker: 'The three captains', text: 'Three beacons... three bays... Nobody expected this. Following your light, Harbor Nine.',
      choices: [ { text: 'Open every bay.', next: 'fin', setFlag: 'ending_all' } ] },
    fin: { speaker: 'Harbor Nine', text: 'All ships responding. Docking sequence under way.',
      choices: [ { text: 'Close the channel.', setFlag: 'contacted' } ] } } };

  window.Levels[2] = { id: 3, title: 'Beacon Tower',
    image: 'assets/level3.webp', imageAlt: 'Illustration: a glass beacon tower room with two dials and a glowing tuning screen.',
    intro: 'A glass room at the top of Harbor Nine. A single dial pair, frequency and phase, must be tuned to cut through the nebula static before the beacon can reach all three ships.',
    hotspots: [
      { id: 'look3', label: 'Study the static', text: 'It is not random. Under the hiss there is a faint steady tone, if you can find the right setting.', xp: 5 },
      { id: 'p_tuner', label: 'Tune the beacon', puzzle: 'tuner', setFlag: 'beacon_tuned', xp: 30,
        text: 'The hiss falls away like a curtain. The beacon pulses out clean and bright across the nebula.' },
      { id: 'talk3', label: 'Speak to the captains', needFlag: 'beacon_tuned', notFlag: 'contacted', dialogue: captains },
      { id: 'finish3', label: 'Send the all-clear', needFlag: 'contacted', exit: true } ] };
})();

// Chapter 2: Harbor Nine. Room numbers here are local to this chapter.
window.Chapters = window.Chapters || {};
window.Chapters[2] = {
  title: 'Harbor Nine',
  tagline: 'Three ships are waiting for a light in the nebula.',
  intro: 'The Veil’s chart leads you to Harbor Nine, a waystation at the edge of a nebula. Three lost ships are calling for help. ORI stays on your channel while you guide them in.',
  image: 'assets/ch2/title.webp',
  imageAlt: 'Illustration: a small round waystation with an amber docking ring in a purple nebula, three tiny ships approaching.',
  endings: [
    { flag: 'ending_all', text: 'Three beacons, three bays, no waiting. Harbor Nine had never been so full, or so warm. Nobody was left out in the dark. As the last ship settles in, the waystation relays a distress call from the ark ship Verdant.' },
    { flag: 'ending_medic', text: 'The injured crew reached the infirmary in time. The others waited, but they were safe, and they remembered who made the call. As the last ship settles in, the waystation relays a distress call from the ark ship Verdant.' },
    { flag: 'ending_fair', text: 'One by one, in the order they arrived, the ships docked. It was slow and fair, and every captain left a light on for you. As the last ship settles in, the waystation relays a distress call from the ark ship Verdant.' } ],
  levels: []
};

// Level 1: Docking Ring. Pattern-memory puzzle + a frightened pilot on the radio.
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

  window.Chapters[2].levels[0] = { id: 1, title: 'Docking Ring',
    image: 'assets/ch2/level1.webp', imageAlt: 'Illustration: four glowing round pads with different shapes on a control desk before a nebula window.',
    intro: 'Static hisses on every channel. The docking ring around Harbor Nine is dark, and four coloured pads on the control desk wait for a pattern. Outside the window, a small ship turns slowly in the nebula light.',
    goals: [{ text: 'Light the docking ring', needFlag: 'ring_lit' }],
    hotspots: [
      { id: 'look1', label: 'Look out the window', text: 'Three ships hover at the edge of the nebula, each a faint dot of running lights. Everybody is tired.', xp: 5 },
      { id: 'radio1', label: 'Answer the radio', dialogue: tamsin },
      { id: 'p_memory', label: 'Light the docking ring', puzzle: 'memory', setFlag: 'ring_lit', xp: 30,
        text: 'The ring wakes up in a slow circle of light. Out in the dark, a small ship answers with one blink.' },
      { id: 'door1', label: 'Head down to the cargo bay', needFlag: 'ring_lit', exit: true } ] };
})();

// Level 2: Cargo Bay. Weighing logic puzzle + persuading the dock robot to share the manifest.
(function () {
  var pip = { start: 'a', nodes: {
    a: { speaker: 'Pip (dock robot)', text: 'Manifest is locked. Pip is guarding the cargo list. A crate fell once. Pip does not drop things any more.',
      choices: [
        { text: '"You did not do anything wrong. One dropped crate does not make you a bad robot."', req: { stat: 'emp', min: 4 }, next: 'win', setFlag: 'manifest', xp: 20, id: 'pip_emp' },
        { text: '"Your error log says that lock code belongs to the last owner. Let me show you."', req: { stat: 'sci', min: 4 }, next: 'win', setFlag: 'manifest', xp: 20, id: 'pip_sci' },
        { text: '"Let me recalibrate your grip sensor. Then you will not drop anything."', req: { stat: 'eng', min: 4 }, next: 'win', setFlag: 'manifest', xp: 20, id: 'pip_eng' },
        { text: '"Please, Pip. People are waiting."', next: 'ask' } ] },
    ask: { speaker: 'Pip (dock robot)', text: 'Waiting... people... Pip will think. If you stay and count crates with Pip, Pip will share.',
      choices: [ { text: '"I will count with you."', next: 'win', setFlag: 'manifest', xp: 10, id: 'pip_count' } ] },
    win: { speaker: 'Pip (dock robot)', text: 'Pip will share the list. Thank you for treating Pip like a friend and not a tool.',
      choices: [ { text: '"Thank you, Pip."', next: 'done' } ] },
    done: { speaker: 'Pip (dock robot)', text: 'Manifest unlocked. Crate seven is on the heavy side. Pip thinks.' } } };

  window.Chapters[2].levels[1] = { id: 2, title: 'Cargo Bay',
    image: 'assets/ch2/level2.webp', imageAlt: 'Illustration: nine identical crates in rows and a large brass balance scale, with a small friendly robot.',
    intro: 'Rows of identical grey crates. One of the nine is far heavier than the rest, and a rattled dock robot rolls back and forth in front of the manifest terminal. The airlock to the tower waits behind a lifting rig that will only lift the heavy crate.',
    goals: [
      { text: 'Find the heavy crate', needFlag: 'cargo_ok' },
      { text: 'Get Pip to unlock the manifest', needFlag: 'manifest' } ],
    hotspots: [
      { id: 'look2', label: 'Look at the crates', text: 'Nine crates, all the same size and colour. Only a balance scale will tell them apart.', xp: 5 },
      { id: 'pip', label: 'Talk to Pip', dialogue: pip },
      { id: 'p_scales', label: 'Use the balance scale', puzzle: 'scales', setFlag: 'cargo_ok', xp: 30,
        text: 'The heavy crate rolls onto the lifting rig, and the airlock to the tower slides open with a sigh.' },
      { id: 'door2', label: 'Take the lift to the tower', needAll: ['cargo_ok', 'manifest'], exit: true } ] };
})();

// Level 3: Beacon Tower. Tuning puzzle + the final decision about who docks and when.
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

  window.Chapters[2].levels[2] = { id: 3, title: 'Beacon Tower',
    image: 'assets/ch2/level3.webp', imageAlt: 'Illustration: a glass beacon tower room with two dials and a glowing tuning screen.',
    intro: 'A glass room at the top of Harbor Nine. A single dial pair, frequency and phase, must be tuned to cut through the nebula static before the beacon can reach all three ships.',
    goals: [
      { text: 'Tune the beacon', needFlag: 'beacon_tuned' },
      { text: 'Guide the lost ships in', needFlag: 'contacted' } ],
    hotspots: [
      { id: 'look3', label: 'Study the static', text: 'It is not random. Under the hiss there is a faint steady tone, if you can find the right setting.', xp: 5 },
      { id: 'p_tuner', label: 'Tune the beacon', puzzle: 'tuner', setFlag: 'beacon_tuned', xp: 30,
        text: 'The hiss falls away like a curtain. The beacon pulses out clean and bright across the nebula.' },
      { id: 'talk3', label: 'Speak to the captains', needFlag: 'beacon_tuned', notFlag: 'contacted', dialogue: captains },
      { id: 'finish3', label: 'Send the all-clear', needFlag: 'contacted', exit: true } ] };
})();

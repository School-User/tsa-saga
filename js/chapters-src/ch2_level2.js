// Level 2: Cargo Bay. Weighing logic puzzle + persuading the dock robot to share the manifest.
window.Levels = window.Levels || [];
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

  window.Levels[1] = { id: 2, title: 'Cargo Bay',
    image: 'assets/level2.webp', imageAlt: 'Illustration: nine identical crates in rows and a large brass balance scale, with a small friendly robot.',
    intro: 'Rows of identical grey crates. One of the nine is far heavier than the rest, and a rattled dock robot rolls back and forth in front of the manifest terminal. The airlock to the tower waits behind a lifting rig that will only lift the heavy crate.',
    hotspots: [
      { id: 'look2', label: 'Look at the crates', text: 'Nine crates, all the same size and colour. Only a balance scale will tell them apart.', xp: 5 },
      { id: 'pip', label: 'Talk to Pip', dialogue: pip },
      { id: 'p_scales', label: 'Use the balance scale', puzzle: 'scales', setFlag: 'cargo_ok', xp: 30,
        text: 'The heavy crate rolls onto the lifting rig, and the airlock to the tower slides open with a sigh.' },
      { id: 'door2', label: 'Take the lift to the tower', needAll: ['cargo_ok', 'manifest'], exit: true } ] };
})();

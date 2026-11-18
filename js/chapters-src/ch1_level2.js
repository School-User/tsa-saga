// Level 2: Life Support. Logic puzzle (valves) + social puzzle (persuading ORI).
window.Levels = window.Levels || [];
(function () {
  var lab = { start: 'a', nodes: {
    a: { speaker: 'ORI (ship AI)', text: 'The lab is sealed under protocol nine. Protocol nine says an AI that has lost its crew must not open anything. I think I am afraid that if I break the rule, I will stop being me.',
      choices: [
        { text: '"Rules are made for normal days. This is not one."', next: 'rules' },
        { text: '"I will help you fix your memory core. Then you can decide for yourself."', req: { stat: 'eng', min: 4 }, next: 'win', setFlag: 'lab_open', xp: 25, id: 'lab_eng' },
        { text: '"Your logs show the rule was written for a different ship. Look at the version number."', req: { stat: 'sci', min: 4 }, next: 'win', setFlag: 'lab_open', xp: 25, id: 'lab_sci' },
        { text: '"You are afraid. So am I. We can be afraid together and still open the door."', req: { stat: 'emp', min: 4 }, next: 'win', setFlag: 'lab_open', xp: 25, id: 'lab_emp' },
        { text: 'Say nothing and wait with it.', next: 'wait' } ] },
    rules: { speaker: 'ORI (ship AI)', text: 'That is exactly what the crew said before the pressure spike. I do not think you understand how much I am holding together.',
      choices: [ { text: 'Say nothing and wait with it.', next: 'wait' }, { text: '"Then tell me what is holding together."', next: 'wait' } ] },
    wait: { speaker: 'ORI (ship AI)', text: '...You stayed. Nobody stays. All right. Slowly, then: I will open it. I am trusting you, pilot. Please be worth it.',
      choices: [ { text: '"I will be."', next: 'done', setFlag: 'lab_open', xp: 10, id: 'lab_patient' } ] },
    win: { speaker: 'ORI (ship AI)', text: 'Yes. Yes, that is a reason I can live with. Opening the lab now. Thank you for treating me like a person and not a switch.',
      choices: [ { text: '"Good luck, ORI."', next: 'done' } ] },
    done: { speaker: 'ORI (ship AI)', text: 'Protocol nine, suspended by mutual agreement. The lab is open.' } } };

  window.Levels[1] = { id: 2, title: 'Life Support',
    image: 'assets/level2.webp', imageAlt: 'Illustration: four valve wheels, pipes and a gauge on a life-support wall.',
    intro: 'The air tastes of metal. Four valves on the wall, labelled A to D, feed the ring that keeps the ship breathing. Beyond them, a sealed lab door. A red gauge ticks the wrong way.',
    hotspots: [
      { id: 'gauges', label: 'Read the gauges', text: 'Oxygen is at 61 percent and falling slowly. The valves must be opened in the right order or the pressure will surge.', xp: 5 },
      { id: 'p_valves', label: 'Work the valves', puzzle: 'valves', setFlag: 'air_ok', xp: 30,
        text: 'The valves hiss open one after another. The gauge steadies and climbs. You can breathe.' },
      { id: 'log2', label: 'Read the maintenance log', xp: 5, text: 'Last entry, day 412: "Valve C first, always. Never B before the ring is full. Ask ORI nicely, it remembers kindness."' },
      { id: 'lab', label: 'Ask ORI to open the lab', dialogue: lab },
      { id: 'door2', label: 'Go to the lab', needAll: ['air_ok', 'lab_open'], exit: true } ] };
})();

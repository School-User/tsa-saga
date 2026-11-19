// Chapter 1: Meridian. Room numbers here are local to this chapter.
window.Chapters = window.Chapters || {};
window.Chapters[1] = {
  title: 'Meridian',
  tagline: 'A drifting survey ship and a signal older than its crew.',
  intro: 'You are the Navigator of the survey fleet. You wake aboard the drifting Meridian near a dying star. The ship AI, ORI, is trying to reach you.',
  image: 'assets/ch1/title.webp',
  imageAlt: 'Illustration: a small worn survey ship drifting beside a huge dying red star.',
  nextStop: 'The Veil’s star chart points to your next destination, Harbor Nine.',
  endings: [
    { flag: 'ending_peace', text: 'The Veil comes aboard the Meridian and keeps ORI company on the voyage.' },
    { flag: 'ending_study', text: 'You carry a recording of the Veil so future navigators can hear its voice.' },
    { flag: 'ending_quiet', text: 'The Veil stays behind and keeps broadcasting for the next listener.' } ],
  levels: []
};

// Level 1: Cryo Deck. Environmental puzzle (power) + first talk with the ship AI.
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

  window.Chapters[1].levels[0] = { id: 1, title: 'Cryo Deck',
    image: 'assets/ch1/level1.webp', imageAlt: 'Illustration: frosted cryo pods in cold blue light, one open, and a dead pressure door.',
    intro: 'Cold blue light. Frost on a row of sleeping pods, all dark except yours. A pressure door at the far end is dead. Somewhere, a voice is trying to start.',
    goals: [{ text: 'restore power to open the pressure door', needFlag: 'power_on' }],
    hotspots: [
      { id: 'ori1', label: 'Answer the voice', dialogue: ori },
      { id: 'p_power', label: 'Repair the power grid', puzzle: 'power', setFlag: 'power_on', xp: 30,
        text: 'Power surges through the grid and the pressure door unlocks with a long, tired sigh.' },
      { id: 'look', label: 'Look around', text: 'Seven pods, six empty and cold. Name plates scratched by time. A faint hum comes from the walls.', xp: 5 },
      { id: 'badge', label: 'Check your pod', text: 'Your badge: NAVIGATOR. Under it, a sticky note in your own handwriting: "If you read this, trust the voice. Do not trust the clocks."', xp: 5 },
      { id: 'door1', label: 'Go through the door', needFlag: 'power_on', exit: true } ] };
})();

// Level 2: Life Support. Logic puzzle (valves) + social puzzle (persuading ORI).
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

  window.Chapters[1].levels[1] = { id: 2, title: 'Life Support',
    image: 'assets/ch1/level2.webp', imageAlt: 'Illustration: four valve wheels, pipes and a gauge on a life-support wall.',
    intro: 'The air tastes of metal. Four valves on the wall, labelled A to D, feed the ring that keeps the ship breathing. Beyond them, a sealed lab door. A red gauge ticks the wrong way.',
    goals: [
      { text: 'Restore air', needFlag: 'air_ok' },
      { text: 'Get ORI to open the lab', needFlag: 'lab_open' } ],
    statHelp: 'Reach ENG 4 to offer a memory repair, SCI 4 to challenge protocol and get decoder clues, or EMP 4 to reassure ORI.',
    hotspots: [
      { id: 'gauges', label: 'Read the gauges', text: 'Oxygen is at 61 percent and falling slowly. The valves must be opened in the right order or the pressure will surge.', xp: 5 },
      { id: 'p_valves', label: 'Work the valves', puzzle: 'valves', setFlag: 'air_ok', xp: 30,
        text: 'The valves hiss open one after another. The gauge steadies and climbs. You can breathe.' },
      { id: 'log2', label: 'Read the maintenance log', xp: 5, text: 'Last entry, day 412: "Valve C first, always. Never B before the ring is full. Ask ORI nicely, it remembers kindness."' },
      { id: 'lab', label: 'Ask ORI to open the lab', dialogue: lab },
      { id: 'door2', label: 'Go to the lab', needAll: ['air_ok', 'lab_open'], exit: true } ] };
})();

// Level 3: The Signal. Cipher puzzle + final negotiation. Choices set the ending.
(function () {
  var veil = { start: 'a', nodes: {
    a: { speaker: 'The Signal', text: 'WE ARE NOT ALONE, you said. Correct. We are the Veil, a ship like yours, but older, and our crew is gone. We have repeated that message for nine hundred years because nobody ever answered.',
      choices: [
        { text: '"I am answering. Tell me what you need."', next: 'need' },
        { text: '"How does your signal work? I want to understand it."', req: { stat: 'sci', min: 4 }, next: 'study', setFlag: 'knows_signal', xp: 20, id: 'veil_sci' },
        { text: '"You sound lonely."', req: { stat: 'emp', min: 4 }, next: 'peace', xp: 20, id: 'veil_emp' } ] },
    need: { speaker: 'The Signal', text: 'We need a listener. If you stay in range, our memory can move into your ship and we will no longer be alone. It will cost you your free hours, not your life.',
      choices: [
        { text: '"I will carry you with me."', next: 'peace' },
        { text: '"I cannot take you aboard, but I can record you for the world."', next: 'study' },
        { text: '"I am sorry. I have to leave. Goodbye."', next: 'quiet' } ] },
    peace: { speaker: 'The Signal', text: 'Then the long silence ends. We will sing you a star chart that leads home. Thank you, Navigator.',
      choices: [ { text: 'Set course together.', next: 'fin', setFlag: 'ending_peace' } ] },
    study: { speaker: 'The Signal', text: 'A recording... a record. Yes, someone will hear us. That is almost the same as being found. Take our patterns with you.',
      choices: [ { text: 'Save the recording and set course.', next: 'fin', setFlag: 'ending_study' } ] },
    quiet: { speaker: 'The Signal', text: 'We understand. We will keep sending. Someone else will come.',
      choices: [ { text: 'Turn away.', next: 'fin', setFlag: 'ending_quiet' } ] },
    fin: { speaker: 'The Signal', text: 'Before you go, here is our chart to Harbor Nine. Safe travels, Navigator.',
      choices: [ { text: 'Close the channel.', setFlag: 'contacted' } ] } } };

  window.Chapters[1].levels[2] = { id: 3, title: 'The Signal',
    image: 'assets/ch1/level3.webp', imageAlt: 'Illustration: a glass dome facing a dying star, with pulses of light on a screen.',
    intro: 'The lab is a dome of glass facing the dying star. A single repeating pulse flickers across the main screen. It is not noise. It is a message, shifted and scrambled, and it has been repeating for longer than you have been alive.',
    goals: [
      { text: 'Decode the message', needFlag: 'decoded' },
      { text: 'Choose how to answer the Veil', needFlag: 'contacted' } ],
    hotspots: [
      { id: 'listen', label: 'Listen to the signal', text: 'Three pulses, a gap, three pulses. The rhythm is too patient to be a machine error.', xp: 5 },
      { id: 'p_cipher', label: 'Decode the message', puzzle: 'cipher', setFlag: 'decoded', xp: 30,
        text: 'The scrambled letters fall into place. The message reads: WE ARE NOT ALONE.' },
      { id: 'talk', label: 'Answer the signal', needFlag: 'decoded', notFlag: 'contacted', dialogue: veil },
      { id: 'finish', label: 'Set course', needFlag: 'contacted', exit: true } ] };
})();

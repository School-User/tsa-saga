// Level 3: The Signal. Cipher puzzle + final negotiation. Choices set the ending.
window.Levels = window.Levels || [];
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
    fin: { speaker: 'The Signal', text: 'Goodbye, Navigator.',
      choices: [ { text: 'Close the channel.', setFlag: 'contacted' } ] } } };

  window.Levels[2] = { id: 3, title: 'The Signal',
    image: 'assets/level3.webp', imageAlt: 'Illustration: a glass dome facing a dying star, with pulses of light on a screen.',
    intro: 'The lab is a dome of glass facing the dying star. A single repeating pulse flickers across the main screen. It is not noise. It is a message, shifted and scrambled, and it has been repeating for longer than you have been alive.',
    hotspots: [
      { id: 'listen', label: 'Listen to the signal', text: 'Three pulses, a gap, three pulses. The rhythm is too patient to be a machine error.', xp: 5 },
      { id: 'p_cipher', label: 'Decode the message', puzzle: 'cipher', setFlag: 'decoded', xp: 30,
        text: 'The scrambled letters fall into place. The message reads: WE ARE NOT ALONE.' },
      { id: 'talk', label: 'Answer the signal', needFlag: 'decoded', notFlag: 'contacted', dialogue: veil },
      { id: 'finish', label: 'Set course', needFlag: 'contacted', exit: true } ] };
})();

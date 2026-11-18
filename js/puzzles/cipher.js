// The Signal: rotate a Caesar shift until the incoming letters resolve into a message.
// The incoming signal is shifted left by 7; arrow keys or the buttons change the shift live.
(function () {
  var SIGNAL = 'DL HYL UVA HSVUL';
  var ANSWER = 7;
  var FAIL_AT = 3;

  function mk(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // Decode A-Z by shifting each letter backwards; spaces and punctuation pass through.
  function decode(text, shift) {
    return text.replace(/[A-Z]/g, function (ch) {
      return String.fromCharCode(((ch.charCodeAt(0) - 65 - shift) % 26 + 26) % 26 + 65);
    });
  }

  window.Puzzles = window.Puzzles || {};
  window.Puzzles.cipher = { start: function (el, ctx, done) {
    var sci = !!(ctx && typeof ctx.stat === 'function' && ctx.stat('sci') >= 4);
    var shift = 0, failures = 0, stopped = false, solving = false, timer;

    el.appendChild(mk('h2', {}, 'Caesar decoder'));
    el.appendChild(mk('p', { 'class': 'small' },
      'The incoming signal repeats with a fixed alphabet shift. Turn the shift until the ' +
      'message resolves, then transmit it. Use the minus and plus buttons, or the left and ' +
      'right arrow keys.'));

    el.appendChild(mk('p', { 'class': 'small' }, 'Incoming signal:'));
    el.appendChild(mk('p', { 'class': 'scene',
      style: 'font-family:ui-monospace,monospace;letter-spacing:.18em;margin:.25rem 0' },
      SIGNAL));

    if (sci) {
      el.appendChild(mk('p', { 'class': 'small' },
        'Hint: The most common letter in English is E.'));
    }

    var controls = mk('div', { 'class': 'row' });
    var minus = mk('button', { type: 'button', 'class': 'btn ghost small',
      'aria-label': 'Shift down' }, '−');
    var plus = mk('button', { type: 'button', 'class': 'btn ghost small',
      'aria-label': 'Shift up' }, '+');
    var shiftLine = mk('span', { role: 'status', 'aria-live': 'polite' }, 'Shift: 0');
    minus.addEventListener('click', function () { adjust(-1); });
    plus.addEventListener('click', function () { adjust(1); });
    controls.appendChild(minus); controls.appendChild(shiftLine); controls.appendChild(plus);
    el.appendChild(controls);

    var output = mk('p', { 'class': 'scene', 'aria-live': 'polite',
      style: 'font-family:ui-monospace,monospace;letter-spacing:.18em;margin:.25rem 0;' +
             'min-height:2.2rem' }, decode(SIGNAL, shift));
    el.appendChild(output);

    var live = mk('p', { 'class': 'small', role: 'status', 'aria-live': 'polite' });
    el.appendChild(live);

    var transmit = mk('button', { type: 'button', 'class': 'btn' }, 'Transmit');
    transmit.addEventListener('click', check);
    el.appendChild(transmit);

    var skip = mk('button', { type: 'button', 'class': 'btn ghost small', hidden: '' },
      'Skip puzzle (no XP)');
    skip.addEventListener('click', function () { finish('skip'); });
    var back = mk('button', { type: 'button', 'class': 'btn ghost small' }, 'Back');
    back.addEventListener('click', function () { finish(false); });
    el.appendChild(skip); el.appendChild(back);

    function onKey(e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); adjust(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); adjust(1); }
    }
    document.addEventListener('keydown', onKey);

    function paint() {
      shiftLine.textContent = 'Shift: ' + shift;
      output.textContent = decode(SIGNAL, shift);
      minus.setAttribute('aria-label', 'Shift down, currently ' + shift);
      plus.setAttribute('aria-label', 'Shift up, currently ' + shift);
    }

    function adjust(d) {
      if (stopped || solving) return;
      shift = (shift + d + 26) % 26;
      paint();
    }

    function finish(ok) {
      if (stopped) return;
      stopped = true; clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      minus.disabled = true; plus.disabled = true;
      transmit.disabled = true; skip.disabled = true; back.disabled = true;
      done({ solved: ok === true, skipped: ok === 'skip' });
    }

    function check() {
      if (stopped || solving) return;
      if (shift === ANSWER) {
        solving = true;
        minus.disabled = true; plus.disabled = true;
        transmit.disabled = true; skip.disabled = true; back.disabled = true;
        output.textContent = decode(SIGNAL, shift);
        live.textContent = 'The signal resolves: WE ARE NOT ALONE. Message received.';
        timer = setTimeout(function () { finish(true); }, 1500);
        return;
      }
      failures += 1;
      live.textContent = 'Transmission rejected. The relay buzzes, almost kindly: ' +
        '"not yet, but the shape is close." (Attempt ' + failures + ' of ' + FAIL_AT + '.)';
      if (failures >= FAIL_AT) {
        skip.hidden = false;
        live.textContent += ' A bypass has unlocked.';
      }
    }

    paint();
  } };
})();

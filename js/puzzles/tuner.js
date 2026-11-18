// The signal tuner: match carrier frequency and phase until the strength bar reads full.
// Two native range inputs keep it keyboard-playable; the bar always reports its value.
(function () {
  var TARGET_FREQ = 6;
  var TARGET_PHASE = 3;
  var FAIL_AT = 3;

  function mk(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined) e.textContent = text;
    return e;
  }

  window.Puzzles = window.Puzzles || {};
  window.Puzzles.tuner = { start: function (el, ctx, done) {
    var eng = !!(ctx && typeof ctx.stat === 'function' && ctx.stat('eng') >= 4);
    var freq = 0, phase = 0;
    var failures = 0, stopped = false, solving = false;
    var timer;

    el.appendChild(mk('h2', {}, 'Signal tuner'));
    el.appendChild(mk('p', { 'class': 'small' },
      'Bring the carrier into focus. Set the frequency and the phase, watch the strength ' +
      'bar, and lock in when it peaks. Both sliders work with the arrow keys.'));

    var live = mk('p', { 'class': 'small', role: 'status', 'aria-live': 'polite' });
    var bar = mk('div', { 'class': 'meter', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0',
      'aria-label': 'Signal strength',
      style: 'margin:.5rem 0 1rem' });
    var barFill = mk('span', { style: 'width:0%' });
    bar.appendChild(barFill);

    var freqRow = mk('div', { 'class': 'row' });
    freqRow.appendChild(mk('label', { for: 'tuner-freq', 'class': 'statname' }, 'Frequency'));
    var freqInput = mk('input', { id: 'tuner-freq', type: 'range', min: '0', max: '9',
      step: '1', value: '0', style: 'flex:1 1 auto' });
    var freqOut = mk('output', { for: 'tuner-freq' }, '0');
    freqRow.appendChild(freqInput);
    freqRow.appendChild(freqOut);
    el.appendChild(freqRow);

    var phaseRow = mk('div', { 'class': 'row' });
    phaseRow.appendChild(mk('label', { for: 'tuner-phase', 'class': 'statname' }, 'Phase'));
    var phaseInput = mk('input', { id: 'tuner-phase', type: 'range', min: '0', max: '9',
      step: '1', value: '0', style: 'flex:1 1 auto' });
    var phaseOut = mk('output', { for: 'tuner-phase' }, '0');
    phaseRow.appendChild(phaseInput);
    phaseRow.appendChild(phaseOut);
    el.appendChild(phaseRow);

    el.appendChild(bar);

    var strengthLine = null;
    if (eng) {
      strengthLine = mk('p', { 'class': 'small' }, 'Signal strength: 0%');
      el.appendChild(strengthLine);
    }

    el.appendChild(live);

    var lockBtn = mk('button', { type: 'button', 'class': 'btn' }, 'Lock in');
    lockBtn.addEventListener('click', lock);
    el.appendChild(lockBtn);

    var skip = mk('button', { type: 'button', 'class': 'btn ghost small', hidden: '' },
      'Skip puzzle (no XP)');
    skip.addEventListener('click', function () { finish('skip'); });
    var back = mk('button', { type: 'button', 'class': 'btn ghost small' }, 'Back');
    back.addEventListener('click', function () { finish('back'); });
    el.appendChild(skip); el.appendChild(back);

    freqInput.addEventListener('input', onInput);
    phaseInput.addEventListener('input', onInput);

    function strength() {
      return Math.max(0, 100 - 15 * (Math.abs(freq - TARGET_FREQ) + Math.abs(phase - TARGET_PHASE)));
    }

    function onInput() {
      if (stopped || solving) return;
      freq = Number(freqInput.value);
      phase = Number(phaseInput.value);
      paint();
    }

    function paint() {
      var value = strength();
      freqInput.value = String(freq);
      phaseInput.value = String(phase);
      freqOut.textContent = String(freq);
      phaseOut.textContent = String(phase);
      barFill.style.width = value + '%';
      bar.setAttribute('aria-valuenow', String(value));
      if (strengthLine) strengthLine.textContent = 'Signal strength: ' + value + '%';
    }

    function lock() {
      if (stopped || solving) return;
      if (strength() === 100) {
        solving = true;
        freqInput.disabled = true;
        phaseInput.disabled = true;
        lockBtn.disabled = true;
        skip.disabled = true;
        back.disabled = true;
        live.textContent = 'Carrier locked. The static falls away and the signal comes in clean.';
        timer = setTimeout(function () { finish('solved'); }, 1000);
        return;
      }
      failures += 1;
      live.textContent = 'The channel is pure static — the frequency does not hold. ' +
        '(Attempt ' + failures + ' of ' + FAIL_AT + '.)';
      if (failures >= FAIL_AT) {
        skip.hidden = false;
        live.textContent += ' A bypass has unlocked.';
      }
    }

    function finish(kind) {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      freqInput.disabled = true;
      phaseInput.disabled = true;
      lockBtn.disabled = true;
      skip.disabled = true;
      back.disabled = true;
      done(kind === 'skip' ? { solved: false, skipped: true } : { solved: kind === 'solved' });
    }

    paint();
  } };
})();

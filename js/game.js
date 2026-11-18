// Draws the game and runs levels from data. Rules live in state.js and dialogue.js.
(function () {
  var root = document.getElementById('game');
  var S = null;           // current state
  var LEVELS = window.Levels || [];
  var META = window.GameMeta;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function clear() { while (root.firstChild) root.removeChild(root.firstChild); setTimeout(focusTop, 0); }
  // After every redraw, move focus to the new heading so keyboard and screen-reader users know the screen changed.
  function focusTop() {
    var t = root.querySelector('.panel h2, .panel .who, h1, h2, .hud strong');
    if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: false }); }
  }
  // Decorative illustration (AI-generated, disclosed in docs/ai-log.md). The game works without it.
  function pic(src, alt) {
    if (!src) return document.createComment('');
    var i = el('img', { 'class': 'hero', src: src, alt: alt || '', loading: 'lazy' });
    i.addEventListener('error', function () { i.remove(); });
    return i;
  }
  function btn(text, onClick, cls) { var b = el('button', { type: 'button', 'class': 'btn ' + (cls || '') }, text); b.addEventListener('click', onClick); return b; }

  // ---------- title / character creation ----------
  function title() {
    clear();
    root.appendChild(pic(META.image, META.imageAlt));
    root.appendChild(el('h1', {}, META.title));
    root.appendChild(el('p', { 'class': 'lead' }, META.tagline));
    if (State.load()) root.appendChild(btn('Continue', function () { S = State.load(); play(); }));
    root.appendChild(btn('New game', create, State.load() ? 'ghost' : ''));
    root.appendChild(el('p', { 'class': 'small' }, 'No download, no account. Progress saves in this browser.'));
  }

  function create() {
    clear();
    var a = { eng: 3, sci: 3, emp: 3 }, left = 0;
    root.appendChild(el('h2', {}, 'Who are you?'));
    root.appendChild(el('p', {}, 'Engineering fixes machines. Science reads data. Empathy reads people. Place 9 points; each stat needs at least 1. Stats unlock hints and dialogue options. Low stats never lock you out.'));
    var rows = {}, info = el('p', { role: 'status' });
    var names = { eng: 'Engineering', sci: 'Science', emp: 'Empathy' };
    function redraw() {
      var sum = a.eng + a.sci + a.emp; left = 9 - sum;
      State.STATS.forEach(function (k) { rows[k].textContent = names[k] + ': ' + a[k]; });
      info.textContent = left + ' points left';
      go.disabled = left !== 0;
    }
    var go = btn('Begin', function () { S = State.newGame(a); S.level_id = 1; State.save(S); play(); });
    State.STATS.forEach(function (k) {
      var row = el('div', { 'class': 'row' });
      rows[k] = el('span', { 'class': 'statname' });
      var dec = btn('−', function () { if (a[k] > 1) { a[k]--; redraw(); } }, 'small'); dec.setAttribute('aria-label', 'Decrease ' + names[k]); row.appendChild(dec);
      row.appendChild(rows[k]);
      var inc = btn('+', function () { if (left > 0 && a[k] < 7) { a[k]++; redraw(); } }, 'small'); inc.setAttribute('aria-label', 'Increase ' + names[k]); row.appendChild(inc);
      root.appendChild(row);
    });
    root.appendChild(info); root.appendChild(go); redraw();
  }

  // ---------- HUD ----------
  function hud(lvl, noUp) {
    var bar = el('header', { 'class': 'hud' });
    bar.appendChild(el('strong', {}, 'Level ' + lvl.id + ' · ' + lvl.title));
    var into = S.xp % 40, pct = S.level >= 6 ? 100 : Math.round(into / 40 * 100);
    var stats = el('span', {}, 'ENG ' + S.stats.eng + ' · SCI ' + S.stats.sci + ' · EMP ' + S.stats.emp + ' · Rank ' + S.level + ' · ' + S.xp + ' XP');
    bar.appendChild(stats);
    var meter = el('div', { 'class': 'meter', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': 'XP to next rank' });
    meter.appendChild(el('span', { style: 'width:' + pct + '%' }));
    bar.appendChild(meter);
    if (State.points(S) > 0 && !noUp) {
      var up = el('div', { 'class': 'levelup' }, 'Level up! Add a point: ');
      State.STATS.forEach(function (k) { up.appendChild(btn('+' + k.toUpperCase(), function () { State.spend(S, k); State.save(S); play(); }, 'small')); });
      bar.appendChild(up);
    }
    return bar;
  }

  // ---------- level play ----------
  var logLines = [];
  function say(t) { logLines.push(t); if (logLines.length > 6) logLines.shift(); }

  function play(msg) {
    var lvl = LEVELS[S.level_id - 1];
    if (!lvl) return ending();
    if (msg) say(msg);
    clear();
    root.appendChild(hud(lvl));
    root.appendChild(pic(lvl.image, lvl.imageAlt));
    root.appendChild(el('p', { 'class': 'scene' }, lvl.intro));
    var log = el('ul', { 'class': 'log' });
    logLines.forEach(function (l) { log.appendChild(el('li', {}, l)); });
    root.appendChild(log);
    var box = el('div', { 'class': 'hotspots' });
    lvl.hotspots.forEach(function (h) {
      if ((h.needFlag && !S.flags[h.needFlag]) || (h.notFlag && S.flags[h.notFlag])) return;
      if (h.needAll && !h.needAll.every(function (f) { return S.flags[f]; })) return;
      box.appendChild(btn(h.label, function () { use(lvl, h); }));
    });
    root.appendChild(box);
    root.appendChild(btn('Menu', title, 'ghost small'));
  }

  function reward(h) {
    if (h.setFlag) S.flags[h.setFlag] = true;
    var got = h.xp && h.id ? State.award(S, h.id, h.xp) : 0;
    State.save(S);
    return got ? ' (+' + h.xp + ' XP)' : '';
  }

  function use(lvl, h) {
    if (h.exit) { S.level_id += 1; State.save(S); logLines = []; return play(); }
    if (h.puzzle) return runPuzzle(lvl, h);
    if (h.dialogue) return runDialogue(lvl, h);
    var extra = reward(h);
    play(h.text + extra);
  }

  function runPuzzle(lvl, h) {
    clear(); root.appendChild(hud(lvl, true));
    var p = window.Puzzles[h.puzzle], panel = el('section', { 'class': 'panel', 'aria-label': h.label });
    root.appendChild(panel);
    if (!p) { panel.appendChild(el('p', {}, 'This system is not built yet.')); panel.appendChild(btn('Back', function () { play(); })); return; }
    var ctx = { stat: function (n) { return S.stats[n]; } };
    p.start(panel, ctx, function (res) {
      if (res && res.solved) play(h.text + reward(h));
      else if (res && res.skipped) { if (h.setFlag) S.flags[h.setFlag] = true; State.save(S); play('You bypass it the slow way and move on. No XP for that one.'); }
      else play('You step back from the console for now.');
    });
  }

  function runDialogue(lvl, h) {
    var d = Dialogue.open(h.dialogue, S);
    (function turn() {
      clear(); root.appendChild(hud(lvl, true));
      var v = Dialogue.view(d), panel = el('section', { 'class': 'panel', 'aria-label': 'Conversation' });
      panel.appendChild(el('p', { 'class': 'who' }, v.speaker));
      panel.appendChild(el('p', {}, v.text));
      v.choices.forEach(function (c, i) {
        var b = btn(c.locked ? c.text + '  [' + c.reason + ']' : c.text, function () {
          var r = Dialogue.choose(d, i); if (r) { State.save(S); turn(); }
        }, c.locked ? 'locked' : '');
        if (c.locked) b.disabled = true;
        panel.appendChild(b);
      });
      if (v.end) panel.appendChild(btn('Done', function () { State.save(S); play(); }));
      root.appendChild(panel);
    })();
  }

  function ending() {
    clear();
    var end = META.endings.filter(function (e) { return !e.flag || S.flags[e.flag]; })[0];
    root.appendChild(el('h1', {}, 'The End'));
    root.appendChild(el('p', { 'class': 'lead' }, end.text));
    root.appendChild(el('p', {}, 'Final: Rank ' + S.level + ', ' + S.xp + ' XP.'));
    root.appendChild(btn('Play again', function () { State.clear(); logLines = []; title(); }));
  }

  title();
})();

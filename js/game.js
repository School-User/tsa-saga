// Draws the screens and connects room actions to the state, dialogue and puzzles.
(function () {
  var root = document.getElementById('game');
  var journal = document.getElementById('journal');
  var help = document.getElementById('how-to');
  var LEVELS = window.Levels;
  var CHAPTERS = window.Chapters;
  var META = window.GameMeta;
  var STAT_NAMES = { eng: 'Engineering', sci: 'Science', emp: 'Empathy' };
  var S, screen;
  var logLines = [];
  var journalTotal = LEVELS.reduce(function (total, lvl) {
    return total + lvl.hotspots.filter(hasJournalEntry).length;
  }, 0);

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function focusHeading(heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }

  function focusScreen() {
    if (journal.open || help.open) return;
    var heading = screen.querySelector('.log .new, .panel h2, .who') || screen.querySelector('h1, h2, .hud strong');
    if (heading) focusHeading(heading);
  }

  function clear(chapter) {
    document.body.setAttribute('data-chapter', chapter || 1);
    while (root.firstChild) root.removeChild(root.firstChild);
    screen = el('div', { 'class': 'screen' });
    root.appendChild(screen);
    // Wait until the new screen has its heading.
    setTimeout(focusScreen, 0);
  }

  function pic(src, alt, fallback) {
    var img = el('img', { 'class': 'hero', src: src, alt: alt });
    img.addEventListener('error', function () {
      if (fallback && img.getAttribute('src') !== fallback) {
        img.alt = META.imageAlt;
        img.src = fallback;
      } else {
        img.remove();
      }
    });
    return img;
  }

  function btn(text, onClick, cls) {
    var button = el('button', { type: 'button', 'class': 'btn ' + (cls || '') }, text);
    button.addEventListener('click', onClick);
    return button;
  }

  function menuButton() { return btn('Menu', title, 'ghost small'); }

  function title() {
    clear();
    var saved = State.load();
    screen.appendChild(pic(META.image, META.imageAlt));
    screen.appendChild(el('h1', {}, META.title));
    screen.appendChild(el('p', { 'class': 'lead' }, META.tagline));
    if (saved) {
      screen.appendChild(btn('Continue', function () { S = saved; resume(); }));
    }
    screen.appendChild(btn('New game', create, saved ? 'ghost' : ''));
    screen.appendChild(btn('How to play', howTo, 'ghost'));
    if (saved) {
      var select = el('section', { 'aria-labelledby': 'chapter-select' });
      select.appendChild(el('h2', { id: 'chapter-select' }, 'Chapter select'));
      var list = el('ul', { 'class': 'chapter-select' });
      LEVELS.forEach(function (lvl, i) {
        var firstInChapter = i === 0 || LEVELS[i - 1].chapter !== lvl.chapter;
        if (!firstInChapter || lvl.id > saved.furthest) return;
        var item = el('li');
        item.appendChild(btn(lvl.chapter + ' · ' + CHAPTERS[lvl.chapter].title, function () {
          S = saved;
          enterLevel(lvl.id);
        }, 'ghost small'));
        list.appendChild(item);
      });
      select.appendChild(list);
      screen.appendChild(select);
    }
    screen.appendChild(el('p', { 'class': 'small' }, 'Progress saves in this browser.'));
  }

  function howTo(event) {
    var panel = help;
    var heading = prepareDialog(panel, 'how-to-heading', 'How to play');
    panel.appendChild(el('p', {}, 'You are the Navigator of a survey fleet. Follow a quiet signal through 3 chapters and 9 levels. ' +
      'There is no fighting: every level is solved by exploring, talking and solving a puzzle.'));
    panel.appendChild(el('h3', {}, 'Goal of each level'));
    var steps = el('ol');
    ['Read the room and click the buttons to look at things and talk to the crew.',
     'Find the clue for the puzzle. Clues are saved in the Journal.',
     'Solve the puzzle to open the way to the next level.'].forEach(function (t) { steps.appendChild(el('li', {}, t)); });
    panel.appendChild(steps);
    panel.appendChild(el('h3', {}, 'Controls'));
    var table = el('table', { 'class': 'controls' });
    [['Mouse click or tap', 'Choose an action, a dialogue answer or a puzzle tile'],
     ['Tab / Shift+Tab', 'Move between buttons'],
     ['Enter or Space', 'Press the selected button or tile'],
     ['Arrow keys', 'Move between tiles in grid puzzles and change the shift in the decoder'],
     ['Journal button', 'Read the clues and notes you have found'],
     ['Esc', 'Close How to play or the Journal'],
     ['Menu button', 'Return to the title screen (progress is kept)']].forEach(function (row) {
      var tr = el('tr');
      tr.appendChild(el('th', { scope: 'row' }, row[0]));
      tr.appendChild(el('td', {}, row[1]));
      table.appendChild(tr);
    });
    panel.appendChild(table);
    panel.appendChild(el('h3', {}, 'Stats and ranks'));
    panel.appendChild(el('p', {}, 'Engineering fixes machines. Science reads data. Empathy reads people. ' +
      'High stats unlock extra hints and dialogue choices. Greyed-out choices need a higher stat. ' +
      'Looking around and solving puzzles earns XP. Each new rank gives you a point to add to any stat.'));
    panel.appendChild(el('h3', {}, 'Choices'));
    panel.appendChild(el('p', {}, 'Your choices change how each chapter ends. Every stat build can finish the game.'));
    openDialog(panel, heading, event.currentTarget);
  }

  function create() {
    clear();
    var alloc = { eng: 3, sci: 3, emp: 3 };
    var left = 0, rows = {};
    var info = el('p', { role: 'status' });
    var go = btn('Begin', function () { S = State.newGame(alloc); enterLevel(1); });

    screen.appendChild(el('h2', {}, 'Who are you?'));
    screen.appendChild(el('p', {}, 'Engineering fixes machines. Science reads data. Empathy reads people. Allocate 9 points, with at least 1 in each stat. Stats unlock hints and dialogue options. You can finish with any allocation.'));
    State.STATS.forEach(function (stat) {
      var row = el('div', { 'class': 'row' });
      var dec = btn('−', function () { if (alloc[stat] > 1) { alloc[stat]--; redraw(); } }, 'small');
      var inc = btn('+', function () { if (left > 0) { alloc[stat]++; redraw(); } }, 'small');
      dec.setAttribute('aria-label', 'Decrease ' + STAT_NAMES[stat]);
      inc.setAttribute('aria-label', 'Increase ' + STAT_NAMES[stat]);
      rows[stat] = el('span', { 'class': 'statname' });
      row.appendChild(dec);
      row.appendChild(rows[stat]);
      row.appendChild(inc);
      screen.appendChild(row);
    });
    screen.appendChild(info);
    screen.appendChild(go);
    screen.appendChild(menuButton());
    redraw();

    function redraw() {
      left = 9 - alloc.eng - alloc.sci - alloc.emp;
      State.STATS.forEach(function (stat) {
        rows[stat].textContent = STAT_NAMES[stat] + ' ' + alloc[stat];
      });
      info.textContent = left + ' points left';
      go.disabled = left !== 0;
    }
  }

  // Store the exact screen so a reload at either card resumes there.
  function show(nextScreen) {
    S.screen = nextScreen;
    State.save(S);
    resume();
  }

  function enterLevel(id) {
    var lvl = LEVELS[id - 1], previous = LEVELS[id - 2];
    S.level_id = id;
    S.furthest = Math.max(S.furthest, id);
    logLines = [];
    show(!previous || previous.chapter !== lvl.chapter ? 'chapter-intro' : 'room');
  }

  function leaveLevel(lvl) {
    var next = LEVELS[lvl.id];
    if (!next || next.chapter !== lvl.chapter) show('chapter-complete');
    else enterLevel(next.id);
  }

  function resume() {
    var lvl = LEVELS[S.level_id - 1];
    if (S.screen === 'finale' || !lvl) finale();
    else if (S.screen === 'chapter-intro') chapterIntro(lvl);
    else if (S.screen === 'chapter-complete') chapterComplete(lvl);
    else play();
  }

  function outcome(chapter) {
    var endings = CHAPTERS[chapter].endings;
    return endings.find(function (end) { return S.flags[end.flag]; }) || endings[endings.length - 1];
  }

  function chapterIntro(lvl) {
    var chapter = CHAPTERS[lvl.chapter];
    clear(lvl.chapter);
    screen.appendChild(el('h1', {}, 'Chapter ' + lvl.chapter + ' · ' + chapter.title));
    screen.appendChild(el('p', { 'class': 'lead' }, chapter.tagline));
    screen.appendChild(pic(chapter.image, chapter.imageAlt));
    screen.appendChild(el('p', {}, chapter.intro));
    screen.appendChild(btn('Begin chapter', function () { show('room'); }));
    screen.appendChild(menuButton());
  }

  function chapterComplete(lvl) {
    clear(lvl.chapter);
    screen.appendChild(el('h1', {}, 'Chapter complete'));
    var chapter = CHAPTERS[lvl.chapter];
    screen.appendChild(el('p', { 'class': 'lead' }, chapter.title));
    screen.appendChild(el('p', {}, outcome(lvl.chapter).text));
    var nextStop = outcome(lvl.chapter).nextStop || chapter.nextStop;
    if (nextStop) screen.appendChild(el('p', {}, nextStop));
    screen.appendChild(el('p', {}, rankText()));
    screen.appendChild(btn('Continue', function () {
      if (LEVELS[lvl.id]) enterLevel(lvl.id + 1);
      else show('finale');
    }));
    screen.appendChild(menuButton());
  }

  function finale() {
    clear(LEVELS[LEVELS.length - 1].chapter);
    var epilogue = Object.keys(CHAPTERS).map(function (chapter) {
      return META.epilogue[outcome(chapter).flag];
    }).join(' ');
    screen.appendChild(el('h1', {}, 'The Long Quiet'));
    screen.appendChild(pic('assets/finale.webp', 'The fleet at the end of its voyage.', META.image));
    screen.appendChild(el('p', { 'class': 'lead' }, epilogue));
    screen.appendChild(el('p', {}, rankText()));
    screen.appendChild(el('p', {}, statsText()));
    screen.appendChild(el('p', {}, 'Journal entries found · ' + S.journal.length + ' of ' + journalTotal));
    screen.appendChild(btn('Play again', function () { State.clear(); logLines = []; title(); }));
    screen.appendChild(menuButton());
  }

  function rankText() { return 'Rank ' + S.level + ' · ' + S.xp + ' XP'; }

  function statsText() {
    return State.STATS.map(function (stat) { return stat.toUpperCase() + ' ' + S.stats[stat]; }).join(' · ');
  }

  function hud(lvl, inRoom) {
    var bar = el('header', { 'class': 'hud' });
    bar.appendChild(el('strong', {}, 'Ch ' + lvl.chapter + ' · ' + CHAPTERS[lvl.chapter].title +
      ' · Level ' + lvl.id + ' · ' + lvl.title));
    bar.appendChild(el('span', {}, statsText() + ' · ' + rankText()));
    var into = S.xp % State.XP_PER_LEVEL;
    var pct = S.level >= State.MAX_LEVEL ? 100 : Math.round(into / State.XP_PER_LEVEL * 100);
    var meter = el('div', { 'class': 'meter', role: 'progressbar', 'aria-valuemin': '0',
      'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': 'XP to next rank' });
    meter.appendChild(el('span', { style: 'width:' + pct + '%' }));
    bar.appendChild(meter);
    var tools = el('div');
    tools.appendChild(btn('Journal', openJournal, 'ghost small'));
    tools.appendChild(btn('How to play', howTo, 'ghost small'));
    bar.appendChild(tools);

    if (inRoom && State.points(S) > 0) {
      var up = el('div', { 'class': 'levelup' }, 'Level up! Add a point ');
      State.STATS.forEach(function (stat) {
        var add = btn('+' + stat.toUpperCase(), function () {
          if (State.spend(S, stat)) { State.save(S); play(); }
        }, 'small');
        add.disabled = S.stats[stat] >= 9;
        up.appendChild(add);
      });
      up.appendChild(el('p', { 'class': 'small stat-help' }, lvl.statHelp ||
        '+ENG unlocks repair options · +SCI finds clues · +EMP opens trust-building replies'));
      bar.appendChild(up);
    }
    return bar;
  }

  function hasJournalEntry(h) { return h.id && h.xp; }

  function record(lvl, h, text) {
    if (hasJournalEntry(h) && !S.journal.some(function (entry) { return entry.id === h.id; })) {
      S.journal.push({ id: h.id, level: lvl.id, text: text });
    }
  }

  function prepareDialog(dialog, id, title) {
    var heading = el('h2', { id: id }, title);
    dialog.replaceChildren(heading, btn('Close', function () { dialog.close(); }, 'ghost small'));
    return heading;
  }

  function openDialog(dialog, heading, opener) {
    dialog.addEventListener('close', function () {
      if (opener.isConnected) opener.focus();
      else focusScreen();
    }, { once: true });
    dialog.showModal();
    focusHeading(heading);
  }

  // Keep dialog keys away from puzzle shortcuts on the document.
  [journal, help].forEach(function (dialog) {
    dialog.addEventListener('keydown', function (event) { event.stopPropagation(); });
  });

  function openJournal(event) {
    var heading = prepareDialog(journal, 'journal-heading', 'Journal');
    if (!S.journal.length) journal.appendChild(el('p', {}, 'No entries yet.'));
    Object.keys(CHAPTERS).forEach(function (chapter) {
      var entries = S.journal.filter(function (entry) {
        return LEVELS[entry.level - 1].chapter === Number(chapter);
      });
      if (!entries.length) return;
      journal.appendChild(el('h3', {}, CHAPTERS[chapter].title));
      var list = el('ul');
      entries.forEach(function (entry) {
        list.appendChild(el('li', {}, 'Level ' + entry.level + ' · ' + entry.text));
      });
      journal.appendChild(list);
    });
    openDialog(journal, heading, event.currentTarget);
  }

  function showGoals(lvl, inPuzzle) {
    if (!lvl.goals || !lvl.goals.length) return;
    var line = el('div', { 'class': inPuzzle ? 'goals puzzle-goals' : 'goals' });
    line.appendChild(el('strong', {}, lvl.goals.length === 1 ? 'Goal:' : 'Goals:'));
    lvl.goals.forEach(function (goal) {
      var complete = S.flags[goal.needFlag];
      var item = el('span', {}, goal.text + ' ');
      item.appendChild(el('span', { 'aria-hidden': 'true', 'class': complete ? 'goal-done' : '' },
        complete ? '✓' : '○'));
      item.appendChild(el('span', { 'class': 'visually-hidden' }, complete ? '(complete)' : '(pending)'));
      line.appendChild(item);
    });
    screen.appendChild(line);
  }

  function play(msg) {
    var lvl = LEVELS[S.level_id - 1];
    if (msg) {
      logLines.push(msg);
      if (logLines.length > 6) logLines.shift();
    }
    clear(lvl.chapter);
    screen.appendChild(hud(lvl, true));
    screen.appendChild(pic(lvl.image, lvl.imageAlt));
    screen.appendChild(el('p', { 'class': 'scene' }, lvl.intro));
    var log = el('ul', { 'class': 'log' });
    logLines.forEach(function (line, i) {
      var last = msg && i === logLines.length - 1;
      log.appendChild(el('li', last ? { 'class': 'new' } : {}, line));
    });
    screen.appendChild(log);
    showGoals(lvl);
    var box = el('div', { 'class': 'hotspots' });
    lvl.hotspots.forEach(function (h) {
      if ((h.needFlag && !S.flags[h.needFlag]) || (h.notFlag && S.flags[h.notFlag])) return;
      if (h.needAll && !h.needAll.every(function (flag) { return S.flags[flag]; })) return;
      if (h.puzzle && S.flags[h.setFlag]) return; // solved puzzles stay solved
      box.appendChild(btn(h.label, function () { use(lvl, h); }));
    });
    screen.appendChild(box);
    screen.appendChild(menuButton());
  }

  function reward(lvl, h) {
    if (h.setFlag) S.flags[h.setFlag] = true;
    var got = hasJournalEntry(h) ? State.award(S, h.id, h.xp) : 0;
    record(lvl, h, h.text);
    State.save(S);
    return got ? ' (+' + h.xp + ' XP)' : '';
  }

  function use(lvl, h) {
    if (h.exit) return leaveLevel(lvl);
    if (h.puzzle) return runPuzzle(lvl, h);
    if (h.dialogue) return runDialogue(lvl, h);
    play(h.text + reward(lvl, h));
  }

  function runPuzzle(lvl, h) {
    clear(lvl.chapter);
    screen.appendChild(hud(lvl, false));
    showGoals(lvl, true);
    var panel = el('section', { 'class': 'panel', 'aria-label': h.label });
    screen.appendChild(panel);
    var ctx = { stat: function (stat) { return S.stats[stat]; } };
    window.Puzzles[h.puzzle].start(panel, ctx, function (res) {
      if (res && res.solved) play(h.text + reward(lvl, h));
      else if (res && res.skipped) {
        if (h.setFlag) S.flags[h.setFlag] = true;
        record(lvl, h, 'Used the bypass for “' + h.label + '.”');
        State.save(S);
        play('You bypass it the slow way and move on. No XP for that one.');
      } else {
        play('You step back from the console for now.');
      }
    });
  }

  function runDialogue(lvl, h) {
    var dialogue = Dialogue.open(h.dialogue, S);
    function turn() {
      clear(lvl.chapter);
      screen.appendChild(hud(lvl, false));
      showGoals(lvl);
      var v = Dialogue.view(dialogue);
      var panel = el('section', { 'class': 'panel', 'aria-label': 'Conversation' });
      panel.appendChild(el('p', { 'class': 'who' }, v.speaker));
      panel.appendChild(el('p', {}, v.text));
      v.choices.forEach(function (choice, i) {
        var label = choice.locked ? choice.text + '  [' + choice.reason + ']' : choice.text;
        var button = btn(label, function () {
          if (!Dialogue.choose(dialogue, i)) return;
          State.save(S);
          // A closing choice (no next line) goes straight back to the room instead of repeating the last line.
          if (dialogue.ended) play(); else turn();
        }, choice.locked ? 'locked' : '');
        if (choice.locked) button.setAttribute('aria-disabled', 'true');
        panel.appendChild(button);
      });
      if (v.end) panel.appendChild(btn('Done', function () { play(); }));
      screen.appendChild(panel);
    }
    turn();
  }

  title();
})();

const assert = require('assert');
const State = require('../js/state.js');
globalThis.State = State;
const Dialogue = require('../js/dialogue.js');

// new game rules
assert.strictEqual(State.newGame({ eng: 0, sci: 5, emp: 4 }), null, 'each stat needs at least 1');
assert.strictEqual(State.newGame({ eng: 3, sci: 3, emp: 4 }), null, 'must spend exactly 9');
assert.strictEqual(State.newGame({ eng: 3.5, sci: 3, emp: 3 }), null, 'only whole points');
let s = State.newGame({ eng: 5, sci: 2, emp: 2 });
assert.ok(s && s.level === 1 && s.xp === 0);
assert.deepStrictEqual(s.journal, []);
assert.strictEqual(s.screen, 'chapter-intro');

// xp and levels
assert.strictEqual(State.addXp(s, 44), 0); assert.strictEqual(s.level, 1);
assert.strictEqual(State.addXp(s, 1), 1); assert.strictEqual(s.level, 2);
assert.strictEqual(State.points(s), 1);
assert.ok(State.spend(s, 'sci') && s.stats.sci === 3 && State.points(s) === 0);
assert.ok(!State.spend(s, 'sci'), 'no points left');
assert.strictEqual(State.levelFor(359), 8);
State.addXp(s, 100000); assert.strictEqual(s.level, 9, 'rank cap');

// checks are deterministic
assert.ok(State.check(s, 'eng', 5) && !State.check(s, 'eng', 6));

// award once
s = State.newGame({ eng: 3, sci: 3, emp: 3 });
assert.ok(State.award(s, 'p1', 30) >= 1); assert.strictEqual(State.award(s, 'p1', 30), 0); assert.strictEqual(s.xp, 30);

// dialogue
const tree = { start: 'a', nodes: {
  a: { speaker: 'ORI', text: 'Who is there?', choices: [
    { text: 'Calm it', req: { stat: 'emp', min: 5 }, next: 'b', setFlag: 'calm', xp: 20, id: 'calm' },
    { text: 'Ask plainly', next: 'b' },
    { text: 'Only if calm', needFlag: 'calm', next: 'b' } ] },
  b: { speaker: 'ORI', text: 'Hello.' } } };
s = State.newGame({ eng: 3, sci: 3, emp: 3 });
let d = Dialogue.open(tree, s);
let v = Dialogue.view(d);
assert.strictEqual(v.choices.length, 2, 'flag-gated choice hidden');
assert.ok(v.choices[0].locked && /EMP 5/.test(v.choices[0].reason));
assert.strictEqual(Dialogue.choose(d, 0), null, 'locked choice refused');
assert.ok(Dialogue.choose(d, 1) && d.at === 'b');
assert.ok(Dialogue.view(d).end, 'node without choices ends');
s = State.newGame({ eng: 1, sci: 1, emp: 7 }); d = Dialogue.open(tree, s);
assert.strictEqual(Dialogue.choose(d, 0).xp, 20); assert.ok(s.flags.calm && s.xp === 20);
// Only one ending per chapter can be active. Ended dialogue shows no choices.
{
  const s2 = State.newGame({ eng: 3, sci: 3, emp: 3 });
  s2.flags = { c2_ending_all: true, c3_ending_vault: true, c1_contacted: true };
  const t2 = { start: 'a', nodes: { a: { speaker: 'x', text: 't', choices: [
    { text: 'peace', setFlag: 'c1_ending_peace' }, { text: 'study', setFlag: 'c1_ending_study' } ] } } };
  const d2 = Dialogue.open(t2, s2);
  Dialogue.choose(d2, 0);
  assert.strictEqual(Dialogue.view(d2).choices.length, 0, 'no choices after the talk ends');
  const d3 = Dialogue.open(t2, s2); Dialogue.choose(d3, 1);
  assert.deepStrictEqual(s2.flags, {
    c2_ending_all: true, c3_ending_vault: true, c1_contacted: true, c1_ending_study: true
  });
}

// Saves use the campaign key and resume the current card, even with old data.
{
  const storage = new Map();
  globalThis.localStorage = {
    setItem: (key, value) => storage.set(key, value),
    getItem: key => storage.get(key),
    removeItem: key => storage.delete(key)
  };
  const saved = State.newGame();
  saved.level_id = 6;
  saved.furthest = 8;
  saved.screen = 'chapter-complete';
  saved.journal.push({ id: 'c2_look3', level: 6, text: 'A steady tone.' });
  State.save(saved);
  assert.ok(storage.has('driftSignalSaga.v1'));
  assert.deepStrictEqual(State.load(), saved);
  delete saved.journal;
  delete saved.furthest;
  State.save(saved);
  assert.deepStrictEqual(State.load().journal, []);
  assert.strictEqual(State.load().furthest, 6);
  State.clear();
  assert.strictEqual(State.load(), null);
  delete globalThis.localStorage;
}

// The real rooms, exits and conversations are connected by namespaced flags.
{
  globalThis.window = {};
  const campaign = window;
  require('../js/meta.js');
  require('../js/chapters/ch1.js');
  require('../js/chapters/ch2.js');
  require('../js/chapters/ch3.js');
  require('../js/loader.js');
  delete globalThis.window;

  const { Chapters, Levels, GameMeta } = campaign;
  assert.deepStrictEqual(Levels.map(lvl => lvl.id), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepStrictEqual(Levels.map(lvl => lvl.chapter), [1, 1, 1, 2, 2, 2, 3, 3, 3]);
  assert.deepStrictEqual(Levels[1].hotspots.find(h => h.exit).needAll, ['c1_air_ok', 'c1_lab_open']);
  assert.deepStrictEqual(Levels[4].hotspots.find(h => h.exit).needAll, ['c2_cargo_ok', 'c2_manifest']);
  assert.deepStrictEqual(Levels[7].hotspots.find(h => h.exit).needAll, ['c3_crew_set', 'c3_crew_calm']);
  assert.strictEqual(Levels[0].hotspots.find(h => h.puzzle).puzzle, 'power');
  Object.values(Chapters).forEach(chapter => {
    chapter.endings.forEach(ending => assert.ok(GameMeta.epilogue[ending.flag]));
  });

  // Every required dialogue flag can be reached with just the minimum stat in
  // each category. Each legal allocation therefore has a path through the game.
  const minimum = State.newGame();
  minimum.stats = { eng: 1, sci: 1, emp: 1 };
  const routes = [
    [2, [4, 0], 'c1_lab_open'],        // Wait with ORI
    [3, [0, 2, 0, 0], 'c1_contacted'], // Say goodbye to the Veil
    [5, [3, 0], 'c2_manifest'],       // Count with Pip
    [6, [0, 0, 0], 'c2_contacted'],   // Dock in arrival order
    [8, [2, 0], 'c3_crew_calm'],      // Offer to check the rota
    [9, [0, 0, 0], 'c3_contacted']    // Replant the dome
  ];

  routes.forEach(([level, choices, flag]) => {
    const room = Levels[level - 1];
    const exit = room.hotspots.find(h => h.exit);
    assert.ok([exit.needFlag, ...(exit.needAll || [])].includes(flag));
    const tree = room.hotspots.find(h => h.dialogue).dialogue;
    const talk = Dialogue.open(tree, minimum);
    choices.forEach(choice => assert.ok(Dialogue.choose(talk, choice), 'Level ' + level));
    assert.ok(minimum.flags[flag]);
  });
  assert.ok(minimum.flags.c1_ending_quiet && minimum.flags.c2_ending_fair && minimum.flags.c3_ending_replant);
}

console.log('core: all tests passed');

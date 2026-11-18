const assert = require('assert');
const State = require('../js/state.js');
globalThis.State = State;
const Dialogue = require('../js/dialogue.js');

// new game rules
assert.strictEqual(State.newGame({ eng: 0, sci: 5, emp: 4 }), null, 'each stat needs at least 1');
assert.strictEqual(State.newGame({ eng: 3, sci: 3, emp: 4 }), null, 'must spend exactly 9');
let s = State.newGame({ eng: 5, sci: 2, emp: 2 });
assert.ok(s && s.level === 1 && s.xp === 0);

// xp and levels
assert.strictEqual(State.addXp(s, 39), 0); assert.strictEqual(s.level, 1);
assert.strictEqual(State.addXp(s, 1), 1); assert.strictEqual(s.level, 2);
assert.strictEqual(State.points(s), 1);
assert.ok(State.spend(s, 'sci') && s.stats.sci === 3 && State.points(s) === 0);
assert.ok(!State.spend(s, 'sci'), 'no points left');
State.addXp(s, 100000); assert.strictEqual(s.level, 6, 'level cap');

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
console.log('core: all tests passed');

// only one ending can be active; ended dialogue shows no choices
{
  const s2 = State.newGame({ eng: 3, sci: 3, emp: 3 });
  const t2 = { start: 'a', nodes: { a: { speaker: 'x', text: 't', choices: [
    { text: 'peace', setFlag: 'ending_peace' }, { text: 'study', setFlag: 'ending_study' } ] } } };
  const d2 = Dialogue.open(t2, s2);
  Dialogue.choose(d2, 0);
  assert.strictEqual(Dialogue.view(d2).choices.length, 0, 'no choices after the talk ends');
  const d3 = Dialogue.open(t2, s2); Dialogue.choose(d3, 1);
  assert.ok(s2.flags.ending_study && !s2.flags.ending_peace, 'last ending wins');
}
console.log('core: ending tests passed');

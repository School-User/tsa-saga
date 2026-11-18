// Game state: stats, XP, level, flags. Pure logic, no DOM, so it can be tested in Node.
(function (root) {
  var KEY = (root.GameMeta && root.GameMeta.key) || 'driftSignal.v1';
  var STATS = ['eng', 'sci', 'emp'];
  var START_POINTS = 6, MAX_LEVEL = 6, XP_PER_LEVEL = 40;

  function levelFor(xp) { return Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1); }

  function newGame(alloc) { // alloc: {eng, sci, emp}, each >= 1, total START_POINTS + 3 baseline
    var a = alloc || { eng: 3, sci: 3, emp: 3 };
    var total = 0;
    for (var i = 0; i < STATS.length; i++) {
      var v = Math.floor(Number(a[STATS[i]]));
      if (!(v >= 1)) return null;
      total += v;
    }
    if (total !== START_POINTS + STATS.length) return null; // 9 points: 3 stats at least 1 each
    return { stats: { eng: a.eng, sci: a.sci, emp: a.emp }, xp: 0, level: 1, spent: 0,
             flags: {}, level_id: 1, done: {} };
  }

  // Unspent stat points: one per level gained after level 1.
  function points(s) { return (s.level - 1) - s.spent; }

  function addXp(s, n) {
    var before = s.level;
    s.xp += Math.max(0, Math.floor(n));
    s.level = levelFor(s.xp);
    return s.level - before; // number of level-ups just gained
  }

  function spend(s, stat) {
    if (STATS.indexOf(stat) === -1 || points(s) < 1 || s.stats[stat] >= 9) return false;
    s.stats[stat] += 1; s.spent += 1; return true;
  }

  // Deterministic check: no dice. A stat at or above `min` passes.
  function check(s, stat, min) { return !!s && s.stats[stat] >= min; }

  // Award XP once per id so a puzzle can't be farmed.
  function award(s, id, xp) {
    if (s.done[id]) return 0;
    s.done[id] = true; return addXp(s, xp) + 1; // +1 so callers can tell "awarded" (>=1) from "already done" (0)
  }

  function save(s) { try { root.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ } }
  function load() {
    try {
      var s = JSON.parse(root.localStorage.getItem(KEY));
      if (s && s.stats && typeof s.xp === 'number' && s.flags && s.done) return s;
    } catch (e) { /* fall through */ }
    return null;
  }
  function clear() { try { root.localStorage.removeItem(KEY); } catch (e) { /* nothing */ } }

  var api = { STATS: STATS, START_POINTS: START_POINTS, newGame: newGame, points: points, addXp: addXp,
              spend: spend, check: check, award: award, levelFor: levelFor, save: save, load: load, clear: clear };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.State = api;
})(typeof window !== 'undefined' ? window : globalThis);

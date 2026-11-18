// Dialogue tree engine. Pure logic, no DOM.
// tree = { start: 'a', nodes: { a: { speaker, text, choices: [ {text, next, req:{stat,min}, needFlag, notFlag, setFlag, xp, id} ] } } }
// A node with no choices (or a choice with no `next`) ends the conversation.
(function (root) {
  function open(tree, state) { return { tree: tree, state: state, at: tree.start, ended: false }; }

  // The current line plus its choices. Locked choices are shown but disabled, with the reason.
  function view(d) {
    var node = d.tree.nodes[d.at], s = d.state;
    var choices = d.ended ? [] : (node.choices || []).filter(function (c) {
      return (!c.needFlag || s.flags[c.needFlag]) && (!c.notFlag || !s.flags[c.notFlag]);
    }).map(function (c) {
      var ok = !c.req || s.stats[c.req.stat] >= c.req.min;
      return { text: c.text, locked: !ok, reason: ok ? '' : c.req.stat.toUpperCase() + ' ' + c.req.min + ' needed', raw: c };
    });
    return { speaker: node.speaker, text: node.text, choices: choices, end: d.ended || choices.length === 0 };
  }

  // Pick a choice by its index in view().choices. Returns {xp} earned, or null if not allowed.
  function choose(d, i) {
    var c = view(d).choices[i];
    if (!c || c.locked) return null;
    var raw = c.raw, gained = 0;
    if (raw.setFlag) {
      // Only one ending can be chosen: picking a new one clears the others (matters if the player reloads mid-conversation).
      if (raw.setFlag.indexOf('ending_') === 0) Object.keys(d.state.flags).forEach(function (k) { if (k.indexOf('ending_') === 0) delete d.state.flags[k]; });
      d.state.flags[raw.setFlag] = true;
    }
    if (raw.xp && raw.id) gained = root.State ? (root.State.award(d.state, raw.id, raw.xp) ? raw.xp : 0) : 0;
    if (raw.next && d.tree.nodes[raw.next]) d.at = raw.next; else d.ended = true;
    return { xp: gained };
  }

  var api = { open: open, view: view, choose: choose };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Dialogue = api;
})(typeof window !== 'undefined' ? window : globalThis);

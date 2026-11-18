// Give each chapter its own flag and reward names before the game reads its rooms.
(function () {
  var levels = [];
  Object.keys(window.Chapters).forEach(function (number) {
    var chapter = window.Chapters[number];
    var prefix = 'c' + number + '_';

    function namespaced(item) {
      var copy = Object.assign({}, item);
      ['id', 'setFlag', 'needFlag', 'notFlag'].forEach(function (key) {
        if (copy[key]) copy[key] = prefix + copy[key];
      });
      if (copy.needAll) copy.needAll = copy.needAll.map(function (flag) { return prefix + flag; });
      return copy;
    }

    function hotspot(item) {
      var copy = namespaced(item);
      if (copy.dialogue) {
        var tree = copy.dialogue;
        var nodes = {};
        // Node names and `next` links belong to one tree and never enter the save.
        Object.keys(tree.nodes).forEach(function (key) {
          var node = Object.assign({}, tree.nodes[key]);
          if (node.choices) node.choices = node.choices.map(namespaced);
          nodes[key] = node;
        });
        copy.dialogue = { start: tree.start, nodes: nodes };
      }
      return copy;
    }

    chapter.endings.forEach(function (ending) {
      if (ending.flag) ending.flag = prefix + ending.flag;
    });
    chapter.levels.forEach(function (level) {
      levels.push(Object.assign({}, level, {
        id: levels.length + 1,
        chapter: Number(number),
        hotspots: level.hotspots.map(hotspot)
      }));
    });
  });
  window.Levels = levels;
})();

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
  if (typeof exports == "object" && typeof module == "object")
    // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    // AMD
    define(["../../lib/codemirror"], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";
  //import {dotAttributes} from './dotAttributes.js';
  var WORD = /[\w$]+/,
    RANGE = 500;
  const COMPLETIONS = ["node", "fontname"];

  CodeMirror.registerHelper("hint", "dot", function (editor, options) {
    const returner = (list) => {
      return {
        list: list,
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end),
      };
    };
    var word = (options && options.word) || WORD;
    var range = (options && options.range) || RANGE;
    var cur = editor.getCursor(),
      curLine = editor.getLine(cur.line);
    let token = editor.getTokenAt(cur);
    var end = cur.ch,
      start = end;
    var tokens = [];
    for (
      var lineno = editor.firstLine();
      lineno < editor.lastLine();
      lineno++
    ) {
      tokens = tokens.concat(editor.getLineTokens(lineno));
    }
    const variables = tokens
      .filter((token) => token.type.startsWith("variable"))
      .map((token) => token.string.trim());
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);
    const str = token.string;
    if (token.state.looking_for == "attribute" && str != "=") {
      return returner(
        dotAttributes.filter((token) => token.startsWith(curWord))
      );
    }
    const endedAttr = token.state.looking_for == "attribute" && str;
    const isProperty =
      token.state.looking_for == "property" || token.type == "string-2";

    if (endedAttr || isProperty) {
      const attribute = token.state.attribute;
      let candidates;
      if (attribute != "image") {
        candidates = dotProperties[attribute];
      } else {
        candidates = fontawesome.concat(aws).concat(oss);
        if (str == "=") {
          return returner(
            candidates.map((c) => {
              let d = { ...c };
              d.text = '"' + c.text;
              return d;
            })
          );
        }
        if (str == '"' || str == '="') {
          return returner(candidates);
        }

        const filtered = candidates.filter((item) =>
          item.filename.includes(curWord)
        );
        return returner(filtered);
      }
      if (str == "=" || str == '"' || str == '="') {
        return returner(candidates);
      }
      const list = candidates.filter((token) => token.startsWith(curWord));
      return returner(list);
    }
    const candidates = variables.concat(COMPLETIONS);
    const uniqueCompletions = [...new Set(candidates)];
    const list = uniqueCompletions.filter((token) => token.startsWith(curWord));
    return returner(list);
  });
});


// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Syntax highlighter (and data provider for dot-hint.js) 
// for the DOT (graphviz) language

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

  CodeMirror.defineMode("dot", function (config) {
    var ops = /--|->|=|;/;
    var brackets = /[\[\]{}]/;
    let capturer;
    return {
      startState: function () {
        return { indent_level: 0 };
      },

      token: function (stream, state) {
        stream.eatSpace();

        switch (state.looking_for) {
          /*case "attribute":
                    if (capturer=stream.match(/\w+/)){
                      state.looking_for=null
                      state.attribute = capturer[0]
                      return "variable"
                    }*/
          case "multiline-comment":
            if (stream.match(/.*\*\//)) {
              state.looking_for = null;
            } else {
              stream.skipToEnd();
            }
            return "comment";
          case "property":
            if ((capturer = stream.match(/=\s*\"?/))) {
              if (capturer[0].endsWith('"')) {
                state.quote = true;
              }
              return "variable-3";
            } else if ((capturer = stream.match(/\"/) && state.quote)) {
              state.quote = false;
              state.looking_for = state.open_bracket ? "attribute" : null;
              return "variable-3";
            } else {
              if (state.quote) {
                capturer = stream.match(/[^\"]*/);

                state.looking_for = "property";
                return "string-2";
              } else {
                capturer = stream.match(/[^\/]+/);
                state.looking_for = state.open_bracket ? "attribute" : null;
                return "string-2";
              }
            }
            state.attribute = null;
          case "graphname":
            state.looking_for = null;
            if (stream.match(/{\W*$/)) {
              state.indent_level += 1;
              return "bracket";
            } else if (stream.match("{")) {
              return "bracket";
            } else if ((capturer = stream.match(/[^\W]+/))) {
              return "variable-2";
            }
          default:
            if (stream.match(/{\W*$/)) {
              state.indent_level += 1;
              return "bracket";
            } else if (stream.match(/}\W*$/)) {
              state.indent_level -= 1;
              return "bracket";
            } else if (stream.match(/\[/)) {
              state.looking_for = "attribute";
              state.open_bracket = true;
              return "bracket";
            } else if (stream.match(/\]/)) {
              state.looking_for = null;
              state.open_bracket = false;
              return "bracket";
            } else if (stream.match(brackets)) {
              return "bracket";
            } else if ((capturer = stream.match(/".*"/))) {
              return "string";
            } else if ((capturer = stream.match(/\w+\s*=\s*[\"?\w]*/, false))) {
              state.looking_for = "property";
              const attribute = capturer[0].split("=")[0];
              state.attribute = attribute;
              // console.log("Setting attribute to", attribute)
              stream.match(/[^=]+/);
              return "attribute";
            } else if ((capturer = stream.match(ops))) {
              return "variable-3";
            } else if (stream.match(/(di)?graph[^{\w]+/)) {
              state.looking_for = "graphname";
              return "keyword";
            } else if (stream.match(/\/\/|#/)) {
              stream.skipToEnd();
              state.open_bracket ? "attribute" : null;
              return "comment";
            } else if (stream.match(/\/\*.*\*\//)) {
              return "comment";
            } else if (stream.match("/*")) {
              state.looking_for = "multiline-comment";
              return "comment";
            } else if (stream.match(/\w+/)) {
              return "variable";
            } else {
              stream.skipToEnd();
              return "variable";
            }
        }
      },

      indent: function (state, _textAfter) {
        return state.indent_level * (config.indentUnit || 2);
      },

      closeBrackets: { pairs: '[]{}""' },
      lineComment: /(\/\/|#)/,
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    };
  });

  CodeMirror.defineMIME("text/x-dot", "dot");
});


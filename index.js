(function (mod) {
  if (typeof exports == "object" && typeof module == "object")
    // CommonJS
    mod(require("codemirror"));
  else if (typeof define == "function" && define.amd)
    // AMD
    define(["codemirror"], mod); // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  function clearInlineSuggestion(cm) {
    if (cm.state.inlineSuggestion) {
      cm.state.inlineSuggestion.bookmark.clear();
      if (cm.state.inlineSuggestion.lineWidget) {
        cm.state.inlineSuggestion.lineWidget.clear();
      }
      cm.state.inlineSuggestion = null;
    }
  }

  function setInlineSuggestion(cm, { text, pos }) {
    clearInlineSuggestion(cm);

    if (!text) {
      return;
    }

    const { line, ch } = pos;
    const textLines = text.split("\n");
    const el = document.createElement("pre");

    const lineHandle = cm.getLineHandle(line);

    el.style.cssText = "margin: 0; display: inline;opacity: 0.5;";
    el.style.direction = cm.getOption("direction");

    const placeHolder = document.createTextNode(textLines[0]);
    el.appendChild(placeHolder);

    const bookmark = cm.setBookmark({ line, ch }, { widget: el });
    cm.state.inlineSuggestion = { bookmark, pos, text };

    if (textLines.length > 1) {
      const empty = document.createElement("pre");
      empty.classList.add("CodeMirror-line-like");
      empty.appendChild(document.createTextNode(textLines.slice(1).join("\n")));
      empty.style.cssText = "margin: 0; opacity: 0.5; display: inline-block;";

      const div = document.createElement("div");
      div.appendChild(empty);
      div.appendChild(document.createTextNode(lineHandle.text.slice(ch)));

      const lineWidget = cm.addLineWidget(line, div);
      cm.state.inlineSuggestion.lineWidget = lineWidget;
    }
  }

  async function suggest(cm) {
    const cursor = cm.getCursor();
    const textBefore = cm.getRange({ line: 0, ch: 0 }, cursor);
    const textAfter = cm.getRange(cursor, {
      line: cm.lineCount() - 1,
      ch: cm.getLine(cm.lineCount() - 1).length,
    });
    const requestFn = cm.getOption("inlineSuggestionRequestFn");

    setInlineSuggestion(cm, {
      text: await requestFn(textBefore, textAfter),
      pos: cursor,
    });
  }

  CodeMirror.defineInitHook((cm) => {
    cm.on("beforeChange", clearInlineSuggestion);
    cm.addKeyMap({
      "Alt-[": (cm) => {
        suggest(cm);
      },
      Tab: (cm) => {
        if (!cm.state.inlineSuggestion) {
          return;
        }
        cm.replaceRange(
          cm.state.inlineSuggestion.text,
          cm.state.inlineSuggestion.pos,
        );
        clearInlineSuggestion(cm);
      },
    });
  });
});

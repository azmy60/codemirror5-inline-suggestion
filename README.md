# codemirror5-inline-suggestion

An extension to display inline suggestion in CodeMirror v5

## Installation

```bash
# via NPM
npm install codemirror5-inline-suggestion

# via Yarn
yarn add codemirror5-inline-suggestion
```

## Usage

```js
import CodeMirror from "codemirror";
import "codemirror5-inline-suggestion";

CodeMirror.fromTextArea(document.querySelector("textarea"), {
  lineNumbers: true,
  inlineSuggestionRequestFn: async (textBefore, textAfter) => {
    const content = `You are a programmer that replaces <FILL_ME> part with the right code. Only output the code that replaces <FILL_ME> part. Do not add any explanation or markdown. ${textBefore}<FILL_ME>${textAfter}`;
    const result = await fetch("<YOUR_AI_URL>", {
      method: "POST",
      body: JSON.stringify({ role: "user", content }),
    }).then((response) => response.json());
    return result.message;
  },
});
```

To trigger inline suggestion, press `Alt` + `[`.
To apply suggestion, press `Tab`.

## License

MIT

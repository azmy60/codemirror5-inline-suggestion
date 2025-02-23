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

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.css"
    />
  </head>
  <body>
    <textarea></textarea>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js"></script>
    <script src="node_modules/codemirror5-inline-suggestion/index.js"></script>
    <script>
      const editor = CodeMirror.fromTextArea(
        document.querySelector("textarea"),
        {
          lineNumbers: true,
          async inlineSuggestionRequestFn(textBefore, textAfter) {
            const content = `You are a programmer that replaces <FILL_ME> part with the right code. Only output the code that replaces <FILL_ME> part. Do not add any explanation or markdown. ${textBefore}<FILL_ME>${textAfter}`;
            const result = await fetch("<YOUR_AI_URL>", {
              method: "POST",
              body: JSON.stringify({ role: "user", content }),
            }).then((response) => response.json());
            return result.message;
          },
        },
      );
    </script>
  </body>
</html>
```

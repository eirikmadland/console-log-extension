# console-log-extension

A lightweight extension to the native `console.log` function, providing:

- **Customizable styling** (themes, color levels, emojis)
- **Configurable timestamps**, filenames, and line numbers
- **Log level detection** (`[INFO]`, `[WARNING]`, `[ERROR]`, `[DEBUG]`) and more
- **Quick initialization & flexible usage**

---

## Key Features

- **No external dependencies** – Just import and call.
- **Themes**: `dark`, `light`, `neon`, `minimal`.
- **Log Levels**: `[INFO]`, `[WARNING]`, `[ERROR]`, `[DEBUG]`. Automatically colored.
- **Emojis** for each level (optional).
- **Timestamps**, file names, function names, line numbers.
- **Disable** logging entirely or switch to fallback/throw on errors.

---

## Installation

```bash
npm install console-log-extension
```

Or with Yarn:

```bash
yarn add console-log-extension
```

---

## Import & Setup

### In a Standard JS/TS Project

```js
import log from 'console-log-extension';

// Optionally configure global defaults
log.init({
  theme: 'dark',
  showDate: true,
  showFilename: true,
  showLineNumber: true,
  useEmojis: true,
  errorHandling: 'silent', // 'silent' | 'fallback' | 'throw'
});

// Basic usage
log("Hello, world!");

// Log with a known level
log("[INFO]", "Information log!");
log("[WARNING]", "Something might be off...");
log("[ERROR]", "An error occurred.");
log("[DEBUG]", "Debugging details.");
```

### In a Vue Project

```html
<script setup>
import log from 'console-log-extension'

// Initialize global settings
log.init({
  theme: 'neon',
  showDate: true,
  showLogLevel: true,
  useEmojis: true
});

log("[INFO]", "Vue component loaded!");
</script>
```

---

## Configuration Options

You can pass a config object to `log.init({...})` with these properties:

| Property           | Type      | Default   | Description                                                                      |
|--------------------|-----------|-----------|----------------------------------------------------------------------------------|
| **theme**          | string    | `"dark"`  | Visual theme: `dark`, `light`, `neon`, `minimal`.                                |
| **showDate**       | boolean   | `true`    | Display a timestamp prefix.                                                      |
| **showFilename**   | boolean   | `true`    | Display the filename where `log` was called (when available).                    |
| **showLineNumber** | boolean   | `true`    | Display the line number (when available).                                        |
| **showLogLevel**   | boolean   | `true`    | Display `[LOG]`, `[INFO]`, `[ERROR]`, etc.                                       |
| **useEmojis**      | boolean   | `true`    | Show emojis corresponding to log levels.                                         |
| **disable**        | boolean   | `false`   | If `true`, disables logging entirely.                                            |
| **errorHandling**  | string    | `"silent"`| - `"silent"`: Swallow errors internally.
|                    |           |           | - `"fallback"`: Fallback to native `console.log(...).`
|                    |           |           | - `"throw"`: Rethrow the error.                                                  |

---

## API

### `log(...args)`

Call the main log function with any arguments. The first argument can optionally be a recognized log level:

- `[INFO]`
- `[WARNING]`
- `[ERROR]`
- `[DEBUG]`

If so, the function automatically styles and color-codes the output accordingly.

### `log.init(config)`

Merge user config with the existing default config:

```js
log.init({
  theme: "light",
  showLineNumber: false,
  errorHandling: "throw"
});
```

---

## Examples

```js
// Basic Log
log("Hello World");

// Log an object
log("User Data:", { name: "John", age: 30 });

// Log a known level
log("[ERROR]", "Something went wrong!");

// Disable logs
log.init({ disable: true });
log("No output...");

// Re-enable logs
log.init({ disable: false });
log("We are back!");
```

---

## Known Limitations

- **Global-scope logs** may sometimes show `file: 'unknown'` or `line: '?'` in certain browsers.
  This is a limitation of how the browser handles stack traces for top-level code.
- For best results, log **inside functions** or modules to see correct file names/line numbers.

---

## License

MIT. See [LICENSE](LICENSE) for details.

---

## Contributing

Issues and Pull Requests welcome! Please open an issue describing your proposal or bug. Then feel free to submit a PR.

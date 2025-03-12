// console-logger-fresh.js
// Themes without background colors + no debug messages.

class ConsoleLogExtension {
  constructor() {
      this.config = {
          theme: "dark", // Default theme
          showDate: true,
          showFilename: true,
          showLineNumber: true,
          showLogLevel: true,
          useEmojis: true,
          disable: false,
          errorHandling: "silent"
      };
  }

  init(userConfig = {}) {
      this.config = { ...this.config, ...userConfig };
  }

  log(...args) {
      if (this.config.disable) return;
      try {
          const { theme, showDate, showFilename, showLineNumber, showLogLevel, useEmojis } = this.config;

          // Detect log level
          let logLevel = this.detectLogLevel(args[0]);
          if (logLevel) {
              args = args.slice(1);
          } else {
              logLevel = "[LOG]";
          }

          const emoji = this.getLogLevelEmoji(logLevel);

          let prefixParts = [];

          // Possibly an emoji
          if (useEmojis) {
              prefixParts.push(emoji);
          }

          // Possibly a date/time
          if (showDate) {
              prefixParts.push(`[${new Date().toLocaleString()}]`);
          }

          // Find the real caller
          const { file, line, functionName } = this.findRealCaller();

          if (showFilename && file !== "unknown") {
              prefixParts.push(`[${file}]`);
          }
          if (showLineNumber && line !== "?") {
              prefixParts.push(`(line ${line})`);
          }
          if (functionName && functionName !== "Global Scope") {
              prefixParts.push(`{${functionName}}`);
          }

          prefixParts.push(logLevel);

          const prefix = prefixParts.join(" ") + " ";

          console.log(`%c${prefix}`, this.getThemeStyles(theme, logLevel), ...args);
      } catch (error) {
          if (this.config.errorHandling === "fallback") {
              console.log(...args);
          } else if (this.config.errorHandling === "throw") {
              throw error;
          }
      }
  }

  findRealCaller() {
      const err = new Error();
      const stackLines = err.stack.split("\n").map(line => line.trim());

      for (let i = 1; i < stackLines.length; i++) {
          const line = stackLines[i];
          const match = line.match(/at (.*?) \(?(.+?):(\d+):(\d+)\)?/);
          if (match) {
              const func = match[1] || "Global Scope";
              const fullPath = match[2] || "unknown";
              const lineNum = match[3] || "?";

              // Skip references to the logger file/class
              if (
                  fullPath.includes("console-logger-fresh.js") ||
                  fullPath.includes("console_log_extension_fresh") ||
                  func.includes("ConsoleLogExtension")
              ) {
                  continue;
              }

              const file = fullPath.split(/[\\/]/).pop() || "unknown";
              const functionName = func !== "<anonymous>" ? func : "Global Scope";

              return {
                  functionName,
                  file,
                  line: lineNum
              };
          }
      }

      // fallback
      return {
          functionName: "Global Scope",
          file: "unknown",
          line: "?"
      };
  }

  detectLogLevel(msg) {
      const knownLevels = ["[INFO]", "[WARNING]", "[ERROR]", "[DEBUG]"];
      return knownLevels.includes(msg) ? msg : null;
  }

  getLogLevelEmoji(level) {
      const mapping = {
          "[INFO]": "ℹ️",
          "[WARNING]": "⚠️",
          "[ERROR]": "❌",
          "[DEBUG]": "🐞",
          "[LOG]": "📝",
      };
      return mapping[level] || mapping["[LOG]"];
  }

  getThemeStyles(theme, level) {
      // No background colors
      const levelStyles = {
          "[INFO]": "color: blue; font-weight: bold;",
          "[WARNING]": "color: orange; font-weight: bold;",
          "[ERROR]": "color: red; font-weight: bold;",
          "[DEBUG]": "color: gray; font-style: italic;",
          "[LOG]": "",
      };

      // Remove background color from all themes
      const themeStyles = {
          dark: "color: white;",
          light: "color: black;",
          neon: "color: cyan; font-weight: bold;",
          minimal: "color: gray; font-style: italic;"
      };

      const finalLevelStyle = levelStyles[level] || "";
      const finalThemeStyle = themeStyles[theme] || themeStyles.dark;

      return finalLevelStyle + finalThemeStyle;
  }
}

const logger = new ConsoleLogExtension();
const log = logger.log.bind(logger);
log.init = logger.init.bind(logger);
export default log;

// console-log-extension/index.js

/**
 * @file console-log-extension
 * A lightweight extension to the native console.log function, providing:
 *  - Customizable styling (themes, color levels, emojis)
 *  - Configurable timestamps, filenames, line numbers
 *  - Log level detection ([INFO], [WARNING], [ERROR], [DEBUG], etc.)
 *  - Quick initialization & flexible usage
 */

/**
 * The main class that manages logging functionality.
 * @class
 */
class ConsoleLogExtension {
    /**
     * @constructor
     * Initializes default configuration.
     */
    constructor() {
      /**
       * Default config object.
       * @property {string} theme - Visual theme for logs ("dark", "light", "neon", "minimal").
       * @property {boolean} showDate - Whether to display a timestamp.
       * @property {boolean} showFilename - Whether to display the caller filename.
       * @property {boolean} showLineNumber - Whether to display the caller line number.
       * @property {boolean} showLogLevel - Whether to display the log level ([LOG], [INFO], etc.).
       * @property {boolean} useEmojis - Whether to prepend emoji icons for log levels.
       * @property {boolean} disable - If true, logging is fully disabled.
       * @property {string} errorHandling - How to handle errors in the logging function ("silent", "fallback", "throw").
       */
      this.config = {
        theme: "dark", // Default theme
        showDate: true,
        showFilename: true,
        showLineNumber: true,
        showLogLevel: true,
        useEmojis: true,
        disable: false,
        errorHandling: "silent",
      };
    }
  
    /**
     * Merge custom user config with existing config.
     * @param {Object} userConfig - Partial config overrides.
     */
    init(userConfig = {}) {
      this.config = { ...this.config, ...userConfig };
    }
  
    /**
     * Main log function. Wraps native console.log with extra features.
     * @param {...any} args - Accepts any number of parameters to log.
     */
    log(...args) {
      if (this.config.disable) return; // If disabled, skip.
  
      try {
        const {
          theme,
          showDate,
          showFilename,
          showLineNumber,
          showLogLevel,
          useEmojis,
        } = this.config;
  
        // Detect log level if first arg is [INFO], [WARNING], etc.
        let logLevel = this.detectLogLevel(args[0]);
        if (logLevel) {
          args = args.slice(1);
        } else {
          logLevel = "[LOG]";
        }
  
        // Pick emoji based on log level.
        const emoji = this.getLogLevelEmoji(logLevel);
  
        // Build array of prefix segments.
        let prefixParts = [];
  
        // 1. Possibly an emoji
        if (useEmojis) {
          prefixParts.push(emoji);
        }
  
        // 2. Possibly a date/time
        if (showDate) {
          prefixParts.push(`[${new Date().toLocaleString()}]`);
        }
  
        // 3. Real caller details
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
  
        // 4. Log level
        prefixParts.push(logLevel);
  
        // Combine prefix into a string
        const prefix = prefixParts.join(" ") + " ";
  
        // Output to console with inline CSS from theme.
        console.log(`%c${prefix}`, this.getThemeStyles(theme, logLevel), ...args);
      } catch (error) {
        // If an error occurs, handle based on errorHandling.
        if (this.config.errorHandling === "fallback") {
          console.log(...args);
        } else if (this.config.errorHandling === "throw") {
          throw error;
        }
        // If silent, do nothing.
      }
    }
  
    /**
     * Attempts to determine the real caller file, function, and line.
     * Skips references to the logger itself.
     * @returns {{ functionName: string, file: string, line: string }}
     */
    findRealCaller() {
      // Create a new Error for stack trace.
      const err = new Error();
      const stackLines = err.stack.split("\n").map((line) => line.trim());
  
      // Skip first line ("Error") and find next user code line.
      for (let i = 1; i < stackLines.length; i++) {
        const line = stackLines[i];
        // Attempt to parse function, file, line.
        const match = line.match(/at (.*?) \(?(.+?):(\d+):(\d+)\)?/);
        if (match) {
          const func = match[1] || "Global Scope";
          const fullPath = match[2] || "unknown";
          const lineNum = match[3] || "?";
  
          // Skip references to the logger
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
            line: lineNum,
          };
        }
      }
  
      // If no valid line found, fallback to unknown.
      return {
        functionName: "Global Scope",
        file: "unknown",
        line: "?",
      };
    }
  
    /**
     * Detect if the first argument is a known log level.
     * @param {string} msg - The first argument to check.
     * @returns {string|null} The recognized log level or null.
     */
    detectLogLevel(msg) {
      const knownLevels = ["[INFO]", "[WARNING]", "[ERROR]", "[DEBUG]"];
      return knownLevels.includes(msg) ? msg : null;
    }
  
    /**
     * Map a log level to a corresponding emoji.
     * @param {string} level - The detected log level.
     * @returns {string} The matching emoji.
     */
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
  
    /**
     * Determines final console CSS based on theme and log level.
     * @param {string} theme - The name of the theme (dark, light, neon, minimal).
     * @param {string} level - The log level ([INFO], [WARNING], etc.).
     * @returns {string} CSS string to apply in console.
     */
    getThemeStyles(theme, level) {
      // Level-based inline styles.
      const levelStyles = {
        "[INFO]": "color: blue; font-weight: bold;",
        "[WARNING]": "color: orange; font-weight: bold;",
        "[ERROR]": "color: red; font-weight: bold;",
        "[DEBUG]": "color: gray; font-style: italic;",
        "[LOG]": "",
      };
  
      // Basic themes without background colors.
      const themeStyles = {
        dark: "color: white;",
        light: "color: black;",
        neon: "color: cyan; font-weight: bold;",
        minimal: "color: gray; font-style: italic;",
      };
  
      const finalLevelStyle = levelStyles[level] || "";
      const finalThemeStyle = themeStyles[theme] || themeStyles.dark;
  
      // Combine level style + theme style.
      return finalLevelStyle + finalThemeStyle;
    }
  }
  
  /**
   * Create a single instance of ConsoleLogExtension.
   * Provide an exported function `log` that calls the instance's method.
   */
  const logger = new ConsoleLogExtension();
  
  /**
   * The primary function users will call: log("message"), log({ object }), etc.
   * Also attaches `init()` for config.
   * @function log
   * @param {...any} args - arguments to log
   */
  const log = logger.log.bind(logger);
  
  /**
   * Attach init so users can configure globally.
   * @function init
   * @param {Object} userConfig - partial overrides for configuration.
   */
  log.init = logger.init.bind(logger);
  
  /**
   * Export the log function as default for easy import.
   */
  export default log;
  
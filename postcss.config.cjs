/**
 * PostCSS config в CommonJS для совместимости с Next.js в CI.
 * Ключ — путь к файлу, иначе Next.js ищет плагин в node_modules.
 */
const path = require("path");
const postcssBasePath = require("./postcss-base-path.cjs");

module.exports = {
  plugins: {
    "postcss-import": {},
    ...(process.env.BASE_PATH
      ? { [path.resolve(__dirname, "postcss-base-path.cjs")]: {} }
      : {}),
    tailwindcss: {},
    autoprefixer: {},
  },
};

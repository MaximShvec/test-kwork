/**
 * PostCSS config в CommonJS для совместимости с Next.js в CI.
 */
const postcssBasePath = require("./postcss-base-path.cjs");

module.exports = {
  plugins: {
    "postcss-import": {},
    ...(process.env.BASE_PATH
      ? { "postcss-base-path": [postcssBasePath, {}] }
      : {}),
    tailwindcss: {},
    autoprefixer: {},
  },
};

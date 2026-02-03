/**
 * PostCSS plugin: подставляет basePath в url() в CSS для GitHub Pages.
 * CommonJS для совместимости с Next.js в CI.
 */
const basePath = process.env.BASE_PATH || "";

function postcssBasePath() {
  return {
    postcssPlugin: "postcss-base-path",
    Declaration(decl) {
      if (!basePath || !decl.value || !decl.value.includes("url(")) return;
      decl.value = decl.value.replace(
        /url\((["']?)\/(?!\/)/g,
        `url($1${basePath}/`
      );
    },
  };
}
postcssBasePath.postcss = true;

module.exports = postcssBasePath;

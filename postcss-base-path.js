/**
 * PostCSS plugin: подставляет basePath в url() в CSS для GitHub Pages.
 * Читает BASE_PATH из process.env (задаётся в GitHub Actions).
 */
const basePath = process.env.BASE_PATH || "";

export default function postcssBasePath() {
  return {
    postcssPlugin: "postcss-base-path",
    Declaration(decl) {
      if (!basePath || !decl.value || !decl.value.includes("url(")) return;
      // url("/images/...") или url('/images/...') или url(/images/...)
      decl.value = decl.value.replace(
        /url\((["']?)\/(?!\/)/g,
        `url($1${basePath}/`
      );
    },
  };
}
postcssBasePath.postcss = true;

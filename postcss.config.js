import postcssBasePath from "./postcss-base-path.js";

export default {
  plugins: {
    "postcss-import": {},
    ...(process.env.BASE_PATH && { "postcss-base-path": postcssBasePath }),
    tailwindcss: {},
    autoprefixer: {},
  },
};

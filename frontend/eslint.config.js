import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

export default [

  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "next.config.js",
      "postcss.config.js",
      "tailwind.config.js",
    ],
  },

  js.configs.recommended,

  {
    plugins: {
      "@next/next": nextPlugin,
    },

    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];
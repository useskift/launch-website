import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginA11y from "eslint-plugin-jsx-a11y";

export default [
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginA11y.flatConfigs.recommended,

  {
    rules: {},
  },
];

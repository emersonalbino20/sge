import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  
  {
    rules: {
      "no-unused-vars": "error",
      "no-console": "error",
      "react/prop-types": "off",
      "eqeqeq": "warn",
      "curly": "error",
      "array-callback-return": "warn",
      "for-direction": "error",
      "getter-return": "error",
      "no-async-promise-executor": "error",
      "no-await-in-loop": "warn",
      "no-compare-neg-zero": "error",
      "no-cond-assign": "warn",
      "no-const-assign": "error",
      "no-dupe-args": "warn",
      "no-dupe-class-members": "error",
      "no-dupe-else-if": "error",
      "no-dupe-keys": "warn",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "no-empty-pattern": "warn",
      "no-ex-assign": "warn",
      "no-fallthrough": "warn",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-sparse-arrays": "error",
      "no-setter-return": "error",
      "no-template-curly-in-string": "error",
      "no-undef": "off",/*global someFunction, a*/
      //var bar = a + 1;
      "no-unexpected-multiline": "error",
      "no-unreachable": "warn",
      "no-unreachable-loop": "warn",
      "no-unsafe-finally": "warn",
      "no-unsafe-negation": "warn",
      "no-use-before-define": "error",
      "no-useless-assignment": "error",
      "require-atomic-updates": "error",
      "use-isnan": "error",
      "requireStringLiterals": "off",
      "valid-typeof": "off",
      "block-scoped-var": "error",
      // "camelcase": "",
      //"capitalized-comments": "",always
      "eqeqeq": "error",
      "no-alert": "error",
      "no-bitwise": "error",
      //console
      "no-else-return": "error",
      "no-empty": "error",
      "no-empty-function": "warn",
      "no-eq-null": "error",
      "no-redeclare": "error",
      "arrow-body-style": ["error", "always"],
    }
  },

 { settings: {
    react: {
     version: "detect",
    }
  }
}
];
module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
    ],
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    settings: {
      react: {
       version: "detect",
      },
    },
    rules: {
      // Suas regras personalizadas aqui
    },
  };
  
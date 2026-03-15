import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_+$",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_+$",
          "destructuredArrayIgnorePattern": "^_+$",
          "varsIgnorePattern": "^_+$",
          "ignoreRestSiblings": true
        }
      ]
    },
  },
];

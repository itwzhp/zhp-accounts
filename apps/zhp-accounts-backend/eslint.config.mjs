import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-types": [
        "warn",
        { allowExpressions: true },
      ],
    },
  },
];

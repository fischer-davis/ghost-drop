// @ts-check
import { Linter } from "eslint";

/** @type {Linter.Config} */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "drizzle"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "next/core-web-vitals", // Added Next.js linting rules
    "plugin:drizzle/recommended", // Added Drizzle linting rules
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"],
  overrides: [
    {
      files: ["apps/web/**/*.{ts,tsx}"],
      extends: ["next/core-web-vitals"], // Next.js rules for web app
    },
    {
      files: ["apps/server/**/*.ts"],
      extends: ["plugin:@typescript-eslint/recommended"], // TypeScript rules for server
      rules: {
        "no-console": "warn",
      },
    },
    {
      files: ["apps/cli/**/*.ts"],
      extends: ["plugin:@typescript-eslint/recommended"], // TypeScript rules for CLI
      rules: {
        "no-console": "off",
      },
    },
  ],
};

export default config;

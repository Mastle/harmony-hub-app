import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import cypress from "eslint-plugin-cypress" // <-- Import the Cypress plugin

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser, // Retain browser globals
        ...globals.cypress, // Add Cypress globals
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "19" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      cypress, // <-- Add the Cypress plugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      ...cypress.configs.recommended.rules, // <-- Add Cypress recommended rules
    },
  },
  {
    files: ["cypress/**/*.js", "cypress/**/*.ts"], // <-- Override for Cypress files
    env: {
      "cypress/globals": true, // Enable Cypress globals for test files
    },
    plugins: ["cypress"], // Enable Cypress plugin in test files
    extends: ["plugin:cypress/recommended"], // Use Cypress recommended config
  },
]

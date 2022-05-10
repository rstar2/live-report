module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  extends: ["plugin:@typescript-eslint/recommended", "eslint:recommended", "prettier"],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "prettier/prettier": "error",

    // Note: a lot of rules are same for JS and for TS (@typescript-eslint/xxx)
    // and they have to be disabled in order the TS to work as expected
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
        // allow defined arguments if they start with underscore
        "argsIgnorePattern": "^_"
    }],
  },
};

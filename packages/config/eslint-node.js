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
  },
  rules: {
    "no-console": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "prettier/prettier": "error",
  },
};
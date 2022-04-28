// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const base = require("config/eslint-node");

// eslint-disable-next-line no-undef
module.exports = {
  ...base,

  // specific rules just for this app
  rules: {
    ...base.rules,
    // "no-console": "error",
    // "@typescript-eslint/no-non-null-assertion": "off"
  },
};

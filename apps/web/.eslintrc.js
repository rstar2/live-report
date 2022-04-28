// this JS file is not needed to be lint by the Eslint itself, still disabled the "known warns"

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const base = require("config/eslint-web");

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

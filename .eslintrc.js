module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "airbnb-base"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "linebreak-style": ["error", "windows"],
    "quotes": ["error", "double"],
    "max-len": ["error", { "code": 120 }],
    "no-loop-func": 1,
  }
};
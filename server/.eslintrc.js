// server/.eslintrc.js
export default {
  root: true,
  env: {
    node: true, // ✅ Ini yang aktifkan process & Buffer
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [],
  extends: [],
  rules: {
    "no-undef": "off", // ✅ Matikan warning 'undefined' yang salah
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

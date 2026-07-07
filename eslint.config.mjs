import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...next,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    // react-hooks v6 (bundled with Next 16) ships aggressive new rules that
    // flag established, working patterns (data loading on mount, closing a
    // menu on navigation, document.cookie writes). Keep them as warnings so
    // real errors still fail CI without blocking on these false positives.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;

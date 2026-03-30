# Law: one type per file

In `src/` (excluding `index.ts`, `*.test.ts`, `*.fixture.ts`, and `src/exports/**`), each file declares **at most one** top-level type (class, interface, type alias, enum). Function-only files are allowed.

Enforced by ESLint rule `robotico/one-top-level-type` (see `eslint.config.js`).

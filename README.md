# @robotico/outbox

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![ESM](https://img.shields.io/badge/module-ESM-FFCA28)](https://nodejs.org/api/esm.html) [![Vitest](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/) [![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

Transactional outbox for TypeScript. Write events/messages in the same transaction as domain changes; background processor publishes. Aligned with Robotico C# Outbox.

## Installation

```bash
npm install @robotico/outbox
```

## Usage

*(Implement IOutbox, add within transaction, processor to publish and mark done.)*

## License

MIT

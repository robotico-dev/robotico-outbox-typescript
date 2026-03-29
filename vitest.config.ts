import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "**/index.ts",
        "src/exports/**/*.ts",
        "src/**/*.fixture.ts",
        "**/i-*.ts",
        "**/*-version.ts",
        "**/outbox-entry-status.ts",
        "**/dispatch-outbox-batch-options.ts",
        "**/dispatch-outbox-batch-hooks-option.ts",
        "**/outbox-dispatch-options-*.ts",
        "**/i-outbox-record-store-fields.ts",
        "**/*-shape.ts",
        "**/re-export-outbox-*.ts",
      ],
      thresholds: { branches: 100, functions: 100, lines: 100, statements: 100 },
    },
  },
});

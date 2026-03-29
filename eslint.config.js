import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },
      globals: {},
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "max-classes-per-file": ["error", 1],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.fixture.ts"],
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },
  {
    files: ["src/**/*.ts"],
    ignores: [
      "src/**/*.test.ts",
      "src/**/*.fixture.ts",
      "src/exports/**",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ExportNamedDeclaration[declaration.type='ClassDeclaration'] ~ ExportNamedDeclaration[declaration.type='ClassDeclaration']",
          message: "At most one exported class per file (one type per file).",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='TSInterfaceDeclaration'] ~ ExportNamedDeclaration[declaration.type='TSInterfaceDeclaration']",
          message: "At most one exported interface per file (one type per file).",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='TSTypeAliasDeclaration'] ~ ExportNamedDeclaration[declaration.type='TSTypeAliasDeclaration']",
          message: "At most one exported type alias per file (one type per file).",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='ClassDeclaration'] ~ ExportNamedDeclaration[declaration.type='TSInterfaceDeclaration']",
          message:
            "One type per file: do not export a class and an interface from the same file.",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='ClassDeclaration'] ~ ExportNamedDeclaration[declaration.type='TSTypeAliasDeclaration']",
          message:
            "One type per file: do not export a class and a type alias from the same file.",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='TSInterfaceDeclaration'] ~ ExportNamedDeclaration[declaration.type='ClassDeclaration']",
          message:
            "One type per file: do not export an interface and a class from the same file.",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='TSInterfaceDeclaration'] ~ ExportNamedDeclaration[declaration.type='TSTypeAliasDeclaration']",
          message:
            "One type per file: do not export an interface and a type alias from the same file.",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='TSTypeAliasDeclaration'] ~ ExportNamedDeclaration[declaration.type='ClassDeclaration']",
          message:
            "One type per file: do not export a type alias and a class from the same file.",
        },
        {
          selector:
            "ExportNamedDeclaration[declaration.type='TSTypeAliasDeclaration'] ~ ExportNamedDeclaration[declaration.type='TSInterfaceDeclaration']",
          message:
            "One type per file: do not export a type alias and an interface from the same file.",
        },
      ],
    },
  }
);

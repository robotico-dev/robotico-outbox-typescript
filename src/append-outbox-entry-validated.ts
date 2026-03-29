import type { ResultVoid } from "@robotico-dev/result";
import { invalidIssuesToResultVoid } from "@robotico-dev/validation";
import type { Rule } from "@robotico-dev/validation";
import { isValid } from "@robotico-dev/validation";
import { validateWithRules } from "@robotico-dev/validation";

import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxStore } from "./i-outbox-store.js";

/** Validates with `@robotico-dev/validation` before {@link IOutboxStore.append}. */
export function appendOutboxEntryValidated(
  store: IOutboxStore,
  rules: readonly Rule<IOutboxEntry>[],
  entry: IOutboxEntry
): Promise<ResultVoid> {
  const vr = validateWithRules(entry, rules);
  if (!isValid(vr)) {
    return Promise.resolve(invalidIssuesToResultVoid(vr.issues));
  }
  return store.append(entry);
}

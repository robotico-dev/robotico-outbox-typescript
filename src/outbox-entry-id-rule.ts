import type { Rule } from "@robotico-dev/validation";
import { createValidationIssue } from "@robotico-dev/validation";

import type { IOutboxEntry } from "./i-outbox-entry.js";

export const outboxEntryIdRule: Rule<IOutboxEntry> = (entry: IOutboxEntry) =>
  entry.id.trim().length === 0
    ? [createValidationIssue("id", "must be non-empty")]
    : null;

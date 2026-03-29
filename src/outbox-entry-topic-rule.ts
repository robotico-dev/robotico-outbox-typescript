import type { Rule } from "@robotico-dev/validation";
import { createValidationIssue } from "@robotico-dev/validation";

import type { IOutboxEntry } from "./i-outbox-entry.js";

export const outboxEntryTopicRule: Rule<IOutboxEntry> = (entry) =>
  entry.topic.trim().length === 0
    ? [createValidationIssue("topic", "must be non-empty")]
    : null;

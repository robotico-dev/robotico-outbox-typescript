import type { Rule } from "@robotico-dev/validation";

import type { IOutboxEntry } from "./i-outbox-entry.js";
import { outboxEntryIdRule } from "./outbox-entry-id-rule.js";
import { outboxEntryTopicRule } from "./outbox-entry-topic-rule.js";

/** Baseline synchronous rules for {@link IOutboxEntry} (id and topic non-empty). */
export function createOutboxEntryRules(): readonly Rule<IOutboxEntry>[] {
  return [outboxEntryIdRule, outboxEntryTopicRule];
}

import type { OutboxEntryStatus } from "./outbox-entry-status.js";

/** Shape for {@link IOutboxRecordStoreFields}. */
export type OutboxRecordStoreFieldsShape = {
  readonly status: OutboxEntryStatus;
};

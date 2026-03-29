import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxRecord } from "./i-outbox-record.js";

/** Strips store-only fields for transport. */
export function outboxRecordToEntry(record: IOutboxRecord): IOutboxEntry {
  const { status, ...entry } = record;
  void status;
  return entry;
}

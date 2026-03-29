import type { IOutboxEntry } from "./i-outbox-entry.js";

/** Minimal outbox entry factory for tests. */
export function createOutboxTestEntry(id: string): IOutboxEntry {
  return {
    id,
    topic: "t",
    payload: { x: 1 },
    headers: {},
    createdAt: new Date(),
  };
}

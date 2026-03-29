import {
  createSimpleError,
  error,
  success,
  successOf,
} from "@robotico-dev/result";
import type { Result, ResultVoid } from "@robotico-dev/result";

import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxRecord } from "./i-outbox-record.js";
import type { IOutboxStore } from "./i-outbox-store.js";
import { OUTBOX_DUPLICATE_ENTRY_ID_CODE } from "./outbox-duplicate-entry-id-code.js";
import { OUTBOX_ENTRY_NOT_FOUND_CODE } from "./outbox-entry-not-found-code.js";

/** In-memory {@link IOutboxStore} for tests and single-node scenarios. */
export class InMemoryOutboxStore implements IOutboxStore {
  private readonly records = new Map<string, IOutboxRecord>();

  append(entry: IOutboxEntry): Promise<ResultVoid> {
    if (this.records.has(entry.id)) {
      return Promise.resolve(
        error(
          createSimpleError(
            `outbox entry id already exists: ${entry.id}`,
            OUTBOX_DUPLICATE_ENTRY_ID_CODE
          )
        )
      );
    }
    const record: IOutboxRecord = {
      ...entry,
      status: "pending",
    };
    this.records.set(entry.id, record);
    return Promise.resolve(success());
  }

  fetchPendingBatch(limit: number): Promise<Result<readonly IOutboxRecord[]>> {
    if (limit < 1) {
      return Promise.resolve(successOf([]));
    }
    const pending: IOutboxRecord[] = [];
    for (const r of this.records.values()) {
      if (r.status === "pending") {
        pending.push(r);
        if (pending.length >= limit) {
          break;
        }
      }
    }
    return Promise.resolve(successOf(pending));
  }

  markPublished(id: string): Promise<ResultVoid> {
    const row = this.records.get(id);
    if (row === undefined) {
      return Promise.resolve(
        error(
          createSimpleError(
            `outbox entry not found: ${id}`,
            OUTBOX_ENTRY_NOT_FOUND_CODE
          )
        )
      );
    }
    this.records.set(id, { ...row, status: "published" });
    return Promise.resolve(success());
  }
}

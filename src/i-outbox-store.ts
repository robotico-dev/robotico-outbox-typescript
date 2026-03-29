import type { Result, ResultVoid } from "@robotico-dev/result";

import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxRecord } from "./i-outbox-record.js";

/** Append and poll outbox rows (adapter-friendly port). */
export interface IOutboxStore {
  append(entry: IOutboxEntry): Promise<ResultVoid>;

  fetchPendingBatch(limit: number): Promise<Result<readonly IOutboxRecord[]>>;

  markPublished(id: string): Promise<ResultVoid>;
}

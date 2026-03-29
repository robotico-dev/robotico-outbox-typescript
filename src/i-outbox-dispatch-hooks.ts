import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxRecord } from "./i-outbox-record.js";

/** Optional dispatch lifecycle hooks for metrics, tracing, or structured logging. */
export interface IOutboxDispatchHooks {
  readonly onBatchFetched?: (records: readonly IOutboxRecord[]) => void;
  readonly onAfterTransportSuccess?: (entry: IOutboxEntry) => void;
  readonly onAfterMarkPublished?: (id: string) => void;
}

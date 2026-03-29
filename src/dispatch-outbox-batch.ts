import { executeWithRetryResult } from "@robotico-dev/resilience";
import {
  expectSuccessVoid,
  fromVoidResult,
  isError,
  isErrorOf,
  success,
} from "@robotico-dev/result";
import type { ResultVoid } from "@robotico-dev/result";

import type { DispatchOutboxBatchOptions } from "./dispatch-outbox-batch-options.js";
import type { IOutboxStore } from "./i-outbox-store.js";
import type { IOutboxTransport } from "./i-outbox-transport.js";
import { outboxRecordToEntry } from "./outbox-record-to-entry.js";

/**
 * Fetches a pending batch, publishes each entry with `@robotico-dev/resilience` retries,
 * then marks rows published one-by-one after successful send.
 *
 * **Delivery semantics:** successful `publish` followed by a crash before `markPublished` can yield a
 * redelivery of the same {@link IOutboxEntry}; {@link IOutboxTransport.publish} and message consumers
 * should be idempotent (use {@link IOutboxEntry.id} or {@link IOutboxEntry.idempotencyKey}).
 *
 * **Ordering:** batch members are those currently marked pending in the store; stable cross-process
 * ordering is the responsibility of the {@link IOutboxStore} implementation.
 */
export async function dispatchOutboxBatch(
  store: IOutboxStore,
  transport: IOutboxTransport,
  options: DispatchOutboxBatchOptions
): Promise<ResultVoid> {
  const batchRes = await store.fetchPendingBatch(options.batchSize);
  if (batchRes._tag === "err") {
    return fromVoidResult(batchRes);
  }
  const batch = batchRes.value;
  options.hooks?.onBatchFetched?.(batch);
  for (const record of batch) {
    const entry = outboxRecordToEntry(record);
    const sendRes = await executeWithRetryResult(async () => {
      expectSuccessVoid(await transport.publish(entry));
    }, options.retry);
    if (isErrorOf(sendRes)) {
      return fromVoidResult(sendRes);
    }
    options.hooks?.onAfterTransportSuccess?.(entry);
    const markRes = await store.markPublished(record.id);
    if (isError(markRes)) {
      return markRes;
    }
    options.hooks?.onAfterMarkPublished?.(record.id);
  }
  return success();
}

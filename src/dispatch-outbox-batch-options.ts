import type { DispatchOutboxBatchHooksOption } from "./dispatch-outbox-batch-hooks-option.js";
import type { OutboxDispatchOptionsBatchSize } from "./outbox-dispatch-options-batch-size.js";
import type { OutboxDispatchOptionsRetry } from "./outbox-dispatch-options-retry.js";

/** Batch size, retry policy, and optional dispatch hooks for `dispatchOutboxBatch`. */
export type DispatchOutboxBatchOptions = OutboxDispatchOptionsBatchSize &
  OutboxDispatchOptionsRetry &
  DispatchOutboxBatchHooksOption;

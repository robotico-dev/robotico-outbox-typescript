import type { OutboxDispatchRetryShape } from "./outbox-dispatch-retry-shape.js";

/** Retry policy forwarded to `@robotico-dev/resilience` around transport publish. */
export type OutboxDispatchOptionsRetry = OutboxDispatchRetryShape;

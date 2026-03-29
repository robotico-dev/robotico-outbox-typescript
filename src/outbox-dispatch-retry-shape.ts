import type { RetryOptions } from "@robotico-dev/resilience";

/** Shape for {@link OutboxDispatchOptionsRetry}. */
export type OutboxDispatchRetryShape = {
  readonly retry: RetryOptions;
};

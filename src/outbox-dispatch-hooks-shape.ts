import type { IOutboxDispatchHooks } from "./i-outbox-dispatch-hooks.js";

/** Shape for {@link DispatchOutboxBatchHooksOption}. */
export type OutboxDispatchHooksShape = {
  readonly hooks?: IOutboxDispatchHooks;
};

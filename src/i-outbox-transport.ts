import type { ResultVoid } from "@robotico-dev/result";

import type { IOutboxEntry } from "./i-outbox-entry.js";

/**
 * Downstream publisher (message bus, HTTP hook, etc.).
 * Implementations must tolerate {@link IOutboxTransport.publish} being invoked more than once for the
 * same logical entry when the process fails after send but before the store marks the row published.
 */
export interface IOutboxTransport {
  publish(entry: IOutboxEntry): Promise<ResultVoid>;
}

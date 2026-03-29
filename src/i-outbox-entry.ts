/**
 * User-supplied message staged for reliable publishing.
 *
 * {@link IOutboxEntry.idempotencyKey} is optional metadata for transports and consumers: dispatch uses
 * at-least-once semantics, so downstream handlers should treat duplicate delivery as normal and dedupe
 * when this key (or {@link IOutboxEntry.id}) is seen again.
 */
export interface IOutboxEntry {
  readonly id: string;
  readonly topic: string;
  readonly payload: unknown;
  readonly headers: Readonly<Record<string, string>>;
  readonly createdAt: Date;
  /** Optional key carried to consumers for idempotent processing (in addition to {@link id}). */
  readonly idempotencyKey?: string;
}

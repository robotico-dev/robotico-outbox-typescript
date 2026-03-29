import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxRecordStoreFields } from "./i-outbox-record-store-fields.js";

/** Entry as persisted by {@link IOutboxStore} including dispatch state. */
export type IOutboxRecord = IOutboxEntry & IOutboxRecordStoreFields;

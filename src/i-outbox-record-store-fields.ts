import type { OutboxRecordStoreFieldsShape } from "./outbox-record-store-fields-shape.js";

/** Store-owned fields merged with {@link IOutboxEntry} to form {@link IOutboxRecord}. */
export type IOutboxRecordStoreFields = OutboxRecordStoreFieldsShape;

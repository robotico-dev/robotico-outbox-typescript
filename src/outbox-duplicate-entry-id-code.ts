/** Stable code when {@link InMemoryOutboxStore.append} sees an existing `id`. */
export const OUTBOX_DUPLICATE_ENTRY_ID_CODE =
  "Outbox.DuplicateEntryId" as const;

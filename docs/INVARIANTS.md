# Outbox invariants

1. **Append** — Duplicate entry ids are rejected with `OUTBOX_DUPLICATE_ENTRY_ID_CODE`.
2. **Pending batch** — `fetchPendingBatch(limit)` returns at most `limit` pending rows; `limit < 1` yields an empty array.
3. **Mark published** — Unknown ids fail with `OUTBOX_ENTRY_NOT_FOUND_CODE`; published rows no longer appear as pending.
4. **Dispatch** — `dispatchOutboxBatch` honors transport, hooks, retry, and batch options without turning domain failures into throws.

Contract tests run these scenarios on the `Map` and object-record in-memory stores.

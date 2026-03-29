import { describe, expect, it } from "vitest";
import { getValue, isError, isSuccess } from "@robotico-dev/result";

import { InMemoryOutboxStore } from "./in-memory-outbox-store.js";
import { OUTBOX_DUPLICATE_ENTRY_ID_CODE } from "./outbox-duplicate-entry-id-code.js";
import { OUTBOX_ENTRY_NOT_FOUND_CODE } from "./outbox-entry-not-found-code.js";
import { createOutboxTestEntry } from "./outbox-test-entry.fixture.js";

describe("InMemoryOutboxStore", () => {
  it("rejects duplicate ids on append", async () => {
    const store = new InMemoryOutboxStore();
    expect(isSuccess(await store.append(createOutboxTestEntry("1")))).toBe(
      true
    );
    const second = await store.append(createOutboxTestEntry("1"));
    expect(isError(second)).toBe(true);
    if (isError(second)) {
      expect(second.error.code).toBe(OUTBOX_DUPLICATE_ENTRY_ID_CODE);
    }
  });

  it("returns empty batch when limit is below 1", async () => {
    const store = new InMemoryOutboxStore();
    await store.append(createOutboxTestEntry("a"));
    const batch = await store.fetchPendingBatch(0);
    expect(isSuccess(batch)).toBe(true);
    expect(getValue(batch)).toHaveLength(0);
  });

  it("errors when marking unknown id published", async () => {
    const store = new InMemoryOutboxStore();
    const r = await store.markPublished("nope");
    expect(isError(r)).toBe(true);
    if (isError(r)) {
      expect(r.error.code).toBe(OUTBOX_ENTRY_NOT_FOUND_CODE);
    }
  });

  it("fetches pending batch and marks published", async () => {
    const store = new InMemoryOutboxStore();
    await store.append(createOutboxTestEntry("a"));
    await store.append(createOutboxTestEntry("b"));
    const batch = await store.fetchPendingBatch(10);
    expect(isSuccess(batch)).toBe(true);
    expect(getValue(batch)).toHaveLength(2);
    expect(isSuccess(await store.markPublished("a"))).toBe(true);
    const again = await store.fetchPendingBatch(10);
    expect(isSuccess(again)).toBe(true);
    expect(getValue(again)).toHaveLength(1);
    expect(getValue(again)[0]?.id).toBe("b");
  });

  it("respects batch limit when many rows are pending", async () => {
    const store = new InMemoryOutboxStore();
    for (const id of ["a", "b", "c", "d", "e"]) {
      await store.append(createOutboxTestEntry(id));
    }
    const batch = await store.fetchPendingBatch(2);
    expect(isSuccess(batch)).toBe(true);
    expect(getValue(batch)).toHaveLength(2);
  });
});

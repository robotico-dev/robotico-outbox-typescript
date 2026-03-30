import { describe, expect, it } from "vitest";
import { getValue, isError, isSuccess } from "@robotico-dev/result";

import type { IOutboxStore } from "./i-outbox-store.js";
import { InMemoryOutboxStore } from "./in-memory-outbox-store.js";
import { OUTBOX_DUPLICATE_ENTRY_ID_CODE } from "./outbox-duplicate-entry-id-code.js";
import { OUTBOX_ENTRY_NOT_FOUND_CODE } from "./outbox-entry-not-found-code.js";
import { createOutboxTestEntry } from "./outbox-test-entry.fixture.js";
import { RecordInMemoryOutboxStore } from "./record-in-memory-outbox-store.js";

const storeFactories: readonly {
  readonly name: string;
  readonly create: () => IOutboxStore;
}[] = [
  {
    name: "InMemoryOutboxStore (Map)",
    create: () => new InMemoryOutboxStore(),
  },
  {
    name: "RecordInMemoryOutboxStore",
    create: () => new RecordInMemoryOutboxStore(),
  },
];

describe.each(storeFactories)("$name — IOutboxStore contract", ({ create }) => {
  it("rejects duplicate ids on append", async () => {
    const store = create();
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
    const store = create();
    await store.append(createOutboxTestEntry("a"));
    const batch = await store.fetchPendingBatch(0);
    expect(isSuccess(batch)).toBe(true);
    expect(getValue(batch)).toHaveLength(0);
  });

  it("errors when marking unknown id published", async () => {
    const store = create();
    const r = await store.markPublished("nope");
    expect(isError(r)).toBe(true);
    if (isError(r)) {
      expect(r.error.code).toBe(OUTBOX_ENTRY_NOT_FOUND_CODE);
    }
  });

  it("fetches pending batch and marks published", async () => {
    const store = create();
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
    const store = create();
    for (const id of ["a", "b", "c", "d", "e"]) {
      await store.append(createOutboxTestEntry(id));
    }
    const batch = await store.fetchPendingBatch(2);
    expect(isSuccess(batch)).toBe(true);
    expect(getValue(batch)).toHaveLength(2);
  });
});

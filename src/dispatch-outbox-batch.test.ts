import { describe, expect, it } from "vitest";
import {
  createSimpleError,
  error,
  errorOf,
  isError,
  isSuccess,
  success,
} from "@robotico-dev/result";

import { dispatchOutboxBatch } from "./dispatch-outbox-batch.js";
import { InMemoryOutboxStore } from "./in-memory-outbox-store.js";
import type { IOutboxStore } from "./i-outbox-store.js";
import type { IOutboxTransport } from "./i-outbox-transport.js";
import { createOutboxTestEntry } from "./outbox-test-entry.fixture.js";

describe("dispatchOutboxBatch", () => {
  it("returns Err when fetchPendingBatch fails", async () => {
    const store: IOutboxStore = {
      append: async () => success(),
      fetchPendingBatch: async () =>
        errorOf(createSimpleError("store read failed")),
      markPublished: async () => success(),
    };
    const transport: IOutboxTransport = {
      publish: async () => success(),
    };
    const r = await dispatchOutboxBatch(store, transport, {
      batchSize: 5,
      retry: { maxAttempts: 1, baseDelayMs: 1 },
    });
    expect(isError(r)).toBe(true);
  });

  it("returns Err when transport publish fails after retries", async () => {
    const store = new InMemoryOutboxStore();
    await store.append(createOutboxTestEntry("x"));
    const transport: IOutboxTransport = {
      publish: async () => error(createSimpleError("down")),
    };
    const r = await dispatchOutboxBatch(store, transport, {
      batchSize: 5,
      retry: { maxAttempts: 1, baseDelayMs: 1 },
    });
    expect(isError(r)).toBe(true);
  });

  it("returns Err when markPublished fails mid-batch", async () => {
    const inner = new InMemoryOutboxStore();
    let marks = 0;
    const store: IOutboxStore = {
      append: (e) => inner.append(e),
      fetchPendingBatch: (n) => inner.fetchPendingBatch(n),
      markPublished: async (id) => {
        marks += 1;
        if (marks === 2) {
          return error(createSimpleError("mark failed"));
        }
        return inner.markPublished(id);
      },
    };
    await store.append(createOutboxTestEntry("a"));
    await store.append(createOutboxTestEntry("b"));
    const transport: IOutboxTransport = {
      publish: async () => success(),
    };
    const r = await dispatchOutboxBatch(store, transport, {
      batchSize: 10,
      retry: { maxAttempts: 1, baseDelayMs: 1 },
    });
    expect(isError(r)).toBe(true);
  });

  it("succeeds on empty pending batch", async () => {
    const store = new InMemoryOutboxStore();
    const transport: IOutboxTransport = {
      publish: async () => success(),
    };
    const r = await dispatchOutboxBatch(store, transport, {
      batchSize: 5,
      retry: { maxAttempts: 1, baseDelayMs: 1 },
    });
    expect(isSuccess(r)).toBe(true);
  });

  it("invokes dispatch hooks in order for a successful batch", async () => {
    const store = new InMemoryOutboxStore();
    await store.append(createOutboxTestEntry("h1"));
    const log: string[] = [];
    const transport: IOutboxTransport = {
      publish: async () => success(),
    };
    const r = await dispatchOutboxBatch(store, transport, {
      batchSize: 5,
      retry: { maxAttempts: 1, baseDelayMs: 1 },
      hooks: {
        onBatchFetched: (rows) => {
          log.push(`fetch:${rows.length}`);
        },
        onAfterTransportSuccess: () => {
          log.push("sent");
        },
        onAfterMarkPublished: (id) => {
          log.push(`mark:${id}`);
        },
      },
    });
    expect(isSuccess(r)).toBe(true);
    expect(log).toEqual(["fetch:1", "sent", "mark:h1"]);
  });
});

import { describe, expect, it, vi } from "vitest";
import type { ResultVoid } from "@robotico-dev/result";
import { getValue, isSuccess, success } from "@robotico-dev/result";

import { appendOutboxEntryValidated } from "./append-outbox-entry-validated.js";
import { createOutboxEntryRules } from "./create-outbox-entry-rules.js";
import { dispatchOutboxBatch } from "./dispatch-outbox-batch.js";
import type { IOutboxEntry } from "./i-outbox-entry.js";
import type { IOutboxTransport } from "./i-outbox-transport.js";
import { InMemoryOutboxStore } from "./in-memory-outbox-store.js";

describe("outbox validated append and dispatch", () => {
  it("rejects invalid entries before append", async () => {
    const store = new InMemoryOutboxStore();
    const rules = createOutboxEntryRules();
    const badId = await appendOutboxEntryValidated(store, rules, {
      id: " ",
      topic: "ok",
      payload: null,
      headers: {},
      createdAt: new Date(),
    });
    expect(isSuccess(badId)).toBe(false);

    const badTopic = await appendOutboxEntryValidated(store, rules, {
      id: "ok",
      topic: "",
      payload: null,
      headers: {},
      createdAt: new Date(),
    });
    expect(isSuccess(badTopic)).toBe(false);
  });

  it("dispatches pending rows with retry wrapper", async () => {
    const store = new InMemoryOutboxStore();
    const rules = createOutboxEntryRules();
    const entry = {
      id: "m1",
      topic: "orders",
      payload: { k: 1 },
      headers: {},
      createdAt: new Date(),
    };
    expect(
      isSuccess(await appendOutboxEntryValidated(store, rules, entry))
    ).toBe(true);

    const publishSpy = vi.fn(
      async (_e: IOutboxEntry): Promise<ResultVoid> => success()
    );
    const transport: IOutboxTransport = {
      publish: (e) => publishSpy(e),
    };
    const done = await dispatchOutboxBatch(store, transport, {
      batchSize: 10,
      retry: { maxAttempts: 2, baseDelayMs: 1 },
    });
    expect(isSuccess(done)).toBe(true);
    expect(publishSpy).toHaveBeenCalledTimes(1);

    const pending = await store.fetchPendingBatch(10);
    expect(isSuccess(pending)).toBe(true);
    expect(getValue(pending)).toHaveLength(0);
  });

  it("preserves idempotencyKey on store rows and through dispatch to transport", async () => {
    const store = new InMemoryOutboxStore();
    const rules = createOutboxEntryRules();
    const entry: IOutboxEntry = {
      id: "idem-1",
      topic: "orders",
      payload: { k: 1 },
      headers: {},
      createdAt: new Date(),
      idempotencyKey: "pay-42",
    };
    expect(
      isSuccess(await appendOutboxEntryValidated(store, rules, entry))
    ).toBe(true);

    const pendingBefore = await store.fetchPendingBatch(10);
    expect(isSuccess(pendingBefore)).toBe(true);
    expect(getValue(pendingBefore)[0]?.idempotencyKey).toBe("pay-42");

    let published: IOutboxEntry | undefined;
    const transport: IOutboxTransport = {
      publish: (e) => {
        published = e;
        return Promise.resolve(success());
      },
    };

    const done = await dispatchOutboxBatch(store, transport, {
      batchSize: 10,
      retry: { maxAttempts: 2, baseDelayMs: 1 },
    });
    expect(isSuccess(done)).toBe(true);
    expect(published?.idempotencyKey).toBe("pay-42");
  });
});

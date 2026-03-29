import { describe, expect, it } from "vitest";
import type { ValidationError } from "@robotico-dev/result";
import { isError, isSuccess } from "@robotico-dev/result";

import { appendOutboxEntryValidated } from "./append-outbox-entry-validated.js";
import { createOutboxEntryRules } from "./create-outbox-entry-rules.js";
import { InMemoryOutboxStore } from "./in-memory-outbox-store.js";

describe("appendOutboxEntryValidated", () => {
  it("maps validation failures to field-keyed ValidationError", async () => {
    const store = new InMemoryOutboxStore();
    const rules = createOutboxEntryRules();
    const r = await appendOutboxEntryValidated(store, rules, {
      id: " ",
      topic: "ok",
      payload: null,
      headers: {},
      createdAt: new Date(),
    });
    expect(isError(r)).toBe(true);
    if (isError(r) && "errors" in r.error) {
      const ve = r.error as ValidationError;
      expect(ve.errors.id?.[0]).toBe("must be non-empty");
    }
  });

  it("appends when rules pass", async () => {
    const store = new InMemoryOutboxStore();
    const rules = createOutboxEntryRules();
    const r = await appendOutboxEntryValidated(store, rules, {
      id: "ok",
      topic: "orders",
      payload: {},
      headers: {},
      createdAt: new Date(),
    });
    expect(isSuccess(r)).toBe(true);
  });
});

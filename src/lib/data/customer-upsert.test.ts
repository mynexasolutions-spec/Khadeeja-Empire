import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createLocalProvider } from "./local-provider";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))
  );
});

describe("customer phone upsert", () => {
  it("serializes repeated phone upserts into one local customer", async () => {
    const directory = await mkdtemp(join(tmpdir(), "khadeeja-customer-upsert-"));
    temporaryDirectories.push(directory);
    const provider = createLocalProvider({ filePath: join(directory, "admin.json") });
    const phone = "+919876543210";

    const customers = await Promise.all([
      provider.upsertCustomerByPhone(phone, { status: "active" }),
      provider.upsertCustomerByPhone(phone, { status: "active" }),
      provider.upsertCustomerByPhone(phone, { status: "active" }),
    ]);

    expect(new Set(customers.map((customer) => customer.id)).size).toBe(1);
    await expect(provider.listCustomers({ search: phone })).resolves.toHaveLength(1);
  });
});

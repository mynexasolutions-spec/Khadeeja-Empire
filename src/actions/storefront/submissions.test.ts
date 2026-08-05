// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDataProviderMock } = vi.hoisted(() => ({ getDataProviderMock: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("../../lib/data", () => ({ getDataProvider: getDataProviderMock }));

import { submitInquiry, subscribeToNewsletter } from "./submissions";

describe("storefront submissions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("normalizes and creates a newsletter subscriber", async () => {
    const createSubscriber = vi.fn();
    getDataProviderMock.mockReturnValue({
      listSubscribers: vi.fn().mockResolvedValue([]),
      createSubscriber,
    });

    await expect(subscribeToNewsletter({ email: "  PERSON@Example.COM " })).resolves.toMatchObject({
      ok: true,
    });
    expect(createSubscriber).toHaveBeenCalledWith({
      email: "person@example.com",
      name: null,
      source: "storefront",
    });
  });

  it("treats an existing exact email as an idempotent subscription", async () => {
    getDataProviderMock.mockReturnValue({
      listSubscribers: vi.fn().mockResolvedValue([{ id: "subscriber-1", email: "person@example.com" }]),
      createSubscriber: vi.fn(),
    });

    await expect(subscribeToNewsletter({ email: "person@example.com" })).resolves.toMatchObject({
      ok: true,
      alreadyExists: true,
    });
  });

  it("validates and stores inquiries as unread", async () => {
    const createInquiry = vi.fn();
    getDataProviderMock.mockReturnValue({ createInquiry });

    await expect(
      submitInquiry({
        name: "Demo Person",
        email: "demo@example.com",
        message: "Please tell me more about this collection.",
      })
    ).resolves.toMatchObject({ ok: true });
    expect(createInquiry).toHaveBeenCalledWith(
      expect.objectContaining({ status: "unread", subject: null, phone: null })
    );
  });
});

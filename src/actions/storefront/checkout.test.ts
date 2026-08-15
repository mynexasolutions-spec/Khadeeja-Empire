// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../../lib/auth/errors";

const { requireCustomerMock, getDataProviderMock } = vi.hoisted(() => ({
  requireCustomerMock: vi.fn(),
  getDataProviderMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("../../lib/auth/server", () => ({ requireCustomer: requireCustomerMock }));
vi.mock("../../lib/data", () => ({ getDataProvider: getDataProviderMock }));

import { placeDemoOrder, previewCouponAction } from "./checkout";

const input = {
  idempotencyKey: "checkout_attempt_123",
  items: [{ productId: "product-1", quantity: 1, size: "M" }],
  customer: { name: "Demo Customer", email: "demo@example.com" },
  shippingAddress: {
    line1: "1 Demo Road",
    city: "Varanasi",
    state: "Uttar Pradesh",
    postalCode: "221001",
    country: "IN",
  },
};

describe("placeDemoOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireCustomerMock.mockResolvedValue({ customerId: "customer-1", phone: "+919876543210" });
  });

  it("requires a signed customer session", async () => {
    requireCustomerMock.mockRejectedValue(new UnauthorizedError());

    await expect(placeDemoOrder(input)).resolves.toMatchObject({
      ok: false,
      code: "UNAUTHENTICATED",
    });
    expect(getDataProviderMock).not.toHaveBeenCalled();
  });

  it("creates a confirmed, mock-paid order from server-side records", async () => {
    const createOrder = vi.fn(async (order) => ({
      ...order,
      id: "order-1",
      orderNumber: order.orderNumber,
    }));
    const data = {
      getOrder: vi.fn().mockResolvedValue(null),
      getCustomer: vi.fn().mockResolvedValue({ id: "customer-1", phone: "+919876543210" }),
      updateCustomer: vi.fn().mockResolvedValue({ id: "customer-1" }),
      getProduct: vi.fn().mockResolvedValue({
        id: "product-1",
        slug: "demo-product",
        name: "Demo Product",
        price: 750,
        currency: "INR",
        active: true,
        availability: "in-stock",
        sizes: ["M"],
      }),
      listCoupons: vi.fn().mockResolvedValue([]),
      listShippingRates: vi.fn().mockResolvedValue([
        { id: "standard", name: "Standard", amount: 99, active: true },
      ]),
      createOrder,
    };
    getDataProviderMock.mockReturnValue(data);

    const result = await placeDemoOrder(input);

    expect(result).toMatchObject({ ok: true, replayed: false, order: { total: 849 } });
    expect(createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "customer-1",
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "mock_demo_payment",
        subtotal: 750,
        shipping: 99,
        total: 849,
      })
    );
  });

  it("returns the existing customer order for an idempotent replay", async () => {
    getDataProviderMock.mockReturnValue({
      getOrder: vi.fn().mockResolvedValue({
        id: "order-existing",
        orderNumber: "KE-DEMO-EXISTING",
        customerId: "customer-1",
        subtotal: 10,
        shipping: 0,
        discount: 0,
        total: 10,
        status: "confirmed",
        paymentStatus: "paid",
      }),
    });

    await expect(placeDemoOrder(input)).resolves.toMatchObject({ ok: true, replayed: true });
  });

  it("applies a valid coupon and increments its used count", async () => {
    const createOrder = vi.fn(async (order) => ({
      ...order,
      id: "order-coupon",
      orderNumber: order.orderNumber,
    }));
    const incrementCouponUse = vi.fn().mockResolvedValue({ id: "coupon-1", usedCount: 1 });
    const data = {
      getOrder: vi.fn().mockResolvedValue(null),
      getCustomer: vi.fn().mockResolvedValue({ id: "customer-1", phone: "+919876543210" }),
      updateCustomer: vi.fn().mockResolvedValue({ id: "customer-1" }),
      getProduct: vi.fn().mockResolvedValue({
        id: "product-1",
        slug: "demo-product",
        name: "Demo Product",
        price: 1000,
        currency: "INR",
        active: true,
        availability: "in-stock",
        sizes: ["M"],
      }),
      listCoupons: vi.fn().mockResolvedValue([
        {
          id: "coupon-1",
          code: "SAVE10",
          discountType: "percentage",
          discountValue: 10,
          active: true,
          usedCount: 0,
          maximumUses: 2,
        },
      ]),
      listShippingRates: vi.fn().mockResolvedValue([
        { id: "standard", name: "Standard", amount: 99, active: true },
      ]),
      createOrder,
      incrementCouponUse,
    };
    getDataProviderMock.mockReturnValue(data);

    const result = await placeDemoOrder({ ...input, couponCode: "save10" });

    expect(result).toMatchObject({ ok: true, replayed: false, order: { total: 999 } });
    expect(incrementCouponUse).toHaveBeenCalledWith("coupon-1");
  });
});

describe("previewCouponAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("previews a valid coupon discount", async () => {
    getDataProviderMock.mockReturnValue({
      listCoupons: vi.fn().mockResolvedValue([
        {
          id: "coupon-1",
          code: "SAVE10",
          discountType: "percentage",
          discountValue: 10,
          active: true,
          usedCount: 0,
        },
      ]),
    });

    await expect(previewCouponAction("SAVE10", 1000)).resolves.toEqual({
      valid: true,
      code: "SAVE10",
      discount: 100,
    });
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

const product = {
  id: "product-1",
  slug: "embroidered-kurti",
  name: "Embroidered Kurti",
  category: "short-kurtis",
  collection: "short-kurtis",
  description: "",
  images: ["/front.jpg", "/back.jpg"],
  video: "/product-video.mp4",
  hoverImage: "/legacy-hover.jpg",
  price: 3200,
  currency: "INR",
  priceStatus: "confirmed",
  sizes: ["S", "M"],
  tags: [],
  availability: "in-stock",
  sourcePostId: "",
  sourceUrl: "",
  isPrototypeData: false,
} satisfies Product;

describe("ProductCard", () => {
  it("uses the second product image for the hover swap", () => {
    const { container } = render(<ProductCard product={product} />);
    const images = container.querySelectorAll("img");

    expect(images).toHaveLength(2);
    expect(images[0].getAttribute("src")).toContain("front.jpg");
    expect(images[0].className).toContain("group-hover:opacity-0");
    expect(images[1].getAttribute("src")).toContain("back.jpg");
    expect(images[1].className).toContain("group-hover:opacity-100");
    expect(container.innerHTML).not.toContain("product-video.mp4");
    expect(container.innerHTML).not.toContain("legacy-hover.jpg");
  });

  it("renders no hover layer when the product has only one image", () => {
    const { container } = render(
      <ProductCard product={{ ...product, images: ["/front.jpg"] }} />
    );
    const images = container.querySelectorAll("img");

    expect(images).toHaveLength(1);
    expect(images[0].className).not.toContain("group-hover:opacity-0");
  });
});

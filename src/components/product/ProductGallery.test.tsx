import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductGallery } from "./ProductGallery";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} {...props} />
  ),
}));

describe("ProductGallery", () => {
  it("switches images when clicking a thumbnail", () => {
    const { getAllByLabelText, getAllByAltText } = render(
      <ProductGallery images={["/front.jpg", "/back.jpg"]} productName="Silk kurti" />
    );

    const thumbs = getAllByLabelText("Show image 2 of 2");
    fireEvent.click(thumbs[0]);

    const mainImage = getAllByAltText("Silk kurti, view 2")[0];
    expect(mainImage).toBeDefined();
  });

  it("supports touch swipe on mobile gallery", () => {
    const { container } = render(
      <ProductGallery images={["/front.jpg", "/back.jpg"]} productName="Silk kurti" />
    );

    const swipeTrack = container.querySelector('.md\\:hidden > div:first-child > div[style]') as HTMLElement;
    expect(swipeTrack).toBeDefined();

    fireEvent.touchStart(swipeTrack, { touches: [{ clientX: 120 }] });
    fireEvent.touchEnd(swipeTrack, { changedTouches: [{ clientX: 30 }] });

    expect(swipeTrack.style.transform).toBe("translateX(-100%)");
  });

  it("renders wishlist button", () => {
    const { getAllByLabelText } = render(
      <ProductGallery images={["/front.jpg"]} productName="Silk kurti" />
    );
    const wishlistBtn = getAllByLabelText("Add to wishlist")[0];
    expect(wishlistBtn).toBeDefined();
    expect(wishlistBtn.getAttribute("aria-pressed")).toBe("false");
  });

  it("does not render thumbnails for a single image", () => {
    const { container } = render(
      <ProductGallery images={["/front.jpg"]} productName="Silk kurti" />
    );
    const thumbStrip = container.querySelector('[aria-label="Choose product image"]');
    expect(thumbStrip).toBeNull();
  });

  it("adds the product video as an extra slide alongside the images", () => {
    const { getAllByLabelText, container } = render(
      <ProductGallery images={["/front.jpg", "/back.jpg"]} video="/clip.mp4" productName="Silk kurti" />
    );

    const videoThumb = getAllByLabelText("Show product video")[0];
    expect(videoThumb).toBeDefined();

    fireEvent.click(videoThumb);
    const mainVideo = container.querySelector("video[src='/clip.mp4']");
    expect(mainVideo).not.toBeNull();
  });
});

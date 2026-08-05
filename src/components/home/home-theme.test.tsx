import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeTheme } from "./HomeTheme";
import { CraftMark } from "../ui/CraftMark";

describe("HomeTheme", () => {
  it("scopes homepage content to the Sun-Dyed Atelier theme", () => {
    render(
      <HomeTheme>
        <p>Homepage content</p>
      </HomeTheme>
    );

    const theme = screen.getByTestId("home-theme");

    expect(theme.className.split(" ")).toContain("home-theme");
    expect(theme.getAttribute("data-theme")).toBe("sun-dyed-atelier");
    expect(theme.textContent).toContain("Homepage content");
  });

  it("renders the craft mark as decorative artwork", () => {
    const { container } = render(<CraftMark tone="turmeric" />);

    const mark = container.querySelector("svg");

    expect(mark).not.toBeNull();
    expect(mark?.getAttribute("aria-hidden")).toBe("true");
    expect(mark?.getAttribute("data-tone")).toBe("turmeric");
  });
});

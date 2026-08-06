import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ManagedCollection, type ServerFormAction } from "./ManagedCollection";

const action = vi.fn() as unknown as ServerFormAction;
const fields = [{ name: "title", label: "Title", required: true }] as const;

describe("ManagedCollection", () => {
  it("exposes a specific create control and semantic record list", () => {
    render(
      <ManagedCollection
        records={[{ id: "slide-1", title: "Summer edit", active: true }]}
        fields={[...fields]}
        saveAction={action}
        deleteAction={action}
        emptyTitle="No hero slides"
        createLabel="Add hero slide"
        summary={(record) => ({ title: String(record.title), status: Boolean(record.active) })}
      />,
    );

    expect(screen.getByRole("button", { name: "Add hero slide" })).toBeTruthy();
    const list = screen.getByRole("list", { name: "hero slide list" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(within(list).getByRole("button", { name: "Update Summer edit" })).toBeTruthy();
    expect(within(list).getByRole("button", { name: "Delete Summer edit" })).toBeTruthy();
  });

  it("renders its empty state when no records exist", () => {
    render(
      <ManagedCollection
        records={[]}
        fields={[...fields]}
        saveAction={action}
        deleteAction={action}
        emptyTitle="No announcements"
        createLabel="Add announcement"
        summary={(record) => ({ title: String(record.title) })}
      />,
    );

    expect(screen.getByRole("button", { name: "Add announcement" })).toBeTruthy();
    expect(screen.getByText("No announcements")).toBeTruthy();
  });
});

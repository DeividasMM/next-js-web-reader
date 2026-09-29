// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Card from "@/app/card";

describe("<Card />", () => {
  const props = {
    id: 12,
    title: "Meditations",
    author: "Marcus Aurelius",
    genre: "philosophy",
  };

  it("shows the book details and links to the reader", () => {
    render(<Card {...props} onDelete={() => {}} />);

    expect(screen.getByRole("heading", { name: "Meditations" })).toBeVisible();
    expect(screen.getByText("Marcus Aurelius")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Start to read!" })
    ).toHaveAttribute("href", "/library/12/reading");
  });

  it("calls onDelete with the book id", () => {
    const onDelete = vi.fn();
    render(<Card {...props} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onDelete).toHaveBeenCalledWith(12);
  });
});

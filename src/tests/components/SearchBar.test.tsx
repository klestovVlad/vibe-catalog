import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";
import { vi } from "vitest";

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    render(<SearchBar value="" onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument();
  });

  it("calls onSearch with debounced value", async () => {
    render(<SearchBar value="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith("test");
      },
      { timeout: 350 }
    );
  });

  it("calls onSearch immediately on form submit", () => {
    render(<SearchBar value="" onSearch={mockOnSearch} />);

    const form = screen.getByRole("form", { name: /search form/i });
    const input = screen.getByPlaceholderText("Search products...");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("shows clear button when input has value", () => {
    render(<SearchBar value="test" onSearch={mockOnSearch} />);

    expect(
      screen.getByRole("button", { name: /clear search/i })
    ).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", () => {
    render(<SearchBar value="test" onSearch={mockOnSearch} />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});

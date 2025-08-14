import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { vi } from "vitest";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    // Change value
    rerender({ value: "changed", delay: 300 });

    // Value should not change immediately
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now value should be updated
    expect(result.current).toBe("changed");
  });

  it("uses default delay of 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "changed" });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("changed");
  });

  it("cancels previous timer on new value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Change value multiple times quickly
    rerender({ value: "first" });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    rerender({ value: "second" });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should still be initial value
    expect(result.current).toBe("initial");

    // Wait for full delay
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should now be 'second'
    expect(result.current).toBe("second");
  });
});

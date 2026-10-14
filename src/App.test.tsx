import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

const TAB_LABELS = ["Home", "Varieties", "Growing", "Nutrition", "Recipes", "Safety"];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("App shell", () => {
  it("renders the header, six tabs and six empty tab panels with only Home visible", () => {
    const { container } = render(<App />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Microgreens");
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual(TAB_LABELS);

    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels).toHaveLength(6);
    panels.forEach((panel) => {
      expect(panel.textContent).toBe("");
    });

    expect(screen.getByRole("tabpanel").id).toBe("panel-home");
  });

  it("links each tab to its panel and shows the panel of the selected tab", () => {
    render(<App />);

    for (const label of TAB_LABELS) {
      const id = label.toLowerCase();
      const tab = screen.getByRole("tab", { name: label });
      expect(tab.id).toBe(`tab-${id}`);
      expect(tab.getAttribute("aria-controls")).toBe(`panel-${id}`);
      expect(document.getElementById(`panel-${id}`)?.getAttribute("aria-labelledby")).toBe(
        `tab-${id}`,
      );
    }

    fireEvent.click(screen.getByRole("tab", { name: "Recipes" }));

    expect(screen.getByRole("tabpanel").id).toBe("panel-recipes");
  });

  it("does not reload the page or make a network request when switching tabs", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const xhrOpenSpy = vi.spyOn(XMLHttpRequest.prototype, "open");
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    const hrefBefore = window.location.href;
    const historyLengthBefore = window.history.length;

    render(<App />);
    for (const label of TAB_LABELS) {
      fireEvent.click(screen.getByRole("tab", { name: label }));
    }

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrOpenSpy).not.toHaveBeenCalled();
    expect(pushStateSpy).not.toHaveBeenCalled();
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(window.location.href).toBe(hrefBefore);
    expect(window.history.length).toBe(historyLengthBefore);
  });

  it("shows no login, registration or category content and no form controls", () => {
    const { container } = render(<App />);

    expect(container.textContent).not.toMatch(/log\s?in|sign\s?in|sign\s?up|register|categor/i);
    expect(container.querySelector("input, select, textarea, form")).toBeNull();
  });
});

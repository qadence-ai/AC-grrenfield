import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TabBar } from "../components/TabBar";
import { TabsProvider } from "./TabsContext";

function renderTabBar() {
  return render(
    <TabsProvider>
      <TabBar />
    </TabsProvider>,
  );
}

function selectedLabels(): string[] {
  return screen
    .getAllByRole("tab")
    .filter((tab) => tab.getAttribute("aria-selected") === "true")
    .map((tab) => tab.textContent ?? "");
}

describe("TabBar", () => {
  it("shows the six tabs in order with only Home selected at first", () => {
    renderTabBar();

    const labels = screen.getAllByRole("tab").map((tab) => tab.textContent);
    expect(labels).toEqual([
      "Home",
      "Varieties",
      "Growing",
      "Nutrition",
      "Recipes",
      "Safety",
    ]);
    expect(selectedLabels()).toEqual(["Home"]);
  });

  it("selects only the clicked tab", () => {
    renderTabBar();

    fireEvent.click(screen.getByRole("tab", { name: "Nutrition" }));

    expect(selectedLabels()).toEqual(["Nutrition"]);
  });

  it("moves to the next tab with ArrowRight and wraps from Safety to Home", () => {
    renderTabBar();
    const home = screen.getByRole("tab", { name: "Home" });
    home.focus();

    fireEvent.keyDown(home, { key: "ArrowRight" });
    expect(selectedLabels()).toEqual(["Varieties"]);
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Varieties" }));

    fireEvent.keyDown(screen.getByRole("tab", { name: "Varieties" }), {
      key: "End",
    });
    expect(selectedLabels()).toEqual(["Safety"]);

    fireEvent.keyDown(screen.getByRole("tab", { name: "Safety" }), {
      key: "ArrowRight",
    });
    expect(selectedLabels()).toEqual(["Home"]);
    expect(document.activeElement).toBe(home);
  });

  it("moves to the previous tab with ArrowLeft and wraps from Home to Safety", () => {
    renderTabBar();
    const home = screen.getByRole("tab", { name: "Home" });
    home.focus();

    fireEvent.keyDown(home, { key: "ArrowLeft" });

    expect(selectedLabels()).toEqual(["Safety"]);
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Safety" }));
  });

  it("jumps to the first tab with Home and the last tab with End", () => {
    renderTabBar();

    fireEvent.click(screen.getByRole("tab", { name: "Growing" }));
    fireEvent.keyDown(screen.getByRole("tab", { name: "Growing" }), {
      key: "End",
    });
    expect(selectedLabels()).toEqual(["Safety"]);

    const home = screen.getByRole("tab", { name: "Home" });
    fireEvent.keyDown(screen.getByRole("tab", { name: "Safety" }), {
      key: "Home",
    });
    expect(selectedLabels()).toEqual(["Home"]);
    expect(document.activeElement).toBe(home);
  });

  it("keeps only the active tab in the tab sequence", () => {
    renderTabBar();

    fireEvent.click(screen.getByRole("tab", { name: "Recipes" }));

    const tabStops = screen
      .getAllByRole("tab")
      .map((tab) => [tab.textContent, tab.tabIndex]);
    expect(tabStops).toEqual([
      ["Home", -1],
      ["Varieties", -1],
      ["Growing", -1],
      ["Nutrition", -1],
      ["Recipes", 0],
      ["Safety", -1],
    ]);
  });

  it("labels the tablist and points each tab at its panel", () => {
    renderTabBar();

    expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Sections");
    expect(screen.getByRole("tab", { name: "Growing" }).getAttribute("aria-controls")).toBe(
      "panel-growing",
    );
  });
});

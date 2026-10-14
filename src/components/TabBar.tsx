import type { KeyboardEvent } from "react";
import { TABS } from "../tabs/tabs";
import { useTabs } from "../tabs/TabsContext";

export function TabBar() {
  const { activeTab, setActiveTab } = useTabs();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const tabButtons = event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    );
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % TABS.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const next = TABS[nextIndex];
    setActiveTab(next.id);
    tabButtons[nextIndex]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Sections"
      className="tab-bar"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab) => {
        const selected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className={selected ? "tab is-active" : "tab"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

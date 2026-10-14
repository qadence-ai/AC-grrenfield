import { TABS } from "../tabs/tabs";
import { useTabs } from "../tabs/TabsContext";

export function TabPanels() {
  const { activeTab } = useTabs();

  return (
    <>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeTab}
        />
      ))}
    </>
  );
}

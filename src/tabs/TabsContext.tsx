import { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_TAB_ID, type TabId } from "./tabs";

interface TabsState {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

const TabsContext = createContext<TabsState | null>(null);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB_ID);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs(): TabsState {
  const state = useContext(TabsContext);
  if (state === null) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return state;
}

import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { TabPanels } from "./components/TabPanels";
import { TabsProvider } from "./tabs/TabsContext";

export function App() {
  return (
    <TabsProvider>
      <div className="app">
        <Header />
        <main>
          <TabBar />
          <TabPanels />
        </main>
      </div>
    </TabsProvider>
  );
}

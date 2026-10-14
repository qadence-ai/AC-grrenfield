export type TabId =
  | "home"
  | "varieties"
  | "growing"
  | "nutrition"
  | "recipes"
  | "safety";

export interface TabDefinition {
  id: TabId;
  label: string;
}

export const TABS: readonly TabDefinition[] = [
  { id: "home", label: "Home" },
  { id: "varieties", label: "Varieties" },
  { id: "growing", label: "Growing" },
  { id: "nutrition", label: "Nutrition" },
  { id: "recipes", label: "Recipes" },
  { id: "safety", label: "Safety" },
];

export const DEFAULT_TAB_ID: TabId = "home";

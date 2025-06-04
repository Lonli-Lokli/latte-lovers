// Tab Configuration
export const tabs = {
  score: {
    id: "score",
    label: "Score",
    icon: "⭐",
    enabled: true,
    default: true,
  },
  leaders: {
    id: "leaders",
    label: "Leaders",
    icon: "🏆",
    enabled: true,
    default: false,
  },
  analyze: {
    id: "analyze",
    label: "Analyze",
    icon: "👨‍💻",
    enabled: true,
    default: false,
  },
  map: {
    id: "map",
    label: "Map",
    icon: "🌐",
    enabled: true,
    default: false,
  },
  // Add new tabs here
};

// Get all enabled tabs
export const getEnabledTabs = () => {
  return Object.values(tabs).filter((tab) => tab.enabled);
};

// Get default tab
export const getDefaultTab = () => {
  return (
    Object.values(tabs).find((tab) => tab.default)?.id || tabs[0]?.id || "score"
  );
};

// Validate if a tab exists and is enabled
export const isValidTab = (tabId) => {
  return tabs[tabId]?.enabled || false;
};

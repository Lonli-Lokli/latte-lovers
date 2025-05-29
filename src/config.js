// Tab Configuration
export const tabs = {
  checker: {
    id: 'checker',
    label: 'Coffee Checker',
    icon: '🔍',
    enabled: true,
    default: true
  },
  top: {
    id: 'top',
    label: 'Leaders',
    icon: '🏆',
    enabled: true,
    default: false
  },
  formula: {
    id: 'formula',
    label: 'Formula',
    icon: '📊',
    enabled: true,
    default: false
  }
  // Add new tabs here
};

// Get all enabled tabs
export const getEnabledTabs = () => {
  return Object.values(tabs).filter(tab => tab.enabled);
};

// Get default tab
export const getDefaultTab = () => {
  return Object.values(tabs).find(tab => tab.default)?.id || 'checker';
};

// Validate if a tab exists and is enabled
export const isValidTab = (tabId) => {
  return tabs[tabId]?.enabled || false;
}; 
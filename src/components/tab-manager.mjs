
export class TabManager {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
  }

  async loadTabModule(tabName) {
    // Return cached module if already loaded
    if (this.loadedModules.has(tabName)) {
      return this.loadedModules.get(tabName);
    }

    // Return existing loading promise if already loading
    if (this.loadingPromises.has(tabName)) {
      return this.loadingPromises.get(tabName);
    }

    // Create loading promise
    const loadingPromise = this.loadModule(tabName);
    this.loadingPromises.set(tabName, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedModules.set(tabName, module);
      this.loadingPromises.delete(tabName);
      return module;
    } catch (error) {
      this.loadingPromises.delete(tabName);
      throw error;
    }
  }

  async loadModule(tabName) {
    const moduleMap = {
      score: () => import('../js/score.mjs'),
      leaders: () => import('../js/leaders.mjs'),
      analyze: () => import('../js/analyze.mjs'),
      map: () => import('../js/map.mjs'),
    };

    if (!moduleMap[tabName]) {
      throw new Error(`No module found for tab: ${tabName}`);
    }

    return await moduleMap[tabName]();
  }

  async initializeTab(tabName) {
    try {
      const module = await this.loadTabModule(tabName);

      // Call the appropriate initialization function
      const initFunctionMap = {
        score: module.initializeScoreTab,
        leaders: module.initializeLeadersTab,
        analyze: module.initializeAnalyzeTab,
        map: module.initializeMapTab,
      };

      const initFunction = initFunctionMap[tabName];
      if (initFunction && typeof initFunction === 'function') {
        await initFunction();
      } else {
        console.warn(`No initialization function found for tab: ${tabName}`);
      }
    } catch (error) {
      console.error(`Failed to initialize tab ${tabName}:`, error);
      throw error;
    }
  }
}
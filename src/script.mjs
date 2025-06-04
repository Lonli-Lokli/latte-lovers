export function openContactModal() {
  document.getElementById("contactModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

export function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
  document.body.style.overflow = "auto";
}

export function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("themeIcon");

  body.classList.toggle("light-theme");

  const isLightTheme = body.classList.contains("light-theme");

  if (isLightTheme) {
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
}

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
      score: () => import('./js/score.mjs'),
      leaders: () => import('./js/leaders.mjs'),
      analyze: () => import('./js/analyze.mjs'),
      map: () => import('./js/map.mjs')
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
        map: module.initializeMapTab
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
// Event Listeners
window.addEventListener("load", function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    document.getElementById("themeIcon").textContent = "🌙";
  }
});

window.addEventListener("click", function (event) {
  const modal = document.getElementById("contactModal");
  if (event.target === modal) {
    closeContactModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners
  document
    .querySelector(".theme-toggle")
    .addEventListener("click", toggleTheme);

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("contactModal");
    if (event.target === modal) {
      closeContactModal();
    }
  });
});

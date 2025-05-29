


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
  const isDarkMode = !isLightTheme;

  if (isLightTheme) {
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }

  // Dynamically update multi-select theme
  if (msCountryInstance) {
    msCountryInstance.refreshOptions({ darkMode: isDarkMode });
  }
  if (msProcessingInstance) {
    msProcessingInstance.refreshOptions({ darkMode: isDarkMode });
  }
  if (msRoastInstance) {
    msRoastInstance.refreshOptions({ darkMode: isDarkMode });
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

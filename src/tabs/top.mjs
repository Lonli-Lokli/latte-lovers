import { multipleSelect } from "multiple-select-vanilla";


import {
  coffeeProfiles,
  processingMethods,
  roastLevelEffects,
  applyFullProcessingEffects,
  applyRoastEffects,
  calculateLatteScore,
  normalizeScore,
  getCompatibilityGrade
} from "../scoring.mjs";

export function initializeTopTab() {
  // Initialize filters and populate table via filters
  initializeLeadersFilters(
    coffeeProfiles,
    processingMethods,
    roastLevelEffects
  );
}

// Variables to store multiple select instances
let msCountryInstance = null;
let msProcessingInstance = null;
let msRoastInstance = null;

// Function to initialize leaders table and filters using multiple-select-vanilla
export function initializeLeadersFilters(
  coffeeProfiles,
  processingMethods,
  roastLevelEffects
) {
  const countryFilter = document.getElementById("countryFilterSelect");
  const processingFilter = document.getElementById("processingFilterSelect");
  const roastFilter = document.getElementById("roastFilterSelect");
  const tableBody = document.querySelector(".leaders-table .table-body");
  const allLeaders = generateAndRankLeaders(
    coffeeProfiles,
    processingMethods,
    roastLevelEffects
  ); // Generate all leaders once

  // Populate select options
  function populateSelectOptions(selectElement, data, sort, textKey) {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = "";

    // Convert to array and sort if needed
    const entries = Object.entries(data);
    if (sort) {
      entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    }

    for (const [key, itemData] of entries) {
      const option = document.createElement("option");
      const optionText = textKey
        ? itemData[textKey]
        : key
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "); // Capitalize key if no textKey

      option.value = key; // Use the key (e.g., 'brazil', 'washed') as the option value
      option.textContent = optionText;
      option.selected = true; // Auto-select this option
      selectElement.appendChild(option);
    }
  }

  // Populate options for each filter
  populateSelectOptions(countryFilter, coffeeProfiles, true, null);
  populateSelectOptions(
    processingFilter,
    processingMethods,
    false,
    "displayName"
  );
  populateSelectOptions(roastFilter, roastLevelEffects, false, null);

  const options = (name) => ({
    minimumCountSelected: 0,
    autoAdjustDropHeight: true,
    autoAdjustDropWidthByTextSize: true,
    allSelectedText: name,
    countSelectedText: name,
    darkMode: !document.body.classList.contains("light-theme"),
  });
  msCountryInstance = multipleSelect(
    ".multiple-select.country",
    options("Country")
  );
  msProcessingInstance = multipleSelect(
    ".multiple-select.process",
    options("Process")
  );
  msRoastInstance = multipleSelect(".multiple-select.roast", options("Roast"));
  // Function to apply filters and update the table
  function applyFilters() {
    // Get selected values directly from native selects
    const selectedCountries = countryFilter
      ? Array.from(countryFilter.selectedOptions).map((option) => option.value)
      : Object.keys(coffeeProfiles);
    const selectedProcessings = processingFilter
      ? Array.from(processingFilter.selectedOptions).map(
          (option) => option.value
        )
      : Object.keys(processingMethods);
    const selectedRoasts = roastFilter
      ? Array.from(roastFilter.selectedOptions).map((option) => option.value)
      : Object.keys(roastLevelEffects);

    const filteredLeaders = allLeaders.filter((leader) => {
      const leaderCountryKey = leader.country.toLowerCase().replace(/ /g, "-");
      const leaderProcessingEntry = Object.entries(processingMethods).find(
        ([key, method]) => method.abbreviation === leader.processingAbbreviation
      );
      const leaderProcessingKey = leaderProcessingEntry
        ? leaderProcessingEntry[0]
        : null;
      const leaderRoastKey = leader.roast.toLowerCase();

      const countryMatch = selectedCountries.includes(leaderCountryKey);
      const processingMatch = selectedProcessings.includes(leaderProcessingKey);
      const roastMatch = selectedRoasts.includes(leaderRoastKey);

      return countryMatch && processingMatch && roastMatch;
    });

    // Update table with filtered leaders
    if (tableBody) {
      tableBody.innerHTML = ""; // Clear existing content
      const topLeaders = filteredLeaders.slice(0, 10); // Display top 10 of filtered

      if (topLeaders.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="5" style="text-align: center;">No results found for the selected filters.</td></tr>';
        return;
      }

      topLeaders.forEach((leader, index) => {
        const tableRow = document.createElement("tr");
        tableRow.classList.add("table-row");
        tableRow.innerHTML = `
                    <td class="table-cell table-rank">${index + 1}</td>
                    <td class="table-cell">${leader.country}</td>
                     <td class="table-cell" data-processing="${
                       Object.entries(processingMethods).find(
                         ([_, method]) =>
                           method.abbreviation === leader.processingAbbreviation
                       )?.[0]
                     }">
                      <span class="processing-abbreviation-mobile">${
                        leader.processingAbbreviation
                      }</span>
                      <span class="processing-fullname-desktop">${
                        leader.processingDisplayName
                      }</span>
                    </td>
                    <td class="table-cell">${leader.roast}</td>
                    <td class="table-cell table-score ${leader.grade}">${
          leader.score
        }/10</td>
                `;
        tableBody.appendChild(tableRow);
      });
    }
    initializeTooltips(); // Re-initialize tooltips for new table rows
  }

  // Add event listeners to native select change event
  if (countryFilter) {
    countryFilter.addEventListener("change", applyFilters);
  }
  if (processingFilter) {
    processingFilter.addEventListener("change", applyFilters);
  }
  if (roastFilter) {
    roastFilter.addEventListener("change", applyFilters);
  }

  // Initial table population and label state update
  applyFilters();
}


// Function to generate and rank all possible coffee combinations
function generateAndRankLeaders(
  coffeeProfiles,
  processingMethods,
  roastLevelEffects
) {
  const leaders = [];

  for (const [country, profile] of Object.entries(coffeeProfiles)) {
    for (const [processingName, processing] of Object.entries(
      processingMethods
    )) {
      for (const [roastName, roast] of Object.entries(roastLevelEffects)) {
        const processedProfile = applyFullProcessingEffects(
          profile,
          processingName,
          processingMethods
        );
        const finalProfile = applyRoastEffects(
          processedProfile,
          roastName,
          roastLevelEffects
        );
        const latteScoreRaw = calculateLatteScore(finalProfile);

        const normalizedLatteScore = normalizeScore(latteScoreRaw);

        leaders.push({
          country: country
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          processingAbbreviation: processing.abbreviation,
          processingDisplayName: processing.displayName,
          processingDescription: processing.description,
          roast: roastName.charAt(0).toUpperCase() + roastName.slice(1),
          score: parseFloat(normalizedLatteScore.toFixed(1)),
          grade: getCompatibilityGrade(normalizedLatteScore),
        });
      }
    }
  }

  // Sort leaders by score in descending order
  leaders.sort((a, b) => b.score - a.score);

  return leaders;
}

// Add tooltip functionality
export function initializeTooltips() {
  // Create tooltip element
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.style.cssText = `
    position: fixed;
    background: var(--surface-color);
    color: var(--text-color);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    max-width: 250px;
    border: 1px solid var(--border-color);
  `;
  document.body.appendChild(tooltip);

  // Handle tooltip display
  function showTooltip(event, text) {
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Position tooltip
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 8;

    // Adjust position for mobile touch events
    if (event.type === "touchstart") {
      top = rect.top - tooltipRect.height - 8; // Position above the element
      // Ensure tooltip is not off-screen to the left or right on mobile
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
    }

    // Adjust if tooltip would go off screen (for desktop hover)
    if (event.type === "mouseenter") {
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      if (top + tooltipRect.height > window.innerHeight - 8) {
        top = rect.top - tooltipRect.height - 8;
      }
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.textContent = text;
    tooltip.style.opacity = "1";
  }

  function hideTooltip() {
    tooltip.style.opacity = "0";
  }

  // Add event listeners to all processing abbreviations and full names
  document
    .querySelectorAll(
      ".processing-abbreviation-mobile, .processing-fullname-desktop"
    )
    .forEach((element) => {
      const processingName =
        element.parentElement.getAttribute("data-processing");
      const processing = processingMethods[processingName];
      if (processing) {
        const tooltipText = `${processing.displayName}: ${processing.description}`;

        // Desktop hover
        element.addEventListener("mouseenter", (e) =>
          showTooltip(e, tooltipText)
        );
        element.addEventListener("mouseleave", hideTooltip);

        // Mobile touch
        element.addEventListener("touchstart", (e) => {
          e.preventDefault();
          showTooltip(e, tooltipText);
        });
        element.addEventListener("touchend", hideTooltip);
      }
    });
}
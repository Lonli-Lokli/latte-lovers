import { multipleSelect } from "multiple-select-vanilla";

export const coffeeProfiles = {
  brazil: {
    sweetness: 8,
    acidity: 5,
    body: 8,
    balance: 9,
    bitterness: 6,
  },
  colombia: {
    sweetness: 7,
    acidity: 6,
    body: 7,
    balance: 8,
    bitterness: 5,
  },
  ethiopia: {
    sweetness: 6,
    acidity: 9,
    body: 5,
    balance: 6,
    bitterness: 3,
  },
  guatemala: {
    sweetness: 7,
    acidity: 7,
    body: 8,
    balance: 8,
    bitterness: 5,
  },
  "costa-rica": {
    sweetness: 6,
    acidity: 8,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  honduras: {
    sweetness: 7,
    acidity: 6,
    body: 7,
    balance: 7,
    bitterness: 5,
  },
  nicaragua: {
    sweetness: 7,
    acidity: 6,
    body: 7,
    balance: 7,
    bitterness: 5,
  },
  peru: {
    sweetness: 6,
    acidity: 7,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  mexico: {
    sweetness: 6,
    acidity: 6,
    body: 7,
    balance: 7,
    bitterness: 5,
  },
  jamaica: {
    sweetness: 8,
    acidity: 5,
    body: 8,
    balance: 9,
    bitterness: 4,
  },
  kenya: {
    sweetness: 5,
    acidity: 9,
    body: 7,
    balance: 6,
    bitterness: 3,
  },
  rwanda: {
    sweetness: 6,
    acidity: 8,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  burundi: {
    sweetness: 6,
    acidity: 8,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  tanzania: {
    sweetness: 6,
    acidity: 8,
    body: 7,
    balance: 7,
    bitterness: 6,
  },
  yemen: {
    sweetness: 7,
    acidity: 6,
    body: 9,
    balance: 8,
    bitterness: 7,
  },
  indonesia: {
    sweetness: 7,
    acidity: 4,
    body: 9,
    balance: 7,
    bitterness: 8,
  },
  vietnam: {
    sweetness: 5,
    acidity: 4,
    body: 8,
    balance: 6,
    bitterness: 9,
  },
  india: {
    sweetness: 6,
    acidity: 5,
    body: 8,
    balance: 7,
    bitterness: 7,
  },
  "papua-new-guinea": {
    sweetness: 6,
    acidity: 6,
    body: 8,
    balance: 7,
    bitterness: 5,
  },
  panama: {
    sweetness: 7,
    acidity: 8,
    body: 6,
    balance: 8,
    bitterness: 4,
  },
  "el-salvador": {
    sweetness: 7,
    acidity: 7,
    body: 6,
    balance: 7,
    bitterness: 5,
  },
  uganda: {
    sweetness: 6,
    acidity: 7,
    body: 7,
    balance: 7,
    bitterness: 5,
  },
  bolivia: {
    sweetness: 6,
    acidity: 7,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  ecuador: {
    sweetness: 6,
    acidity: 7,
    body: 6,
    balance: 7,
    bitterness: 5,
  },
  myanmar: {
    sweetness: 7,
    acidity: 7,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  china: {
    sweetness: 7,
    acidity: 6,
    body: 6,
    balance: 7,
    bitterness: 4,
  },
  "central-african-republic": {
    sweetness: 5,
    acidity: 4,
    body: 8,
    balance: 6,
    bitterness: 7,
  },
  guinea: {
    sweetness: 5,
    acidity: 4,
    body: 8,
    balance: 6,
    bitterness: 8,
  },
  laos: {
    sweetness: 6,
    acidity: 6,
    body: 8,
    balance: 7,
    bitterness: 6,
  },
  "ivory-coast": {
    sweetness: 6,
    acidity: 4,
    body: 8,
    balance: 6,
    bitterness: 7,
  },
  venezuela: {
    sweetness: 7,
    acidity: 6,
    body: 6,
    balance: 8,
    bitterness: 4,
  },
  malawi: {
    sweetness: 7,
    acidity: 6,
    body: 8,
    balance: 8,
    bitterness: 4,
  },
};

export const processingMethods = {
  washed: {
    displayName: "Washed (Wet Process)",
    abbreviation: "W",
    description:
      "Coffee cherries are pulped and fermented to remove the mucilage before drying",
    effects: {
      sweetness: 0,
      acidity: 1,
      body: -0.5, // Reduced penalty to reflect retained body in some washed coffees
      balance: 1,
      bitterness: 0,
    },
  },
  natural: {
    displayName: "Natural (Dry Process)",
    abbreviation: "N",
    description:
      "Coffee cherries are dried whole, allowing the fruit to naturally ferment",
    effects: {
      sweetness: 2,
      acidity: -1,
      body: 1,
      balance: 0,
      bitterness: 0,
    },
  },
  honey: {
    displayName: "Honey Process",
    abbreviation: "HP",
    description:
      "Partial removal of the fruit pulp, leaving some mucilage during drying",
    effects: {
      sweetness: 1,
      acidity: 0,
      body: 0.5, // Added to reflect slight mouthfeel enhancement
      balance: 1,
      bitterness: 0,
    },
  },
  "semi-washed": {
    displayName: "Semi-Washed (Pulped Natural)",
    abbreviation: "SW",
    description: "Combines elements of both washed and natural processing",
    effects: {
      sweetness: 1,
      acidity: 0,
      body: 0,
      balance: 0,
      bitterness: 0,
    },
  },
  "wet-hulled": {
    displayName: "Wet-Hulled (Giling Basah)",
    abbreviation: "WH",
    description: "Unique to Indonesia, beans are hulled while still wet",
    effects: {
      sweetness: 0.5, // Added to account for occasional fruit notes
      acidity: -1,
      body: 2,
      balance: 0,
      bitterness: 0,
    },
  },
  anaerobic: {
    displayName: "Anaerobic Fermentation",
    abbreviation: "A",
    description:
      "Beans are fermented in oxygen-free environments, often with additives, enhancing complex flavors",
    effects: {
      sweetness: 2,
      acidity: 1,
      body: 0,
      balance: 0.5,
      bitterness: 0,
    },
  },
  "carbonic-maceration": {
    displayName: "Carbonic Maceration",
    abbreviation: "CM",
    description:
      "Whole cherries are fermented in CO2-rich sealed tanks, producing fruit-forward profiles",
    effects: {
      sweetness: 2,
      acidity: 1,
      body: 0,
      balance: 0.5,
      bitterness: 0,
    },
  },
  monsooned: {
    displayName: "Monsooned",
    abbreviation: "M",
    description:
      "Beans are exposed to monsoon winds during drying, creating unique earthy flavors",
    effects: {
      sweetness: 0,
      acidity: -1,
      body: 2,
      balance: 0,
      bitterness: 1,
    },
  },
};

export const roastLevelEffects = {
  light: {
    sweetness: +0.5,
    acidity: +1.5,
    body: -1.0,
    balance: -0.5,
    bitterness: -1.0,
  },
  medium: {
    sweetness: +0.75,
    acidity: -0.75,
    body: +0.75,
    balance: +1.0,
    bitterness: +0.75,
  },
  dark: {
    sweetness: -1.5,
    acidity: -3.0,
    body: +0.5,
    balance: -1.5,
    bitterness: +3.0,
  },
};

function applyFullProcessingEffects(
  baseProfile,
  processingName,
  allProcessingMethods
) {
  const method = allProcessingMethods[processingName];

  if (!method) {
    return {
      sweetness: Math.max(1, Math.min(10, baseProfile.sweetness)),
      acidity: Math.max(1, Math.min(10, baseProfile.acidity)),
      body: Math.max(1, Math.min(10, baseProfile.body)),
      balance: Math.max(1, Math.min(10, baseProfile.balance)),
      bitterness: Math.max(1, Math.min(10, baseProfile.bitterness)),
    };
  }

  const effect = method.effects;
  return {
    sweetness: Math.max(
      1,
      Math.min(10, baseProfile.sweetness + (effect.sweetness || 0))
    ),
    acidity: Math.max(
      1,
      Math.min(10, baseProfile.acidity + (effect.acidity || 0))
    ),
    body: Math.max(1, Math.min(10, baseProfile.body + (effect.body || 0))),
    balance: Math.max(
      1,
      Math.min(10, baseProfile.balance + (effect.balance || 0))
    ),
    bitterness: Math.max(
      1,
      Math.min(10, baseProfile.bitterness + (effect.bitterness || 0))
    ),
  };
}

function applyRoastEffects(processedProfile, roastName, allRoastEffects) {
  const effect = allRoastEffects[roastName];

  if (!effect) {
    console.warn(
      `Roast effect "${roastName}" not found. Returning profile as is (after clamping).`
    );
    return {
      sweetness: Math.max(1, Math.min(10, processedProfile.sweetness)),
      acidity: Math.max(1, Math.min(10, processedProfile.acidity)),
      body: Math.max(1, Math.min(10, processedProfile.body)),
      balance: Math.max(1, Math.min(10, processedProfile.balance)),
      bitterness: Math.max(1, Math.min(10, processedProfile.bitterness)),
    };
  }

  const roastedProfile = {
    sweetness: Math.max(
      1,
      Math.min(10, processedProfile.sweetness + effect.sweetness)
    ),
    acidity: Math.max(
      1,
      Math.min(10, processedProfile.acidity + effect.acidity)
    ),
    body: Math.max(1, Math.min(10, processedProfile.body + effect.body)),
    balance: Math.max(
      1,
      Math.min(10, processedProfile.balance + effect.balance)
    ),
    bitterness: Math.max(
      1,
      Math.min(10, processedProfile.bitterness + effect.bitterness)
    ),
  };

  return roastedProfile;
}

export function toggleBlendInputs() {
  const coffeeType = document.getElementById("coffeeType").value;
  const singleGroup = document.getElementById("singleOriginGroup");
  const blendGroup = document.getElementById("blendGroup");

  if (coffeeType === "single") {
    singleGroup.style.display = "block";
    blendGroup.style.display = "none";
  } else if (coffeeType === "blend") {
    singleGroup.style.display = "none";
    blendGroup.style.display = "block";
  } else {
    singleGroup.style.display = "none";
    blendGroup.style.display = "none";
  }
}

export function validateBlend() {
  const percent1 =
    parseInt(document.getElementById("blend1Percent").value) || 0;
  const percent2 =
    parseInt(document.getElementById("blend2Percent").value) || 0;
  const total = percent1 + percent2;
  const validationDiv = document.getElementById("blendValidation");

  if (total === 0) {
    validationDiv.style.display = "none";
    return;
  }

  if (total !== 100) {
    validationDiv.textContent = `Percentages must add up to 100% (currently ${total}%)`;
    validationDiv.style.display = "block";
  } else {
    validationDiv.style.display = "none";
  }
}

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

  if (body.classList.contains("light-theme")) {
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
}

export function createFinalProfile(initialProfile, processing, roast) {
  const processedProfile = applyFullProcessingEffects(
    initialProfile,
    processing,
    processingMethods
  );

  const finalProfile = applyRoastEffects(
    processedProfile,
    roast,
    roastLevelEffects
  );

  return finalProfile;
}

export function calculateLatteScore(profile) {
  return (
    profile.balance * 0.3 +
    profile.body * 0.3 +
    profile.sweetness * 0.25 +
    Math.min(profile.acidity, 7) * 0.2 -
    (profile.acidity > 7 ? (profile.acidity - 7) * 0.15 : 0) -
    (profile.bitterness > 6 ? (profile.bitterness - 6) * 0.2 : 0) +
    (profile.sweetness < 6 ? (6 - profile.sweetness) * -0.1 : 0)
  );
}

export const ACTUAL_MIN_RAW = 4.275;
export const ACTUAL_MAX_RAW = 9.395;

// Reusable function to normalize the raw latte score
export function normalizeScore(rawScore) {
  const TARGET_DISPLAY_SCALE = 10;
  let normalizedLatteScore =
    ((rawScore - ACTUAL_MIN_RAW) / (ACTUAL_MAX_RAW - ACTUAL_MIN_RAW)) *
    TARGET_DISPLAY_SCALE;
  normalizedLatteScore = Math.max(
    0,
    Math.min(TARGET_DISPLAY_SCALE, normalizedLatteScore)
  );
  return normalizedLatteScore;
}

// Reusable function to get the compatibility grade based on normalized score
export function getCompatibilityGrade(normalizedScore) {
  if (normalizedScore >= 8.0) {
    return "perfect";
  } else if (normalizedScore >= 6.0) {
    return "good";
  } else {
    return "bad";
  }
}

export function mergeProfiles(profile1, percent1, profile2, percent2) {
  return {
    sweetness:
      (profile1.sweetness * percent1 + profile2.sweetness * percent2) / 100,
    acidity: (profile1.acidity * percent1 + profile2.acidity * percent2) / 100,
    body: (profile1.body * percent1 + profile2.body * percent2) / 100,
    balance: (profile1.balance * percent1 + profile2.balance * percent2) / 100,
    bitterness:
      (profile1.bitterness * percent1 + profile2.bitterness * percent2) / 100,
  };
}

export function checkCoffee() {
  const coffeeType = document.getElementById("coffeeType").value;
  const processing = document.getElementById("processing").value;
  const roast = document.getElementById("roastLevel")
    ? document.getElementById("roastLevel").value
    : "";
  const resultDiv = document.getElementById("result");

  if (!coffeeType) {
    alert("Please select a coffee type");
    return;
  }

  let initialProfile;

  if (coffeeType === "single") {
    const country = document.getElementById("country").value;
    if (!country) {
      alert("Please select a country");
      return;
    }
    initialProfile = { ...coffeeProfiles[country] };
  } else if (coffeeType === "blend") {
    const country1 = document.getElementById("blend1Country").value;
    const percent1 =
      parseInt(document.getElementById("blend1Percent").value) || 0;
    const country2 = document.getElementById("blend2Country").value;
    const percent2 =
      parseInt(document.getElementById("blend2Percent").value) || 0;

    if (
      !country1 ||
      !country2 ||
      percent1 <= 0 ||
      percent2 <= 0 ||
      percent1 + percent2 !== 100
    ) {
      alert(
        "Please select both countries and ensure percentages are valid and add up to 100%."
      );
      return;
    }

    const profile1 = coffeeProfiles[country1];
    const profile2 = coffeeProfiles[country2];

    initialProfile = mergeProfiles(profile1, percent1, profile2, percent2);
  } else {
    alert("Invalid coffee type selected.");
    return;
  }

  const latteScoreRaw = calculateLatteScore(
    createFinalProfile(initialProfile, processing, roast)
  );

  const normalizedLatteScore = normalizeScore(latteScoreRaw); // Use reusable function

  let grade, emoji, description, className;

  className = getCompatibilityGrade(normalizedLatteScore); // Use reusable function

  if (className === "perfect") {
    grade = "Excellent Match";
    emoji = "🎯";
    description =
      "Excellent choice for lattes! This coffee will create a harmonious blend with milk, offering great balance and smooth body.";
  } else if (className === "good") {
    grade = "Good Match";
    emoji = "👍";
    description =
      "Good for lattes. This coffee will work well with milk, though you might notice some flavor nuances.";
  } else {
    grade = "Poor Match";
    emoji = "⚠️";
    description =
      "May not be ideal for lattes. This coffee might clash with milk or lack the body needed for a satisfying latte experience. Consider it for black coffee or a different blend.";
  }

  resultDiv.innerHTML = `
    <div class="result-header">
      <div class="result-main">
        <span class="result-emoji">${emoji}</span>
        <div class="result-grade">${grade}</div>
      </div>
      <div class="result-score">${normalizedLatteScore.toFixed(1)}/10</div>
    </div>
    <div class="result-description">${description}</div>
  `;

  resultDiv.className = `result ${className}`;
  resultDiv.style.display = "block";
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

// Function to generate and rank all possible coffee combinations
export function generateAndRankLeaders(
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

    // Adjust if tooltip would go off screen
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top + tooltipRect.height > window.innerHeight - 8) {
      top = rect.top - tooltipRect.height - 8;
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

// Initialize tooltips when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // ... existing DOMContentLoaded code ...

  // Initialize tooltips
  initializeTooltips();
});

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
  function populateSelectOptions(selectElement, data, valueKey, textKey) {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = "";

    for (const [key, itemData] of Object.entries(data)) {
      const option = document.createElement("option");
      const optionValue = valueKey ? itemData[valueKey] : key; // Use key for value if no valueKey
      const optionText = textKey
        ? itemData[textKey]
        : key.charAt(0).toUpperCase() + key.slice(1); // Capitalize key if no textKey

      option.value = key; // Use the key (e.g., 'brazil', 'washed') as the option value
      option.textContent = optionText;
      option.selected = true; // Auto-select this option
      selectElement.appendChild(option);
    }
  }

  // Populate options for each filter
  populateSelectOptions(countryFilter, coffeeProfiles, null, null);
  populateSelectOptions(
    processingFilter,
    processingMethods,
    null,
    "displayName"
  );
  populateSelectOptions(roastFilter, roastLevelEffects, null, null);

  const options = (name) =>  ({
    minimumCountSelected: 0,
    autoAdjustDropHeight: true,
    autoAdjustDropWidthByTextSize: true,
    allSelectedText: name, 
    countSelectedText: name
  });
  multipleSelect(".multiple-select.country",options('Country'));
  multipleSelect(".multiple-select.process", options('Process'));
  multipleSelect(".multiple-select.roast", options('Roast'));
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

// Update the loadTabContent function in index.html to call initializeLeadersFilters when the top tab is loaded.

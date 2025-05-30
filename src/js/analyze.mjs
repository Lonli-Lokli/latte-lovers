import { ConnectionManager } from "./svg-connector.mjs";
import {
  coffeeProfiles,
  processingMethods,
  roastLevelEffects,
  calculateLatteScore,
  normalizeScore,
  getCompatibilityGrade,
  characteristicDescriptions
} from "../scoring.mjs";

// Create a single ConnectionManager instance as a singleton for this module
let connectionManager = null;

// Use effects directly from scoring.mjs
const processingEffects = Object.fromEntries(
  Object.entries(processingMethods).map(([id, method]) => [id, method.effects])
);

const roastingEffects = Object.fromEntries(
  Object.entries(roastLevelEffects).map(([id, level]) => [id, level.effects])
);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Define ideal ranges for latte characteristics
const idealLatteRanges = {
  acidity: { min: 4, max: 7 },
  body: { min: 6, max: Infinity }, // Higher body is always better for raw score
  sweetness: { min: 5, max: Infinity }, // Higher sweetness is always better for raw score (no upper penalty)
  bitterness: { min: 3, max: 6 },
  balance: { min: 7, max: Infinity }, // Higher balance is always better for raw score
};

// Helper to get the class for a characteristic value based on its range
function getCharacteristicClass(char, value) {
  const range = idealLatteRanges[char];
  if (!range) return "neutral"; // Default to neutral if no range defined

  // Check if the value is within the perfect range
  if (value >= range.min && value <= range.max) {
    return "perfect";
  }

  // Check if the value is slightly outside the range (within 1 unit)
  if (
    (value >= range.min - 1 && value < range.min) ||
    (value > range.max && value <= range.max + 1)
  ) {
    return "good";
  }

  // Otherwise, the value is significantly outside the range
  return "bad";
}

// Helper to get the class for an arrow based on characteristic change and ideal range
function getArrowClass(char, originalValue, finalValue) {
  const range = idealLatteRanges[char];
  if (!range) return "arrow-neutral"; // Default to neutral

  const originalDistanceToIdeal = getDistanceToIdeal(char, originalValue);
  const finalDistanceToIdeal = getDistanceToIdeal(char, finalValue);

  // Determine if the value moved closer or further from the ideal range
  if (finalDistanceToIdeal < originalDistanceToIdeal) {
    return "arrow-improve"; // Moved closer to ideal range
  } else if (finalDistanceToIdeal > originalDistanceToIdeal) {
    return "arrow-worsen"; // Moved further from ideal range
  } else {
    return "arrow-neutral"; // Stayed same distance or no change
  }
}

// Helper function to calculate distance to the ideal range (0 if within range)
function getDistanceToIdeal(char, value) {
  const range = idealLatteRanges[char];
  if (!range) return Math.abs(value); // Distance to 0 if no range? Or handle differently?

  // If the value is within the range, the distance is 0
  if (value >= range.min && value <= range.max) {
    return 0;
  }

  // If the value is below the min, the distance is the difference to the min
  if (value < range.min) {
    return range.min - value;
  }

  // If the value is above the max, the distance is the difference to the max
  if (value > range.max) {
    return value - range.max;
  }

  return 0; // Should not reach here if logic is correct
}

// Helper to get the color for an SVG line based on characteristic change and ideal range
function getLineColor(char, originalValue, finalValue) {
    const range = idealLatteRanges[char];
    if (!range) return "#b8b8b8"; // Default neutral color

    const originalDistanceToIdeal = getDistanceToIdeal(char, originalValue);
    const finalDistanceToIdeal = getDistanceToIdeal(char, finalValue);

    // Determine if the value moved closer or further from the ideal range
    if (finalDistanceToIdeal < originalDistanceToIdeal) {
        return "#28a745"; // Green for improvement
    } else if (finalDistanceToIdeal > originalDistanceToIdeal) {
        return "#dc3545"; // Red for worsening
    } else {
        return "#b8b8b8"; // Gray for neutral or no change
    }
}

function calculateProfile() {
  const country = document.getElementById("country").value;
  const processing = document.getElementById("processing").value;
  const roasting = document.getElementById("roasting").value;

  // Check if all selections are made
  if (!country || !processing || !roasting) {
    // Optionally clear display or show a message if selections are incomplete
    // For now, we'll let the rest of the function run, which might result in errors
    // if subsequent code expects defined profiles/effects.
    console.log("Selections incomplete, cannot calculate profile.");
    return {
      baseProfile: {},
      processedProfile: {},
      finalProfile: {},
      score: null,
    }; // Return empty/null values
  }

  // Get base profile, with error handling
  const baseProfile = coffeeProfiles[country];
  if (!baseProfile) {
    console.error(`Unknown country selected: ${country}`);
    return {
      baseProfile: {},
      processedProfile: {},
      finalProfile: {},
      score: null,
    };
  }

  // Apply processing effects
  const processedProfile = {};
  const currentProcessingEffects = processingEffects[processing];
  if (!currentProcessingEffects) {
    console.error(`Unknown processing method selected: ${processing}`);
    // Attempt to copy base profile if effects are missing
    for (let char in baseProfile) {
      processedProfile[char] = baseProfile[char];
    }
  } else {
    for (let char in baseProfile) {
      processedProfile[char] = clamp(
        baseProfile[char] + (currentProcessingEffects[char] || 0),
        0,
        10
      );
    }
  }

  // Apply roasting effects
  const finalProfile = {};
  const currentRoastingEffects = roastingEffects[roasting];
  if (!currentRoastingEffects) {
    console.error(`Unknown roasting level selected: ${roasting}`);
    // Attempt to copy processed profile if effects are missing
    for (let char in processedProfile) {
      finalProfile[char] = processedProfile[char];
    }
  } else {
    for (let char in processedProfile) {
      finalProfile[char] = clamp(
        processedProfile[char] + (currentRoastingEffects[char] || 0),
        0,
        10
      );
    }
  }

  // Calculate latte score using the standardized function
  const score =
    finalProfile && Object.keys(finalProfile).length > 0
      ? calculateLatteScore(finalProfile)
      : null; // Only calculate score if finalProfile is valid

  return { baseProfile, processedProfile, finalProfile, score };
}

function updateDisplay() {
  const { baseProfile, processedProfile, finalProfile, score } = calculateProfile();

  // If calculation failed (e.g., incomplete selections), reset display or show message
  if (score === null) {
    // Optionally clear fields or show a specific message
    document.getElementById("formula-result").className = "result"; // Reset result class
    document.getElementById("formula-emoji").textContent = "";
    document.getElementById("formula-grade").textContent = "Select Options";
    document.getElementById("formula-score").textContent = "";
    document.getElementById("formula-description").textContent =
      "Please select Origin, Process, and Roast to calculate the latte profile.";

    // Clear characteristic values in the new grid structure
    const stages = ["origin", "processing", "roasting", "final"];
    const chars = ["acidity", "body", "sweetness", "bitterness", "balance"];

    stages.forEach(stageId => {
        chars.forEach(char => {
            const element = document.querySelector(`#${stageId}-stage .characteristics-section .${char} .characteristic-label-container`);
            if (element) {
                const valueElement = element.querySelector('.char-value');
                if(valueElement) {
                  valueElement.textContent = "-";
                }
                element.classList.remove("perfect", "good", "bad");
            } else if (stageId === 'final') { // Handle case where final stage might not have all elements initially
                 const element = document.querySelector(`#${stageId}-stage .characteristics-section .${char} .characteristic-label-container`);
                 if (element) {
                    const valueElement = element.querySelector('.char-value');
                    if(valueElement) {
                      valueElement.textContent = "-";
                    }
                    element.classList.remove("perfect", "good", "bad");
                 }
            }
        });
    });

    // Clear impact details
    document.getElementById("processing-details").innerHTML = "";
    document.getElementById("roasting-details").innerHTML = "";

    document.getElementById("score-breakdown").textContent =
      "Select options to see breakdown.";

    return; // Stop update if calculation is incomplete/invalid
  }

  // Determine grade and description based on score
  let grade = "";
  let description = "";
  let emoji = "";

  // Normalize the raw score
  const normalizedScore = normalizeScore(score);

  // Get the compatibility grade based on the normalized score
  const resultClass = getCompatibilityGrade(normalizedScore);

  // Determine grade, description, and emoji based on the normalized score grade
  switch (resultClass) {
    case "perfect":
      grade = "Perfect Latte!";
      description =
        "This coffee profile is ideal for a latte, offering excellent balance and flavor.";
      emoji = "🎉";
      break;
    case "good":
      grade = "Good Latte";
      description =
        "This coffee profile works well in a latte, with a good balance of characteristics.";
      emoji = "👍";
      break;
    case "bad":
      grade = "Needs Adjustment";
      description =
        "This coffee profile may be less suitable for a latte. Consider adjusting origin, processing, or roast.";
      emoji = "🤔";
      break;
    default:
      grade = "Unknown";
      description = "";
      emoji = "";
  }

  // Update the result display elements
  const resultElement = document.getElementById("formula-result");
  resultElement.className = "result " + resultClass; // Apply appropriate class for styling
  document.getElementById("formula-emoji").textContent = emoji;
  document.getElementById("formula-grade").textContent = grade;
  document.getElementById(
    "formula-score"
  ).textContent = `${normalizedScore.toFixed(1)}/10`;
  document.getElementById("formula-description").textContent = description;

  // Update characteristics in the new grid structure
  const chars = ["acidity", "body", "sweetness", "bitterness", "balance"];

  // Map profiles to stages
  const stageProfiles = {
      "origin": baseProfile,
      "processing": processedProfile,
      "roasting": finalProfile, // Roasting stage displays final profile
      "final": finalProfile     // Final stage also displays final profile
  };

  for (const stageId in stageProfiles) {
      const profile = stageProfiles[stageId];
      if (!profile) continue; // Skip if profile is null/undefined

      chars.forEach(char => {
          const element = document.querySelector(`#${stageId}-stage .characteristics-section .${char} .characteristic-label-container`);
          if (element && profile[char] !== undefined) {
              const value = profile[char];
              const valueElement = element.querySelector('.char-value'); // Get the value span
              if(valueElement) {
                  valueElement.textContent = value.toFixed(1); // Update only the value span
              }

              // Apply color classes based on the value and the ideal range to the parent .grid-item
              element.classList.remove("perfect", "good", "bad"); // Remove previous color classes
              element.classList.add(getCharacteristicClass(char, value)); // Add the correct color class
          } else if (element) {
               // If profile[char] is undefined, display placeholder or clear
               const valueElement = element.querySelector('.char-value');
               if(valueElement) {
                 valueElement.textContent = "-";
               }
               element.classList.remove("perfect", "good", "bad");
          }
      });
  }

  // Update score breakdown
  document.getElementById(
    "score-breakdown"
  ).textContent = `Body(${finalProfile.body.toFixed(
    1
  )})×0.3 + Sweetness(${finalProfile.sweetness.toFixed(
    1
  )})×0.25 + Balance(${finalProfile.balance.toFixed(
    1
  )})×0.3 + Acidity(${finalProfile.acidity.toFixed(
    1
  )})×0.2 - penalties = ${normalizedScore.toFixed(1)}`;

  updateProcessingDetails();
  updateRoastingDetails();

  // Draw SVG connections after updating display
  requestAnimationFrame(() => {
      // Use the singleton connectionManager instance
      drawConnections({ baseProfile, processedProfile, finalProfile });
  });
}

function updateProcessingDetails() {
  const processing = document.getElementById("processing").value;
  const method = processingMethods[processing];
  const effects = method ? method.effects : {}; // Use empty object if method is null/undefined
  const description = method ? method.description : 'No description available.'; // Get the description

  let html = '';

  // Create a container for the description sub-section
  html += '<div class="explanation">'; // Use the same class for consistent styling
  html += `<h3>${method.displayName}</h3>`; // Sub-header
  if (description) {
    html += `<p>${description}</p>`; // Description in p tags
  }
  html += '</div>'; // Close explanation div

  // Get original values to compare with processed values
  const country = document.getElementById("country").value;
  const baseProfile = coffeeProfiles[country] || {}; // Use empty object if profile is null/undefined

  for (let char in effects) {
    const originalValue = baseProfile[char] !== undefined ? baseProfile[char] : null; // Get original value, handle undefined
    const effectValue = effects[char];
    const processedValue = originalValue !== null ? clamp(originalValue + effectValue, 0, 10) : null; // Calculate processed value if original is available

    // Determine arrow class for impact description
    let impactArrowClass = '';
    if (originalValue !== null && processedValue !== null) {
        impactArrowClass = getArrowClass(char, originalValue, processedValue);
    }

    if (effectValue !== 0) {
      const sign = effectValue > 0 ? '+' : '';
      // Get the characteristic-specific taste impact description
      const charImpactDescription = characteristicDescriptions[char] ? characteristicDescriptions[char].impact(effectValue) : '';

      html += `
        <div class="impact-item">
          <div class="impact-char ${impactArrowClass}">${char.charAt(0).toUpperCase() + char.slice(1)} (${sign}${effectValue})</div>
          <div class="impact-desc">${charImpactDescription}</div> <!-- Use characteristic-specific impact description -->
        </div>
      `;
    }
  }

  document.getElementById("processing-details").innerHTML = html;
}

function updateRoastingDetails() {
  const roasting = document.getElementById("roasting").value;
  const level = roastLevelEffects[roasting];
  const effects = level ? level.effects : {}; // Use empty object if level is null/undefined
  const description = level ? level.description : 'No description available.'; // Get the description

  let html = '';

   // Create a container for the description sub-section
   html += '<div class="explanation">'; // Use the same class for consistent styling
   html += `<h3>${level.displayName}</h3>`; // Sub-header
   if (description) {
    html += `<p>${description}</p>`; // Description in p tags
  }
  html += '</div>'; // Close explanation div

   // Get processed values to compare with final values
  const country = document.getElementById("country").value;
  const processing = document.getElementById("processing").value;

  const baseProfile = coffeeProfiles[country] || {}; // Use empty object if profile is null/undefined
  const processingEffects = processingMethods[processing] ? processingMethods[processing].effects : {}; // Use empty object if effects are null/undefined

  const processedProfile = {};
  for (let char in baseProfile) {
     processedProfile[char] = clamp(
       baseProfile[char] + (processingEffects[char] || 0),
       0, 10
     );
   }


  for (let char in effects) {
     const processedValue = processedProfile[char] !== undefined ? processedProfile[char] : null; // Get processed value, handle undefined
     const effectValue = effects[char];
     const finalValue = processedValue !== null ? clamp(processedValue + effectValue, 0, 10) : null; // Calculate final value if processed is available

     // Determine arrow class for impact description
     let impactArrowClass = '';
      if (processedValue !== null && finalValue !== null) {
        impactArrowClass = getArrowClass(char, processedValue, finalValue);
     }

    if (effectValue !== 0) {
      const sign = effectValue > 0 ? '+' : '';
       // Get the characteristic-specific taste impact description
       const charImpactDescription = characteristicDescriptions[char] ? characteristicDescriptions[char].impact(effectValue) : '';

      html += `
        <div class="impact-item">
          <div class="impact-char ${impactArrowClass}">${char.charAt(0).toUpperCase() + char.slice(1)} (${sign}${effectValue})</div>
          <div class="impact-desc">${charImpactDescription}</div> <!-- Use characteristic-specific impact description -->
        </div>
      `;
    }
  }

  document.getElementById("roasting-details").innerHTML = html;
}

// Helper function to toggle section visibility
function toggleSection(event) {
  const header = event.target.closest(".toggle-header");
  if (!header) return;

  const content = header.nextElementSibling;
  const icon = header.querySelector(".toggle-icon");

  if (content && icon) {
    content.classList.toggle("active");
    icon.style.transform = content.classList.contains("active")
      ? "rotate(180deg)"
      : "rotate(0deg)";
  }
}

function initializeOptions() {
  // Initialize country options
  const countrySelect = document.getElementById("country");

  // Get entries and sort by key (id) alphabetically
  const sortedCountryOptions = Object.entries(coffeeProfiles)
    .sort(([idA,], [idB,]) => idA.localeCompare(idB))
    .map(([id, profile]) => `<option value="${id}">${profile.name || id.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</option>`);

  countrySelect.innerHTML = sortedCountryOptions.join("");

  countrySelect.selectedIndex = 0; // Select the first data option (which is now the first alphabetically by key)
  // Add class to floating label if an option is selected
  if (countrySelect.value) {
    countrySelect.closest(".floating-label").classList.add("has-value");
  }

  // Initialize processing options
  const processingSelect = document.getElementById("processing");
  processingSelect.innerHTML = Object.entries(processingMethods)
    .map(
      ([id, method]) => `<option value="${id}">${method.displayName}</option>`
    )
    .join("");
  processingSelect.selectedIndex = 0; // Select the first data option
  // Add class to floating label if an option is selected
  if (processingSelect.value) {
    processingSelect.closest(".floating-label").classList.add("has-value");
  }

  // Initialize roasting options
  const roastingSelect = document.getElementById("roasting");
  roastingSelect.innerHTML = Object.entries(roastLevelEffects)
    .map(([id, level]) => `<option value="${id}">${level.displayName}</option>`)
    .join("");
  roastingSelect.selectedIndex = 0; // Select the first data option
  // Add class to floating label if an option is selected
  if (roastingSelect.value) {
    roastingSelect.closest(".floating-label").classList.add("has-value");
  }

  // Add event listeners to update class on change
  document.getElementById("country").addEventListener("change", function () {
    if (this.value) {
      this.closest(".floating-label").classList.add("has-value");
    } else {
      this.closest(".floating-label").classList.remove("has-value");
    }
    updateDisplay();
  });
  document.getElementById("processing").addEventListener("change", function () {
    if (this.value) {
      this.closest(".floating-label").classList.add("has-value");
    } else {
      this.closest(".floating-label").classList.remove("has-value");
    }
    updateDisplay();
  });
  document.getElementById("roasting").addEventListener("change", function () {
    if (this.value) {
      this.closest(".floating-label").classList.add("has-value");
    } else {
      this.closest(".floating-label").classList.remove("has-value");
    }
    updateDisplay();
  });

  // Event listeners for toggle sections
  document.querySelectorAll(".toggle-header").forEach((header) => {
    header.addEventListener("click", toggleSection);
  });

  // Initial display
  updateDisplay();
}

export function initializeAnalyzeTab() {
  // Initialize options from existing data
  initializeOptions();

  // Create the ConnectionManager after DOM is loaded
  const connectionSvg = document.getElementById('connection-svg');
  if (!connectionSvg) {
    console.error('Connection SVG element not found');
    return;
  }
  connectionManager = new ConnectionManager(connectionSvg);

  // Add resize event listener to refresh connections on the singleton manager
  window.addEventListener('resize', () => {
      if (connectionManager) {
          connectionManager.refreshAllConnections();
      }
  });

  // Initial display, using the singleton connection manager instance
  updateDisplay();
}

// Function to draw SVG connections between stages
// Uses the singleton ConnectionManager instance
function drawConnections({ baseProfile, processedProfile, finalProfile }) {
    if (!connectionManager) {
        console.error('ConnectionManager not initialized');
        return;
    }

    const stages = ["origin", "processing", "roasting"]; // Exclude 'final' stage for main connections
    const profiles = { "origin": baseProfile, "processing": processedProfile, "roasting": finalProfile }; // Use finalProfile for roasting stage data
    const chars = ["acidity", "body", "sweetness", "bitterness", "balance"];

    // Clear any existing connections first
    connectionManager.clearAllConnections();

    // Iterate through stages that have a next stage (up to roasting)
    for (let i = 0; i < stages.length - 1; i++) {
        const currentStageId = stages[i];
        const nextStageId = stages[i + 1];

        const currentProfile = profiles[currentStageId];
        const nextProfile = profiles[nextStageId];

        // Ensure both profiles are available
        if (!currentProfile || !nextProfile) {
            continue;
        }

        chars.forEach(char => {
            // Get the characteristic item elements' selectors
            const currentItemSelector = `#${currentStageId}-stage .characteristics-section .${char} .characteristic-label-container`;
            const nextItemSelector = `#${nextStageId}-stage .characteristics-section .${char} .characteristic-label-container`;

                // Get the characteristic values for color determination
            const value1 = currentProfile[char];
            const value2 = nextProfile[char];

                 // Ensure values are valid before determining color and drawing line
                 if (value1 !== undefined && value2 !== undefined) {
                // Calculate the difference and format the label text
                const difference = value2 - value1;
                const labelText = difference > 0 ? `+${difference.toFixed(1)}` : difference.toFixed(1);

                    // Determine line color based on value change from value1 to value2
                const colorAfter = getLineColor(char, value1, value2);
                const colorBefore = '#b8b8b8'; // Neutral color for the first segment

                // Create a unique ID for the connection
                const connectionId = `${currentStageId}-to-${nextStageId}-${char}-connection`;

                // Use the singleton ConnectionManager instance to create the connection
                connectionManager.createConnection(
                    connectionId,
                    currentItemSelector,
                    nextItemSelector,
                    labelText, // Use the difference as label text
                    colorBefore, // Color before label
                    colorAfter // Color after label
                );
             }
        });
    }

    // Draw connections from Roasting stage characteristics to the Score block
    const roastingProfile = profiles["roasting"];
    const scoreElementSelector = "#formula-result";
    const scoreElement = document.querySelector(scoreElementSelector);
    const roastingElementSelector = "#roasting-stage";
    const roastingElement = document.querySelector(roastingElementSelector);

    if (roastingProfile && scoreElement) {
        chars.forEach(char => {
            const characteristicElementSelector = `#roasting-stage .characteristics-section .${char} .characteristic-label-container`;
            const characteristicElement = document.querySelector(characteristicElementSelector);
            const containerRect = connectionManager.svg.getBoundingClientRect();

            if (characteristicElement && roastingProfile[char] !== undefined) {
                const value = roastingProfile[char];
                let contributionText = "";
                let connectionColor = getLineColor(char, value, value); // Determine color based on the final value's status

                // Calculate contribution text based on the characteristic and its weight/penalty
                switch (char) {
                    case 'body':
                        contributionText = `+${(value * 0.3).toFixed(1)}`;
                        break;
                    case 'sweetness':
                        contributionText = `+${(value * 0.25).toFixed(1)}`;
                        break;
                    case 'balance':
                        contributionText = `+${(value * 0.3).toFixed(1)}`;
                        break;
                    case 'acidity':
                         // Acidity contributes positively but also has a penalty
                        const acidityContribution = value * 0.2;
                        let acidityNote = '';
                         if (value < 4) {
                            acidityNote = ` (Penalty: ${(4 - value) * 1.5})`;
                         } else if (value > 7) {
                            acidityNote = ` (Penalty: ${(value - 7) * 1.0})`;
                         }
                        contributionText = `+${acidityContribution.toFixed(1)}${acidityNote}`;
                        break;
                    case 'bitterness':
                        // Bitterness only applies a penalty if above 6
                        let bitternessNote = '';
                        if (value > 6) {
                            bitternessNote = ` (Penalty: ${(value - 6) * 2.0})`;
                        }
                        contributionText = `-${(value - 6) * 2.0}`; // Show penalty as negative contribution for bitterness > 6
                        // For bitterness, the color should probably reflect the penalty status
                         if (value > 6) {
                             connectionColor = '#dc3545'; // Red for bad bitterness
                         } else {
                             connectionColor = '#b8b8b8'; // Gray for acceptable bitterness
                         }
                        break;
                    default:
                        contributionText = char;
                }

                 // Create a unique ID for the connection to the score block
                const connectionId = `roasting-to-score-${char}-connection`;

                connectionManager.createVerticalConnection(
                    connectionId,
                    characteristicElementSelector,
                    scoreElementSelector,
                    contributionText, // First line: Text showing contribution
                    '', // Second line: Empty string
                    '#b8b8b8', // Color before label (neutral)
                    connectionColor, // Color after label (based on final value/penalty)
                    // Determine xOffsetPercentage based on character index, with a smaller range
                    0.2 + (chars.indexOf(char) / (chars.length - 1)) * 0.6 // Distribute points between 20% and 80% of the width
                );
            }
        });
    }

    // The ConnectionManager handles removing old connections internally when creating new ones with the same ID.
    // The clearAllConnections at the start ensures connections from removed stages are also cleared.
}

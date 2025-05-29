import {
  coffeeProfiles,
  processingMethods,
  calculateLatteScore,
  createFinalProfile,
  normalizeScore,
  getCompatibilityGrade
} from "../scoring.mjs";

export function initializeCheckerTab() {
  initializeCountryOptions();
  initializeProcessingOptions();

  // Add event listeners for the loaded content
  const coffeeTypeSelect = document.getElementById("coffeeType");
  if (coffeeTypeSelect) {
    coffeeTypeSelect.addEventListener("change", toggleBlendInputs);
  }

  const blend1Percent = document.getElementById("blend1Percent");
  const blend2Percent = document.getElementById("blend2Percent");
  if (blend1Percent && blend2Percent) {
    blend1Percent.addEventListener("input", validateBlend);
    blend2Percent.addEventListener("input", validateBlend);
  }

  const checkBtn = document.querySelector(".check-btn");
  if (checkBtn) {
    checkBtn.addEventListener("click", checkCoffee);
  }
}

function initializeCountryOptions() {
  const countrySelects = ["country", "blend1Country", "blend2Country"];
  const countries = Object.keys(coffeeProfiles).sort();

  countrySelects.forEach((selectId) => {
    const select = document.getElementById(selectId);
    if (select) {
      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        select.appendChild(option);
      });
    }
  });
}

function toggleBlendInputs() {
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

function initializeProcessingOptions() {
  const processingSelect = document.getElementById("processing");
  if (processingSelect) {
    const methods = Object.entries(processingMethods);

    methods.forEach(([value, { displayName }]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = displayName;
      if (value === "washed") {
        option.selected = true;
      }
      processingSelect.appendChild(option);
    });
  }
}

function validateBlend() {
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

function checkCoffee() {
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

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
  peru: { sweetness: 6, acidity: 7, body: 6, balance: 7, bitterness: 4 },
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
  kenya: { sweetness: 5, acidity: 9, body: 7, balance: 6, bitterness: 3 },
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
  yemen: { sweetness: 7, acidity: 6, body: 9, balance: 8, bitterness: 7 },
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
  india: { sweetness: 6, acidity: 5, body: 8, balance: 7, bitterness: 7 },
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
};

export const processingMethods = {
  washed: {
    displayName: "Washed (Wet Process)",
    description:
      "Coffee cherries are pulped and fermented to remove the mucilage before drying",
    effects: {
      sweetness: 0,
      acidity: +1,
      body: -0.5,
      balance: +1,
      bitterness: 0,
    },
  },
  natural: {
    displayName: "Natural (Dry Process)",
    description:
      "Coffee cherries are dried whole, allowing the fruit to naturally ferment",
    effects: {
      sweetness: +2,
      acidity: -1,
      body: +1,
      balance: 0,
      bitterness: 0,
    },
  },
  honey: {
    displayName: "Honey Process",
    description:
      "Partial removal of the fruit pulp, leaving some mucilage during drying",
    effects: {
      sweetness: +1,
      acidity: 0,
      body: +0.5,
      balance: +1,
      bitterness: 0,
    },
  },
  "semi-washed": {
    displayName: "Semi-Washed",
    description: "Combines elements of both washed and natural processing",
    effects: {
      sweetness: +1,
      acidity: 0,
      body: 0,
      balance: 0,
      bitterness: 0,
    },
  },
  "wet-hulled": {
    displayName: "Wet-Hulled",
    description: "Unique to Indonesia, beans are hulled while still wet",
    effects: {
      sweetness: +0.5,
      acidity: -1,
      body: +2,
      balance: 0,
      bitterness: 0,
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
export const ACTUAL_MAX_RAW = 9.223;

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

  const TARGET_DISPLAY_SCALE = 10;

  let normalizedLatteScore =
    ((latteScoreRaw - ACTUAL_MIN_RAW) / (ACTUAL_MAX_RAW - ACTUAL_MIN_RAW)) *
    TARGET_DISPLAY_SCALE;
  normalizedLatteScore = Math.max(
    0,
    Math.min(TARGET_DISPLAY_SCALE, normalizedLatteScore)
  );

  let grade, emoji, description, className;

  if (normalizedLatteScore >= 8.0) {
    grade = "Excellent Match";
    emoji = "🎯";
    className = "perfect";
    description =
      "Excellent choice for lattes! This coffee will create a harmonious blend with milk, offering great balance and smooth body.";
  } else if (normalizedLatteScore >= 6.0) {
    grade = "Good Match";
    emoji = "👍";
    className = "good";
    description =
      "Good for lattes. This coffee will work well with milk, though you might notice some flavor nuances.";
  } else {
    grade = "Poor Match";
    emoji = "⚠️";
    className = "bad";
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
    .getElementById("coffeeType")
    .addEventListener("change", toggleBlendInputs);
  document.querySelector(".check-btn").addEventListener("click", checkCoffee);
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

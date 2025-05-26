const coffeeProfiles = {
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
};

const processingEffects = {
  "": { sweetness: 0, acidity: 1, body: -1, balance: 1, bitterness: 0 },
  washed: {
    sweetness: 0,
    acidity: 1,
    body: -1,
    balance: 1,
    bitterness: 0,
  },
  natural: {
    sweetness: 2,
    acidity: -1,
    body: 1,
    balance: 0,
    bitterness: 0,
  },
  honey: { sweetness: 1, acidity: 0, body: 0, balance: 1, bitterness: 0 },
  "semi-washed": {
    sweetness: 1,
    acidity: 0,
    body: 0,
    balance: 0,
    bitterness: 0,
  },
  "wet-hulled": {
    sweetness: 0,
    acidity: -1,
    body: 2,
    balance: 0,
    bitterness: 0,
  },
};

const roastLevelEffects = {
  "": {
    sweetness: +0.75,
    acidity: -0.75,
    body: +0.75,
    balance: +1.0,
    bitterness: +0.75,
  },
  light: {
    sweetness: 0,
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
    sweetness: -2.0,
    acidity: -3.0,
    body: +0.5,
    balance: -2.0,
    bitterness: +3.0,
  },
};

function applyFullProcessingEffects(
  baseProfile,
  processingName,
  allProcessingEffects
) {
  const effect = allProcessingEffects[processingName];

  if (!effect) {
    return {
      sweetness: Math.max(1, Math.min(10, baseProfile.sweetness)),
      acidity: Math.max(1, Math.min(10, baseProfile.acidity)),
      body: Math.max(1, Math.min(10, baseProfile.body)),
      balance: Math.max(1, Math.min(10, baseProfile.balance)),
      bitterness: Math.max(1, Math.min(10, baseProfile.bitterness)),
    };
  }

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

function validateBlend() {
  const percent1 = parseInt(document.getElementById("blend1Percent").value) || 0;
  const percent2 = parseInt(document.getElementById("blend2Percent").value) || 0;
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

function openContactModal() {
  document.getElementById("contactModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
  document.body.style.overflow = "auto";
}

function toggleTheme() {
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

function calculateLatteScore(profile) {
  return (
    profile.balance * 0.3 +
    profile.body * 0.3 +
    profile.sweetness * 0.25 +
    Math.min(profile.acidity, 6.5) * 0.15 -
    (profile.acidity > 6.5 ? (profile.acidity - 6.5) * 0.2 : 0) -
    (profile.bitterness > 5 ? (profile.bitterness - 5) * 0.25 : 0)
  );
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
    const percent1 = parseInt(document.getElementById("blend1Percent").value) || 0;
    const country2 = document.getElementById("blend2Country").value;
    const percent2 = parseInt(document.getElementById("blend2Percent").value) || 0;

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

    initialProfile = {
      sweetness:
        (profile1.sweetness * percent1 + profile2.sweetness * percent2) / 100,
      acidity:
        (profile1.acidity * percent1 + profile2.acidity * percent2) / 100,
      body: (profile1.body * percent1 + profile2.body * percent2) / 100,
      balance:
        (profile1.balance * percent1 + profile2.balance * percent2) / 100,
      bitterness:
        (profile1.bitterness * percent1 + profile2.bitterness * percent2) / 100,
    };
  } else {
    alert("Invalid coffee type selected.");
    return;
  }

  const processedProfile = applyFullProcessingEffects(
    initialProfile,
    processing,
    processingEffects
  );

  const finalProfile = applyRoastEffects(
    processedProfile,
    roast,
    roastLevelEffects
  );

  const latteScoreRaw = calculateLatteScore(finalProfile);

  const ACTUAL_MIN_RAW = 3.55;
  const ACTUAL_MAX_RAW = 8.913;
  const TARGET_DISPLAY_SCALE = 10;

  let normalizedLatteScore;

  if (ACTUAL_MAX_RAW === ACTUAL_MIN_RAW) {
    normalizedLatteScore = TARGET_DISPLAY_SCALE / 2;
  } else {
    normalizedLatteScore =
      ((latteScoreRaw - ACTUAL_MIN_RAW) / (ACTUAL_MAX_RAW - ACTUAL_MIN_RAW)) *
      TARGET_DISPLAY_SCALE;
  }

  normalizedLatteScore = Math.max(
    0,
    Math.min(TARGET_DISPLAY_SCALE, normalizedLatteScore)
  );

  let grade, emoji, description, className;

  if (normalizedLatteScore >= 8.0) {
    grade = "Perfect";
    emoji = "🤩";
    className = "perfect";
    description =
      "Excellent choice for lattes! This coffee will create a harmonious blend with milk, offering great balance and smooth body.";
  } else if (normalizedLatteScore >= 6.0) {
    grade = "Good";
    emoji = "😊";
    className = "good";
    description =
      "Good for lattes. This coffee will work well with milk, though you might notice some flavor nuances.";
  } else {
    grade = "Consider Alternatives";
    emoji = "🤔";
    className = "bad";
    description =
      "May not be ideal for lattes. This coffee might clash with milk or lack the body needed for a satisfying latte experience. Consider it for black coffee or a different blend.";
  }

  resultDiv.innerHTML = `
    <span class="result-emoji">${emoji}</span>
    <div class="result-grade">${grade}</div>
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
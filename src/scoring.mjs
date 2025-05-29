export const coffeeProfiles = {
  brazil: {
    sweetness: 6,
    acidity: 5,
    body: 8,
    balance: 9,
    bitterness: 6,
  },
  colombia: {
    sweetness: 7,
    acidity: 8,
    body: 7,
    balance: 8,
    bitterness: 5,
  },
  ethiopia: {
    sweetness: 6,
    acidity: 9,
    body: 5,
    balance: 9,
    bitterness: 3,
  },
  guatemala: {
    sweetness: 5,
    acidity: 7,
    body: 8,
    balance: 8,
    bitterness: 5,
  },
  "costa-rica": {
    sweetness: 7,
    acidity: 6,
    body: 8,
    balance: 7,
    bitterness: 5,
  },
  honduras: {
    sweetness: 7,
    acidity: 6,
    body: 7,
    balance: 7,
    bitterness: 6,
  },
  nicaragua: {
    sweetness: 7,
    acidity: 6,
    body: 7,
    balance: 7,
    bitterness: 6,
  },
  peru: {
    sweetness: 6,
    acidity: 6,
    body: 8,
    balance: 7,
    bitterness: 7,
  },
  mexico: {
    sweetness: 6,
    acidity: 6,
    body: 7,
    balance: 7,
    bitterness: 7,
  },
  jamaica: {
    sweetness: 5,
    acidity: 5,
    body: 8,
    balance: 6,
    bitterness: 8,
  },
  kenya: {
    sweetness: 5,
    acidity: 8,
    body: 5,
    balance: 8,
    bitterness: 3,
  },
  rwanda: {
    sweetness: 8,
    acidity: 8,
    body: 5,
    balance: 8,
    bitterness: 4,
  },
  burundi: {
    sweetness: 8,
    acidity: 8,
    body: 5,
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
    sweetness: 6,
    acidity: 6,
    body: 8,
    balance: 6,
    bitterness: 7,
  },
  indonesia: {
    sweetness: 6,
    acidity: 4,
    body: 8,
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
    acidity: 4,
    body: 8,
    balance: 7,
    bitterness: 8,
  },
  "papua-new-guinea": {
    sweetness: 7,
    acidity: 6,
    body: 8,
    balance: 6,
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
    displayName: "Light Roast",
    abbreviation: "L",
    description: "Preserves origin character, bright and acidic",
    effects: {
      sweetness: 0.5,
      acidity: 1.5,
      body: -1.0,
      balance: -0.5,
      bitterness: -1.0,
    },
  },
  "light-medium": {
    displayName: "Light-Medium Roast",
    abbreviation: "LM",
    description:
      "A balanced roast level, between light and medium, offering a blend of origin acidity and developing body and sweetness.",
    effects: {
      sweetness: 0.75,
      acidity: 0.25,
      body: -0.25,
      balance: 0.75,
      bitterness: 0,
    },
  },
  medium: {
    displayName: "Medium Roast",
    abbreviation: "M",
    description: "Balanced between origin and roast character",
    effects: {
      sweetness: 0.75,
      acidity: -0.75,
      body: 0.75,
      balance: 1.0,
      bitterness: 0.75,
    },
  },
  "medium-dark": {
    displayName: "Medium-Dark Roast",
    abbreviation: "MD",
    description:
      "Roasted further to develop richer body and bittersweet notes, with less acidity.",
    effects: {
      sweetness: 0.75,
      acidity: -1,
      body: 1,
      balance: 0.25,
      bitterness: 1,
    },
  },
  dark: {
    displayName: "Dark Roast",
    abbreviation: "D",
    description: "Roast flavors completely dominate, smoky and bitter",
    effects: {
      sweetness: -1.5,
      acidity: -3.0,
      body: 0.5,
      balance: -1.5,
      bitterness: 3.0,
    },
  },
};

// Descriptions for characteristics and their taste impact
export const characteristicDescriptions = {
  acidity: {
    name: "Acidity",
    description: "Adds brightness and complexity, perceived as a lively, often fruity or citrusy note.",
    impact: (effect) => {
      if (effect > 0) return `Increases perceived brightness and a more vibrant, often fruity or citrusy taste.`;
      if (effect < 0) return `Decreases perceived brightness, resulting in a smoother, less vibrant taste.`;
      return `No significant change in perceived brightness or acidity notes.`;
    }
  },
  body: {
    name: "Body",
    description: "The weight or thickness of the coffee on your tongue, ranging from light and tea-like to heavy and syrupy.",
     impact: (effect) => {
      if (effect > 0) return `Increases the coffee's mouthfeel, making it feel heavier and more substantial on the tongue.`;
      if (effect < 0) return `Decreases the coffee's mouthfeel, making it feel lighter and less viscous.`;
      return `No significant change in the coffee's perceived body or texture.`;
    }
  },
  sweetness: {
    name: "Sweetness",
    description: "Natural sugary flavors, often perceived as fruity, caramel, or chocolate notes, balancing bitterness and acidity.",
     impact: (effect) => {
      if (effect > 0) return `Enhances the natural sugary flavors, adding notes like fruit, caramel, or chocolate and balancing other tastes.`;
      if (effect < 0) return `Reduces the natural sugary flavors, potentially making the coffee taste less balanced or slightly more bitter/acidic.`;
      return `No significant change in perceived sweetness.`;
    }
  },
  bitterness: {
    name: "Bitterness",
    description: "A primary taste sensation, often perceived at the back of the tongue, can range from pleasant (cocoa, dark chocolate) to harsh.",
     impact: (effect) => {
      if (effect > 0) return `Increases perceived bitterness, potentially introducing harsher notes depending on the level.`;
      if (effect < 0) return `Decreases perceived bitterness, resulting in a smoother, less astringent finish.`;
      return `No significant change in perceived bitterness.`;
    }
  },
  balance: {
    name: "Balance",
    description: "How well the different flavor characteristics (acidity, sweetness, bitterness) harmonize and interact.",
     impact: (effect) => {
      if (effect > 0) return `Improves the harmony and interaction between different flavors, leading to a more cohesive taste experience.`;
      if (effect < 0) return `Disrupts the harmony between flavors, potentially making certain characteristics stand out unpleasantly.`;
      return `No significant change in the overall harmony of flavors.`;
    }
  }
};

export function applyFullProcessingEffects(
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

export function applyRoastEffects(
  processedProfile,
  roastName,
  allRoastEffects
) {
  const method = allRoastEffects[roastName];

  if (!method) {
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

  const effect = method.effects;

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
export const ACTUAL_MAX_RAW = 9.192;

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

import { processingMethods } from './data/processing-methods.mjs';
import { roastLevelEffects } from './data/roast-levels.mjs';

export function applyFullProcessingEffects(
  baseProfile,
  processingName,
  allProcessingMethods,
) {
  const method = allProcessingMethods[processingName];

  if (!method) {
    throw new Error(`Processing method "${processingName}" not found.`);
  }
  const effect = method.effects;

  return {
    sweetness: Math.max(
      1,
      Math.min(10, baseProfile.sweetness + effect.sweetness),
    ),
    acidity: Math.max(1, Math.min(10, baseProfile.acidity + effect.acidity)),
    body: Math.max(1, Math.min(10, baseProfile.body + effect.body)),
    balance: Math.max(1, Math.min(10, baseProfile.balance + effect.balance)),
    bitterness: Math.max(
      1,
      Math.min(10, baseProfile.bitterness + effect.bitterness),
    ),
  };
}

export function applyRoastEffects(
  processedProfile,
  roastName,
  allRoastEffects,
) {
  const method = allRoastEffects[roastName];

  if (!method) {
    if (!method) {
      throw new Error(`Roast effect "${roastName}" not found.`);
    }
  }

  const effect = method.effects;

  const roastedProfile = {
    sweetness: Math.max(
      1,
      Math.min(10, processedProfile.sweetness + effect.sweetness),
    ),
    acidity: Math.max(
      1,
      Math.min(10, processedProfile.acidity + effect.acidity),
    ),
    body: Math.max(1, Math.min(10, processedProfile.body + effect.body)),
    balance: Math.max(
      1,
      Math.min(10, processedProfile.balance + effect.balance),
    ),
    bitterness: Math.max(
      1,
      Math.min(10, processedProfile.bitterness + effect.bitterness),
    ),
  };

  return roastedProfile;
}

export function createFinalProfile(initialProfile, processing, roast) {
  const processedProfile = applyFullProcessingEffects(
    initialProfile,
    processing,
    processingMethods,
  );

  const finalProfile = applyRoastEffects(
    processedProfile,
    roast,
    roastLevelEffects,
  );

  return finalProfile;
}

export function calculateLatteScore(profile) {
  return (
    scoreConfig.balance.weight(profile) +
    scoreConfig.balance.penalty(profile) +
    scoreConfig.body.weight(profile) +
    scoreConfig.body.penalty(profile) +
    scoreConfig.sweetness.weight(profile) +
    scoreConfig.sweetness.penalty(profile) +
    scoreConfig.acidity.weight(profile) +
    scoreConfig.acidity.penalty(profile) +
    scoreConfig.bitterness.weight(profile) +
    scoreConfig.bitterness.penalty(profile)
  );
}

export const scoreConfig = {
  balance: {
    weight: (profile) => profile.balance * 0.3,
    penalty: () => 0,
  },
  body: {
    weight: (profile) => profile.body * 0.3,
    penalty: () => 0,
  },
  sweetness: {
    weight: (profile) => profile.sweetness * 0.25,
    penalty: (profile) => {
      return profile.sweetness < 6 ? (6 - profile.sweetness) * -0.1 : 0;
    },
  },
  acidity: {
    weight: (profile) => Math.min(profile.acidity, 7) * 0.2,
    penalty: (profile) => {
      return profile.acidity > 7 ? (profile.acidity - 7) * -0.15 : 0;
    },
  },
  bitterness: {
    weight: () => 0,
    penalty: (profile) => {
      return profile.bitterness > 6 ? (profile.bitterness - 6) * -0.2 : 0;
    },
  },
};

export const ACTUAL_MIN_RAW = 2.975;
export const ACTUAL_MAX_RAW = 9.058;

// Reusable function to normalize the raw latte score
export function normalizeScore(rawScore) {
  const TARGET_DISPLAY_SCALE = 10;
  let normalizedLatteScore =
    ((rawScore - ACTUAL_MIN_RAW) / (ACTUAL_MAX_RAW - ACTUAL_MIN_RAW)) *
    TARGET_DISPLAY_SCALE;
  normalizedLatteScore = Math.max(
    0,
    Math.min(TARGET_DISPLAY_SCALE, normalizedLatteScore),
  );
  return normalizedLatteScore;
}

// Reusable function to get the compatibility grade based on normalized score
export function getCompatibilityGrade(normalizedScore) {
  if (normalizedScore >= 8.0) {
    return 'perfect';
  } else if (normalizedScore >= 6.0) {
    return 'good';
  } else {
    return 'bad';
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

export function getMinScoreForCountry(
  countryProfile,
  processingMethods,
  roastLevelEffects,
) {
  let minScore = Infinity;
  let worstCombination = {
    processing: '',
    roastLevel: '',
    score: 0,
  };
  Object.keys(processingMethods).forEach((processing) => {
    Object.keys(roastLevelEffects).forEach((roastLevel) => {
      const score = calculateLatteScore(
        createFinalProfile(countryProfile, processing, roastLevel),
      );
      if (score < minScore) {
        minScore = score;
        worstCombination = {
          processing,
          roastLevel,
          score,
        };
      }
    });
  });
  return { minScore, worstCombination };
}

export function getMaxScoreForCountry(
  countryProfile,
  processingMethods,
  roastLevelEffects,
) {
  let maxScore = -Infinity;
  let bestCombination = {
    processing: '',
    roastLevel: '',
    score: 0,
  };
  Object.keys(processingMethods).forEach((processing) => {
    Object.keys(roastLevelEffects).forEach((roastLevel) => {
      const score = calculateLatteScore(
        createFinalProfile(countryProfile, processing, roastLevel),
      );
      if (score > maxScore) {
        maxScore = score;
        bestCombination = {
          processing,
          roastLevel,
          score,
        };
      }
    });
  });
  return { maxScore, bestCombination };
}

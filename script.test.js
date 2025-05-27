import {
  calculateLatteScore,
  createFinalProfile,
  mergeProfiles,
  coffeeProfiles,
  processingMethods,
  roastLevelEffects,
  ACTUAL_MAX_RAW,
  ACTUAL_MIN_RAW
} from "./script.mjs";
import { expect, test } from "vitest";

test("Find maximum score for single origin", () => {
  let maxScore = -Infinity;
  let bestCombination = {
    country: "",
    processing: "",
    roastLevel: "",
    score: 0,
  };

  // Test all possible combinations
  Object.keys(coffeeProfiles).forEach((country) => {
    Object.keys(processingMethods).forEach((processing) => {
      Object.keys(roastLevelEffects).forEach((roastLevel) => {
        const score = calculateLatteScore(
          createFinalProfile(coffeeProfiles[country], processing, roastLevel)
        );
        if (score > maxScore) {
          maxScore = score;
          bestCombination = {
            country,
            processing,
            roastLevel,
            score,
          };
        }
      });
    });
  });

  console.log("Best Single Origin Combination:", bestCombination);
  expect(maxScore.toFixed(3)).toBe('9.213');
});

test("Find maximum score for blends", () => {
  let maxScore = -Infinity;
  let bestCombination = {
    country1: "",
    percent1: 0,
    country2: "",
    percent2: 0,
    processing: "",
    roastLevel: "",
    score: 0,
  };

  // Test all possible combinations with different proportions
  const countries = Object.keys(coffeeProfiles);
  const proportions = [10, 20, 30, 40, 50, 60, 70, 80, 90]; // Test different blend ratios

  for (let i = 0; i < countries.length; i++) {
    for (let j = i + 1; j < countries.length; j++) {
      const country1 = countries[i];
      const country2 = countries[j];

      proportions.forEach((percent1) => {
        const percent2 = 100 - percent1;

        Object.keys(processingMethods).forEach((processing) => {
          Object.keys(roastLevelEffects).forEach((roastLevel) => {
            const mergedProfile = mergeProfiles(
              coffeeProfiles[country1],
              percent1,
              coffeeProfiles[country2],
              percent2
            );

            const score = calculateLatteScore(
              createFinalProfile(mergedProfile, processing, roastLevel)
            );

            if (score > maxScore) {
              maxScore = score;
              bestCombination = {
                country1,
                percent1,
                country2,
                percent2,
                processing,
                roastLevel,
                score,
              };
            }
          });
        });
      });
    }
  }

  console.log("Best Blend Combination:", bestCombination);
  expect(maxScore.toFixed(3)).toBe(ACTUAL_MAX_RAW.toString());
});

test("Find minimum score for single origin", () => {
  let minScore = Infinity;
  let worstCombination = {
    country: "",
    processing: "",
    roastLevel: "",
    score: 0,
  };

  // Test all possible combinations
  Object.keys(coffeeProfiles).forEach((country) => {
    Object.keys(processingMethods).forEach((processing) => {
      Object.keys(roastLevelEffects).forEach((roastLevel) => {
        const score = calculateLatteScore(
          createFinalProfile(coffeeProfiles[country], processing, roastLevel)
        );
        if (score < minScore) {
          minScore = score;
          worstCombination = {
            country,
            processing,
            roastLevel,
            score,
          };
        }
      });
    });
  });

  console.log("Worst Single Origin Combination:", worstCombination);
  expect(minScore.toFixed(3)).toBe(ACTUAL_MIN_RAW.toString());
});

test("Find minimum score for blends", () => {
  let minScore = Infinity;
  let worstCombination = {
    country1: "",
    percent1: 0,
    country2: "",
    percent2: 0,
    processing: "",
    roastLevel: "",
    score: 0,
  };

  // Test all possible combinations with different proportions
  const countries = Object.keys(coffeeProfiles);
  const proportions = [10, 20, 30, 40, 50, 60, 70, 80, 90]; // Test different blend ratios

  for (let i = 0; i < countries.length; i++) {
    for (let j = i + 1; j < countries.length; j++) {
      const country1 = countries[i];
      const country2 = countries[j];

      proportions.forEach((percent1) => {
        const percent2 = 100 - percent1;

        Object.keys(processingMethods).forEach((processing) => {
          Object.keys(roastLevelEffects).forEach((roastLevel) => {
            const mergedProfile = mergeProfiles(
              coffeeProfiles[country1],
              percent1,
              coffeeProfiles[country2],
              percent2
            );

            const score = calculateLatteScore(
              createFinalProfile(mergedProfile, processing, roastLevel)
            );

            if (score < minScore) {
              minScore = score;
              worstCombination = {
                country1,
                percent1,
                country2,
                percent2,
                processing,
                roastLevel,
                score,
              };
            }
          });
        });
      });
    }
  }

  console.log("Worst Blend Combination:", worstCombination);
  expect(minScore.toFixed(3)).toBe('4.320');
});

import {
  calculateLatteScore,
  createFinalProfile,
  mergeProfiles,
  ACTUAL_MAX_RAW,
  ACTUAL_MIN_RAW,
  getMaxScoreForCountry,
  getMinScoreForCountry,
} from '../src/scoring.mjs';
import { expect, test } from 'vitest';
import { processingMethods } from '../src/data/processing-methods.mjs';
import { coffeeProfiles } from '../src/data/coffee-profiles.mjs';
import { roastLevelEffects } from '../src/data/roast-levels.mjs';
import { countryScores } from '../src/data/country-scores.mjs';

test('Find maximum score for single origin', () => {
  let maxScore = -Infinity;

  // Test all possible combinations
  Object.keys(coffeeProfiles).forEach((country) => {
    const { maxScore: tempMaxScore, bestCombination: tempBestCombination } =
      getMaxScoreForCountry(
        coffeeProfiles[country].profile,
        processingMethods,
        roastLevelEffects,
      );
    if (tempMaxScore > maxScore) {
      maxScore = tempMaxScore;
    }
  });

  expect(maxScore.toFixed(3)).toBe('9.275');
});

test('Find maximum score for blends', () => {
  let maxScore = -Infinity;

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
              coffeeProfiles[country1].profile,
              percent1,
              coffeeProfiles[country2].profile,
              percent2,
            );

            const score = calculateLatteScore(
              createFinalProfile(mergedProfile, processing, roastLevel),
            );

            if (score > maxScore) {
              maxScore = score;
            }
          });
        });
      });
    }
  }

  expect(maxScore.toFixed(3)).toBe(ACTUAL_MAX_RAW.toString());
});

test('Find minimum score for single origin', () => {
  let minScore = Infinity;

  // Test all possible combinations
  Object.keys(coffeeProfiles).forEach((country) => {
    const { minScore: tempMinScore, worstCombination: tempWorstCombination } =
      getMinScoreForCountry(
        coffeeProfiles[country].profile,
        processingMethods,
        roastLevelEffects,
      );
    if (tempMinScore < minScore) {
      minScore = tempMinScore;
    }
  });

  expect(minScore.toFixed(3)).toBe(ACTUAL_MIN_RAW.toString());
});

test('Find minimum score for blends', () => {
  let minScore = Infinity;

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
              coffeeProfiles[country1].profile,
              percent1,
              coffeeProfiles[country2].profile,
              percent2,
            );

            const score = calculateLatteScore(
              createFinalProfile(mergedProfile, processing, roastLevel),
            );

            if (score < minScore) {
              minScore = score;
            }
          });
        });
      });
    }
  }

  expect(minScore.toFixed(3)).toBe('3.070');
});

test('Coffee scores are in sync with coffee countries', () => {
  const coffeeCountries = Object.keys(coffeeProfiles);
  const coffeeScores = Object.keys(countryScores);
  expect(coffeeCountries.sort()).toEqual(coffeeScores.sort());
});

test('Calculated Coffee Scores are up-to-date', () => {
  const coffeeScores = Object.keys(countryScores);
  for (const country of coffeeScores) {
    const countryScore = countryScores[country];

    const { maxScore, bestCombination } = getMaxScoreForCountry(
      coffeeProfiles[country].profile,
      processingMethods,
      roastLevelEffects,
    );
    const { minScore, worstCombination } = getMinScoreForCountry(
      coffeeProfiles[country].profile,
      processingMethods,
      roastLevelEffects,
    );

    expect(countryScore.best.score, country).toBeCloseTo(maxScore);
    expect(countryScore.best.processing, country).toBe(
      bestCombination.processing,
    );
    expect(countryScore.best.roast, country).toBe(bestCombination.roastLevel);

    expect(countryScore.worst.score, country).toBeCloseTo(minScore);
    expect(countryScore.worst.processing, country).toBe(
      worstCombination.processing,
    );
    expect(countryScore.worst.roast, country).toBe(worstCombination.roastLevel);
  }
});

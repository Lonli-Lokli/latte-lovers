import {
  getMaxScoreForCountry,
  getMinScoreForCountry,
} from '../src/scoring.mjs';
import { expect, test } from 'vitest';
import { processingMethods } from '../src/data/processing-methods.mjs';
import { coffeeProfiles } from '../src/data/coffee-profiles.mjs';
import { roastLevelEffects } from '../src/data/roast-levels.mjs';
import { calculateMean, calculateSkewness, calculateStandardDeviation } from '../src/utils/math.mjs';


test('Ensure Min-Max Normalization is a correct way of normalization', () => {

  const scores = new Set();

  // Test all possible combinations
  Object.keys(coffeeProfiles).forEach((country) => {

     const { maxScore } = getMaxScoreForCountry(
      coffeeProfiles[country].profile,
      processingMethods,
      roastLevelEffects,
    );
    const { minScore } = getMinScoreForCountry(
      coffeeProfiles[country].profile,
      processingMethods,
      roastLevelEffects,
    );

    scores.add(maxScore);
    scores.add(minScore);
  });

  const skeweness = calculateSkewness(Array.from(scores));
  const mean = calculateMean(Array.from(scores));
  const standardDeviation = calculateStandardDeviation(Array.from(scores), mean);

  expect(skeweness).toBeCloseTo(-0.06);
  expect(Math.abs(skeweness)).toBeLessThan(0.5); // we must be sure that our data is symmetrical!
  expect(mean).toBeCloseTo(6.354);
  expect(standardDeviation).toBeCloseTo(2.341);
});
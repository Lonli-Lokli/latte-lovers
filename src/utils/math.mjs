/**
 * Calculates the mean (average) of an array of numbers.
 * @param {number[]} data - Array of numbers.
 * @returns {number} The mean of the data.
 */
export function calculateMean(data) {
  if (!data || data.length === 0) {
    return 0; // Or throw an error, depending on desired behavior
  }
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

/**
 * Calculates the standard deviation of an array of numbers.
 * @param {number[]} data - Array of numbers.
 * @param {number} [mean] - Optional pre-calculated mean to avoid re-computation.
 * @returns {number} The sample standard deviation.
 */
export function calculateStandardDeviation(data, mean) {
  if (!data || data.length < 2) {
    // Need at least 2 data points for sample stdev
    return 0; // Or throw an error
  }
  const dataMean = mean === undefined ? calculateMean(data) : mean;
  const n = data.length;

  const sumOfSquaredDifferences = data.reduce((acc, val) => {
    return acc + Math.pow(val - dataMean, 2);
  }, 0);

  return Math.sqrt(sumOfSquaredDifferences / (n - 1));
}

/**
 * Calculates the sample skewness of an array of numbers.
 * Uses the adjusted Fisher-Pearson standardized moment coefficient.
 * Assumes the input array contains numbers (e.g., scores between 0 and 10, or your raw latte scores).
 *
 * @param {number[]} data - An array of numbers.
 * @returns {number} The sample skewness. Returns NaN if data is insufficient.
 */
export function calculateSkewness(data) {
  if (!data || data.length < 3) {
    // Skewness is typically undefined or unreliable for very small samples.
    // n-1 and n-2 in the denominator means we need at least 3 points.
    console.warn('Skewness calculation requires at least 3 data points.');
    return NaN; // Or 0, or throw an error, depending on preference
  }

  const n = data.length;
  const mean = calculateMean(data);
  const stdDev = calculateStandardDeviation(data, mean);

  if (stdDev === 0) {
    // If standard deviation is 0, all values are the same.
    // Skewness is typically considered 0 or undefined in this case.
    // Let's return 0 as it's not skewed.
    return 0;
  }

  // Calculate sum of ((xi - mean) / stdDev) ^ 3
  const sumOfCubedStandardizedDeviations = data.reduce((acc, val) => {
    return acc + Math.pow((val - mean) / stdDev, 3);
  }, 0);

  // Apply the adjustment factor for sample skewness
  const skewness = (n / ((n - 1) * (n - 2))) * sumOfCubedStandardizedDeviations;

  // An alternative simpler formula for larger n (population skewness / moment skewness):
  // const simplerSkewness = (1 / n) * sumOfCubedStandardizedDeviations;
  // For large n (like 1700), the difference is small. The formula used above is more standard for samples.

  return skewness;
}

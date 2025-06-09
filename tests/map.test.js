import { coffeeProfiles } from '../src/scoring.mjs';
import * as topojson from 'topojson-client';
import { expect, test } from 'vitest';
import { countries110m as world } from '../src/data/countries-110m';
import { d3CountryNameNormilizer } from '../src/js/map.mjs';
import { coffeeProfiles } from '../src/data/coffee-profiles.mjs';

test('our coffee profiles are all available in d3 geo', () => {
  const coffeeCountries = Object.keys(coffeeProfiles);
  const d3Countries1 = topojson.feature(world, world.objects.countries);

  const d3Countries = d3Countries1.features.map((feature) =>
    d3CountryNameNormilizer(feature.properties.name),
  );

  coffeeCountries.forEach((country) => {
    expect(d3Countries).toContain(country);
  });
});

export const processingMethods = {
  washed: {
    displayName: 'Washed (Wet Process)',
    abbreviation: 'W',
    description:
      'Coffee cherries are pulped and fermented to remove the mucilage before drying',
    effects: {
      sweetness: 0,
      acidity: 1,
      body: -0.5, // Reduced penalty to reflect retained body in some washed coffees
      balance: 1,
      bitterness: 0,
    },
  },
  natural: {
    displayName: 'Natural (Dry Process)',
    abbreviation: 'N',
    description:
      'Coffee cherries are dried whole, allowing the fruit to naturally ferment',
    effects: {
      sweetness: 2,
      acidity: 0,
      body: 1,
      balance: -0.5,
      bitterness: 0,
    },
  },
  anaerobic: {
    displayName: 'Anaerobic Fermentation',
    abbreviation: 'A',
    description:
      'Beans are fermented in oxygen-free environments, often with additives, enhancing complex flavors',
    effects: {
      sweetness: 2.5,
      acidity: 1,
      body: 0.5,
      balance: 0,
      bitterness: 0,
    },
  },
  'white-honey': {
    displayName: 'White Honey',
    abbreviation: 'WHH',
    description:
      'Most mucilage removed (~80-100%), resulting in a clean, crisp profile similar to washed.',
    effects: {
      sweetness: 0.5,
      acidity: 0.5,
      body: 0,
      balance: 1,
      bitterness: 0,
    },
  },
  'yellow-honey': {
    displayName: 'Yellow Honey',
    abbreviation: 'YH',
    description:
      'Some mucilage removed (~50-75%), creating a balanced profile of sweetness and acidity.',
    effects: {
      sweetness: 1,
      acidity: 0,
      body: 0.5,
      balance: 1,
      bitterness: 0,
    },
  },
  'red-honey': {
    displayName: 'Red Honey',
    abbreviation: 'RH',
    description:
      'Less mucilage removed (~25-50%), developing deeper fruit notes and a creamier body.',
    effects: {
      sweetness: 1.5,
      acidity: 0,
      body: 1,
      balance: 0.5,
      bitterness: 0,
    },
  },
  'black-honey': {
    displayName: 'Black Honey',
    abbreviation: 'BH',
    description:
      'Almost all mucilage is left on, creating an intense, sweet, and fruit-forward cup similar to naturals.',
    effects: {
      sweetness: 2,
      acidity: 0,
      body: 1.5,
      balance: 0,
      bitterness: 0,
    },
  },
  'semi-washed': {
    displayName: 'Semi-Washed (Pulped Natural)',
    abbreviation: 'SW',
    description: 'Combines elements of both washed and natural processing',
    effects: {
      sweetness: 1,
      acidity: 0,
      body: 1,
      balance: 0.5,
      bitterness: 0,
    },
  },
  'wet-hulled': {
    displayName: 'Wet-Hulled (Giling Basah)',
    abbreviation: 'WH',
    description: 'Unique to Indonesia, beans are hulled while still wet',
    effects: {
      sweetness: 0.5, // Added to account for occasional fruit notes
      acidity: -1,
      body: 2,
      balance: 0,
      bitterness: 0,
    },
  },

  'carbonic-maceration': {
    displayName: 'Carbonic Maceration',
    abbreviation: 'CM',
    description:
      'Whole cherries are fermented in CO2-rich sealed tanks, producing fruit-forward profiles',
    effects: {
      sweetness: 2,
      acidity: 1.5,
      body: 0,
      balance: 1,
      bitterness: 0,
    },
  },
  monsooned: {
    displayName: 'Monsooned',
    abbreviation: 'M',
    description:
      'Beans are exposed to monsoon winds during drying, creating unique earthy flavors',
    effects: {
      sweetness: 0,
      acidity: -1,
      body: 2,
      balance: 0,
      bitterness: 1,
    },
  },
};

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
      acidity: -1,
      body: 1,
      balance: 0,
      bitterness: 0,
    },
  },
  honey: {
    displayName: 'Honey Process',
    abbreviation: 'HP',
    description:
      'Partial removal of the fruit pulp, leaving some mucilage during drying',
    effects: {
      sweetness: 1,
      acidity: 0,
      body: 0.5, // Added to reflect slight mouthfeel enhancement
      balance: 1,
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
      body: 0,
      balance: 0,
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
  anaerobic: {
    displayName: 'Anaerobic Fermentation',
    abbreviation: 'A',
    description:
      'Beans are fermented in oxygen-free environments, often with additives, enhancing complex flavors',
    effects: {
      sweetness: 2,
      acidity: 1,
      body: 0,
      balance: 0.5,
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
      acidity: 1,
      body: 0,
      balance: 0.5,
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

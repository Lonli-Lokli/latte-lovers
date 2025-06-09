export const roastLevelEffects = {
  light: {
    displayName: 'Light',
    abbreviation: 'L',
    description: 'Preserves origin character, bright and acidic',
    effects: {
      sweetness: 0.5,
      acidity: 1.5,
      body: -1.0,
      balance: -0.5,
      bitterness: -1.0,
    },
  },
  'light-medium': {
    displayName: 'Light-Medium',
    abbreviation: 'LM',
    description:
      'A balanced roast level, between light and medium, offering a blend of origin acidity and developing body and sweetness.',
    effects: {
      sweetness: 0.75,
      acidity: 0.25,
      body: -0.25,
      balance: 0.75,
      bitterness: 0,
    },
  },
  medium: {
    displayName: 'Medium',
    abbreviation: 'M',
    description: 'Balanced between origin and roast character',
    effects: {
      sweetness: 0.75,
      acidity: -0.75,
      body: 0.75,
      balance: 1.0,
      bitterness: 0.75,
    },
  },
  'medium-dark': {
    displayName: 'Medium-Dark',
    abbreviation: 'MD',
    description:
      'Roasted further to develop richer body and bittersweet notes, with less acidity.',
    effects: {
      sweetness: 0.75,
      acidity: -1,
      body: 1,
      balance: 0.25,
      bitterness: 1,
    },
  },
  dark: {
    displayName: 'Dark',
    abbreviation: 'D',
    description: 'Roast flavors completely dominate, smoky and bitter',
    effects: {
      sweetness: -1.5,
      acidity: -3.0,
      body: 0.5,
      balance: -1.5,
      bitterness: 3.0,
    },
  },
};

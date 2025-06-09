export const roastLevelEffects = {
  light: {
    displayName: 'Light',
    abbreviation: 'L',
    description: 'Preserves origin character, bright and acidic',
    effects: {
      sweetness: 0, // Sweetness is undeveloped. Only base potential exists.
      acidity: 0, // Maximum preservation of original acids. This is the baseline.
      body: -0.5, // Bean is least soluble, leading to a lighter perceived body.
      balance: -1.0, // Often unbalanced due to dominant, sharp acidity.
      bitterness: 0, // No significant roast-imparted bitterness is created.
    },
  },
  'light-medium': {
    displayName: 'Light-Medium',
    abbreviation: 'LM',
    description:
      'A balanced roast level, between light and medium, offering a blend of origin acidity and developing body and sweetness.',
    effects: {
      sweetness: 1.0, // Maillard reactions are actively creating sweetness.
      acidity: -0.5, // Delicate acids begin to degrade.
      body: 0.5, // Solubility and body are increasing from the baseline.
      balance: 0.5, // Acidity is tempered, increasing harmony.
      bitterness: 0.5, // First hints of roast-related bitterness develop.
    },
  },
  medium: {
    displayName: 'Medium',
    abbreviation: 'M',
    description: 'Balanced between origin and roast character',
    effects: {
      sweetness: 1.5, // Represents the generalized peak of caramelization.
      acidity: -1.5, // Significant acid degradation has occurred.
      body: 1.0, // Nearing peak solubility and developed body.
      balance: 1.5, // The generalized peak of harmony.
      bitterness: 1.0, // Clear but balanced roast-related bitterness.
    },
  },
  'medium-dark': {
    displayName: 'Medium-Dark',
    abbreviation: 'MD',
    description:
      'Roasted further to develop richer body and bittersweet notes, with less acidity.',
    effects: {
      sweetness: 0.5, // Sugars begin to carbonize, sweetness fades rapidly.
      acidity: -2.5, // Most origin acidity is gone.
      body: 1.5, // Peak body just before structural breakdown begins.
      balance: 0.5, // Balance decreases as roast notes dominate.
      bitterness: 2.0, // Bitterness is now a primary flavor note.
    },
  },
  dark: {
    displayName: 'Dark',
    abbreviation: 'D',
    description: 'Roast flavors completely dominate, smoky and bitter',
    effects: {
      sweetness: -2.0, // Sugars are carbonized, creating bitter notes instead.
      acidity: -4.0, // Origin acidity is effectively eliminated.
      body: -1.0, // Bean structure breaks down, body becomes thin and ashy.
      balance: -2.5, // Dominated by bitterness, very low balance.
      bitterness: 4.0, // Bitterness from carbonization is the defining trait.
    },
  },
};

// Descriptions for characteristics and their taste impact
export const characteristicDescriptions = {
  acidity: {
    name: 'Acidity',
    description:
      'Adds brightness and complexity, perceived as a lively, often fruity or citrusy note.',
    impact: (effect) => {
      if (effect > 0)
        return `Increases perceived brightness and a more vibrant, often fruity or citrusy taste.`;
      if (effect < 0)
        return `Decreases perceived brightness, resulting in a smoother, less vibrant taste.`;
      return `No significant change in perceived brightness or acidity notes.`;
    },
  },
  body: {
    name: 'Body',
    description:
      'The weight or thickness of the coffee on your tongue, ranging from light and tea-like to heavy and syrupy.',
    impact: (effect) => {
      if (effect > 0)
        return `Increases the coffee's mouthfeel, making it feel heavier and more substantial on the tongue.`;
      if (effect < 0)
        return `Decreases the coffee's mouthfeel, making it feel lighter and less viscous.`;
      return `No significant change in the coffee's perceived body or texture.`;
    },
  },
  sweetness: {
    name: 'Sweetness',
    description:
      'Natural sugary flavors, often perceived as fruity, caramel, or chocolate notes, balancing bitterness and acidity.',
    impact: (effect) => {
      if (effect > 0)
        return `Enhances the natural sugary flavors, adding notes like fruit, caramel, or chocolate and balancing other tastes.`;
      if (effect < 0)
        return `Reduces the natural sugary flavors, potentially making the coffee taste less balanced or slightly more bitter/acidic.`;
      return `No significant change in perceived sweetness.`;
    },
  },
  bitterness: {
    name: 'Bitterness',
    description:
      'A primary taste sensation, often perceived at the back of the tongue, can range from pleasant (cocoa, dark chocolate) to harsh.',
    impact: (effect) => {
      if (effect > 0)
        return `Increases perceived bitterness, potentially introducing harsher notes depending on the level.`;
      if (effect < 0)
        return `Decreases perceived bitterness, resulting in a smoother, less astringent finish.`;
      return `No significant change in perceived bitterness.`;
    },
  },
  balance: {
    name: 'Balance',
    description:
      'How well the different flavor characteristics (acidity, sweetness, bitterness) harmonize and interact.',
    impact: (effect) => {
      if (effect > 0)
        return `Improves the harmony and interaction between different flavors, leading to a more cohesive taste experience.`;
      if (effect < 0)
        return `Disrupts the harmony between flavors, potentially making certain characteristics stand out unpleasantly.`;
      return `No significant change in the overall harmony of flavors.`;
    },
  },
};

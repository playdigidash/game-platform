export class FeatureValidator {
    static validateUsage(planFeatures, userUsage) {
      if (userUsage.maxQuestions >= planFeatures.maxQuestions) {
        return 'Question limit reached';
      }
      if (userUsage.maxStorage >= planFeatures.maxStorage) {
        return 'Storage limit reached';
      }
      if (userUsage.maxGames >= planFeatures.maxGames) {
        return 'Game creation limit reached';
      }
      // Additional checks for other features...
      return null;
    }
  }
  
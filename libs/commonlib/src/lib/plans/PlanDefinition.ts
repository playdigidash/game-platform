/**
 * Feature definitions for subscription plans
 */

export interface IPlanProps {
  mode: 'dashboard' | 'game-platform';
  redirectUrl?: string;
  title?: string;
}

// export interface IPlanActionHandlers {
//   handleSubscribe: (planId: string) => void;
//   handleDowngrade: () => void;
// }

export interface IFeatureDefinition {
  featureId: string;
  title: string;
  tooltip: string;
  isTopFeature?: boolean;
  group?: string;
  valueType: string;
  order: number;
}

export interface IPlan {
  planId: string;
  name: string;
  originalPrice: number;
  discountPrice: number | null;
  planMonths: number;
  planYears: number;
  stripePriceId: string;
}

export interface IPlanFeatureMapping {
  planId: string;
  featureId: string;
  availability: boolean;
  limit: string | number;
}

export interface MappedFeature {
  featureKey: string;
  featureValue: boolean | number | string;
  title: string;
  tooltip: string;
  isTopFeature: boolean;
  group: string;
  isIncluded: boolean;
}

export interface PlanWithFeatures {
  planId: string;
  name: string;
  originalPrice: number;
  discountPrice: number | null;
  features: MappedFeature[];
  groupedFeatures: Record<string, MappedFeature[]>;
  stripePriceId: string;
}

export const FEATURE_GROUPS = {
  GAMEPLAY: 'Gameplay & Customization',
  HEROES: 'Heroes & Obstacles',
  TRIVIA: 'Trivia & Question Management',
  BRANDING: 'Branding & White-labeling',
  ANALYTICS: 'Reports & Analytics',
  SECURITY: 'Security & Integrations',
  TEAMS: 'Teams & Collaboration',
  SUPPORT: 'Customer Support & Success',
  CONTENT: 'Content Creation',
  ADVANCED: 'Advanced Features',
};

export interface FeaturesByGroup {
  [groupId: string]: {
    groupName: string;
    features: Array<{
      featureId: string;
      definition: IFeatureDefinition;
      value: MappedFeature;
    }>;
  };
}

// export const FEATURE_DEFINITIONS: Record<string, IFeatureDefinition> = {
//   // Gameplay & Customization features
//   gameLimit: {
//     featureId: 'gameLimit',
//     title: 'Games',
//     tooltip: 'Number of games you can create',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'number',
//     order: 1
//   },
//   questionLibraryLimit: {
//     featureId: 'questionLibraryLimit',
//     title: 'Questions in Library',
//     tooltip: 'Maximum number of questions you can add to your library',
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'number',
//     order: 2
//   },
//   multiplayerLimit: {
//     featureId: 'multiplayerLimit',
//     title: 'Monthly Active Players',
//     tooltip: 'Number of unique players who can play your games each month',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'number',
//     order: 3
//   },
//   teamSize: {
//     featureId: 'teamSize',
//     title: 'Team Members',
//     tooltip: 'Number of team members who can collaborate on your games',
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'number',
//     order: 4
//   },
//   customBranding: {
//     featureId: 'customBranding',
//     title: 'Custom Branding',
//     tooltip: 'Add your own logo and customize the appearance of your games',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'boolean',
//     order: 5
//   },
//   whiteLabel: {
//     featureId: 'whiteLabel',
//     title: 'White Labeling',
//     tooltip: 'Remove all Learn Verse branding from your games',
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'boolean',
//     order: 6
//   },
//   customDomain: {
//     featureId: 'customDomain',
//     title: 'Custom Domain',
//     tooltip: 'Host your games on your own domain',
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'boolean',
//     order: 7
//   },
//   gameModes: {
//     featureId: 'gameModes',
//     title: 'Game Modes',
//     tooltip: 'Access to different game modes and templates',
//     group: FEATURE_GROUPS.GAMEPLAY,
//     valueType: 'number',
//     order: 8
//   },

//   // Content Creation features
//   contentGeneration: {
//     featureId: 'contentGeneration',
//     title: 'AI Content Generation',
//     tooltip: 'Generate questions and content using AI',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.CONTENT,
//     valueType: 'boolean',
//     order: 9
//   },
//   imageUpload: {
//     featureId: 'imageUpload',
//     title: 'Image Upload',
//     tooltip: 'Add images to your questions and games',
//     group: FEATURE_GROUPS.CONTENT,
//     valueType: 'boolean',
//     order: 10
//   },
//   imageGeneration: {
//     featureId: 'imageGeneration',
//     title: 'AI Image Generation',
//     tooltip: 'Generate images for your games using AI',
//     group: FEATURE_GROUPS.CONTENT,
//     valueType: 'number',
//     order: 11
//   },
//   videoUpload: {
//     featureId: 'videoUpload',
//     title: 'Video Upload',
//     tooltip: 'Add videos to your questions and games',
//     group: FEATURE_GROUPS.CONTENT,
//     valueType: 'boolean',
//     order: 12
//   },
//   audioUpload: {
//     featureId: 'audioUpload',
//     title: 'Audio Upload',
//     tooltip: 'Add audio to your questions and games',
//     group: FEATURE_GROUPS.CONTENT,
//     valueType: 'boolean',
//     order: 13
//   },

//   // Analytics & Insights features
//   basicAnalytics: {
//     featureId: 'basicAnalytics',
//     title: 'Basic Analytics',
//     tooltip: 'View basic performance metrics for your games',
//     group: FEATURE_GROUPS.ANALYTICS,
//     valueType: 'boolean',
//     order: 14
//   },
//   advancedAnalytics: {
//     featureId: 'advancedAnalytics',
//     title: 'Advanced Analytics',
//     tooltip: 'Access detailed analytics and insights',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.ANALYTICS,
//     valueType: 'boolean',
//     order: 15
//   },
//   exportData: {
//     featureId: 'exportData',
//     title: 'Data Export',
//     tooltip: 'Export analytics data for further analysis',
//     group: FEATURE_GROUPS.ANALYTICS,
//     valueType: 'boolean',
//     order: 16
//   },
//   playerReports: {
//     featureId: 'playerReports',
//     title: 'Player Performance Reports',
//     tooltip: 'Detailed reports on individual player performance',
//     group: FEATURE_GROUPS.ANALYTICS,
//     valueType: 'boolean',
//     order: 17
//   },

//   // Advanced Features
//   apiAccess: {
//     featureId: 'apiAccess',
//     title: 'API Access',
//     tooltip: 'Integrate with our API for custom solutions',
//     group: FEATURE_GROUPS.ADVANCED,
//     valueType: 'boolean',
//     order: 18
//   },
//   webhooks: {
//     featureId: 'webhooks',
//     title: 'Webhooks',
//     tooltip: 'Set up webhooks for real-time event notifications',
//     group: FEATURE_GROUPS.ADVANCED,
//     valueType: 'boolean',
//     order: 19
//   },
//   sso: {
//     featureId: 'sso',
//     title: 'Single Sign-On',
//     tooltip: 'Implement SSO for seamless authentication',
//     group: FEATURE_GROUPS.ADVANCED,
//     valueType: 'boolean',
//     order: 20
//   },
//   lmsIntegration: {
//     featureId: 'lmsIntegration',
//     title: 'LMS Integration',
//     tooltip: 'Integrate with Learning Management Systems',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.ADVANCED,
//     valueType: 'boolean',
//     order: 21
//   },

//   // Support & Resources features
//   emailSupport: {
//     featureId: 'emailSupport',
//     title: 'Email Support',
//     tooltip: 'Get help via email',
//     group: FEATURE_GROUPS.SUPPORT,
//     valueType: 'boolean',
//     order: 22
//   },
//   prioritySupport: {
//     featureId: 'prioritySupport',
//     title: 'Priority Support',
//     tooltip: 'Get faster response times and dedicated support',
//     group: FEATURE_GROUPS.SUPPORT,
//     valueType: 'boolean',
//     order: 23
//   },
//   dedicatedManager: {
//     featureId: 'dedicatedManager',
//     title: 'Dedicated Account Manager',
//     tooltip: 'Work with a dedicated account manager for personalized support',
//     isTopFeature: true,
//     group: FEATURE_GROUPS.SUPPORT,
//     valueType: 'boolean',
//     order: 24
//   },
//   onboarding: {
//     featureId: 'onboarding',
//     title: 'Personalized Onboarding',
//     tooltip: 'Get personalized onboarding and training',
//     group: FEATURE_GROUPS.SUPPORT,
//     valueType: 'boolean',
//     order: 25
//   },
//   training: {
//     featureId: 'training',
//     title: 'Training Sessions',
//     tooltip: 'Access to training sessions and workshops',
//     group: FEATURE_GROUPS.SUPPORT,
//     valueType: 'boolean',
//     order: 26
//   }
// };

// export default FEATURE_DEFINITIONS;

// // // Plan definitions that refer to FEATURE_DEFINITIONS for titles and tooltips
// // export const PLAN_DEFINITIONS = [
// //   {
// //     planId: "free_plan",
// //     name: "Free Plan",
// //     originalPrice: 0, // ORIGINAL PRICE TO DISPLAY WITH A STRIKE-THROUGH
// //     discountPrice: null,
// //       features: {
// //       maxQuestions: { value: 200 },
// //       maxStorage: { value: 104857600 }, // 100 MB
// //       maxGames: { value: 3 },
// //       totalPlays: { value: 500 },
// //       imgGen: { value: 10 },
// //       triviaGen: { value: 50 },
// //       "3dGen": { value: 1 }
// //     },
// //     planYears: 1,
// //     planMonths: 12,
// //     stripePriceId: "price_free_plan",
// //     planStartDate: new Date(),
// //     planEndDate: new Date(new Date().setMonth(new Date().getMonth() + 12))
// //   },
// //   {
// //     planId: "starter_plan",
// //     name: "Starter Plan",
// //     originalPrice: 39.99, // ORIGINAL PRICE TO DISPLAY WITH A STRIKE-THROUGH
// //     discountPrice: null,  // NEW DISCOUNTED PRICE
// //     features: {
// //       maxQuestions: { value: 1000 },
// //       maxStorage: { value: 1073741824 }, // 1 GB
// //       maxGames: { value: 10 },
// //       totalPlays: { value: 10000 },
// //       imgGen: { value: 100 },
// //       triviaGen: { value: 500 },
// //       "3dGen": { value: 25 }
// //     },
// //     planYears: 1,
// //     planMonths: 12,
// //     stripePriceId: "price_1PeQvvFiru7V2hcaYSTqvK7d",
// //     planStartDate: new Date(),
// //     planEndDate: new Date(new Date().setMonth(new Date().getMonth() + 12))
// //   },
// //   {
// //     planId: "pro_plan",
// //     name: "Pro Plan",
// //     originalPrice: 99.99, // ORIGINAL PRICE TO DISPLAY WITH A STRIKE-THROUGH
// //     discountPrice: 59.99,  // NEW DISCOUNTED PRICE    features: {
// //       features: {
// //       maxQuestions: { value: 5000 },
// //       maxStorage: { value: 5368709120 }, // 5 GB
// //       maxGames: { value: 50 },
// //       totalPlays: { value: 50000 },
// //       imgGen: { value: 500 },
// //       triviaGen: { value: 2500 },
// //       "3dGen": { value: 100 }
// //     },
// //     planYears: 1,
// //     planMonths: 12,
// //     stripePriceId: "price_1PeQxuFiru7V2hca4QkjPGkx",
// //     planStartDate: new Date(),
// //     planEndDate: new Date(new Date().setMonth(new Date().getMonth() + 12))
// //   }
// // ];

// // export default PLAN_DEFINITIONS;
// /**
//  * Type definitions for subscription plans
//  */

// /**
//  * Represents a pricing plan in the system
//  */

// /**
//  * Represents a mapped feature value with display formatting
//  */
// export interface MappedFeatureValue {
//   value: boolean | number | string | undefined;
//   displayValue: string | null;
// }

// /**
//  * Grouped features by feature group
//  */

// /**
//  * Represents a plan with additional mapped display data
//  */
// export interface MappedPlan extends IPlan {
//   mappedFeatures: Record<string, MappedFeatureValue>;
//   featuresByGroup: FeaturesByGroup;
// }

// /**
//  * Plans organized by category
//  */
// export interface PlansByCategory {
//   [category: string]: IPlan[];
// }

// /**
//  * Feature type for display mapping
//  */
// export type FeatureValueType = 'boolean' | 'number' | 'string';

// /**
//  * Function type for formatting feature values
//  */
// export type FeatureValueFormatter = (value: number | string) => string;

// /**
//  * Mapping between plan features and their display configuration
//  */
// // export interface PlanFeatureMapping {
// //   featureId: string;
// //   valueType: FeatureValueType;
// //   valueFormatter?: FeatureValueFormatter;
// // }

// /**
//  * Type for billing periods
//  */
// export type BillingPeriod = 'monthly' | 'yearly';

// /**
//  * Plan comparison selection
//  */
// export interface PlanSelection {
//   planId: string;
//   billingPeriod: BillingPeriod;
// }

// /**
//  * Subscription provider options
//  */
// export type SubscriptionProvider = 'stripe' | 'paddle' | 'manual' | 'none';

// export interface SubscriptionDetails {
//   planId: string;
//   status: string;
//   currentPeriodEnd: number;
//   cancelAtPeriodEnd: boolean;
//   billingPlatform: 'stripe' | 'paddle' | string;
//   subscriptionId?: string;
//   trialEnd?: number;
// }

// // Types for billing service
// export interface SubscriptionResult {
//   success: boolean;
//   message: string;
//   url?: string;
//   error?: any;
// }

import { MappedPlan, Plan, PlanFeatureMapping, PlansByCategory } from './PlanModels';

/**
 * Gets a feature value (boolean, number, string) for a given plan
 */
export const getFeatureValue = (plan: Plan, featureId: string): boolean | number | string | undefined => {
  if (!plan.features) return undefined;
  
  const feature = plan.features[featureId];
  if (feature === undefined) return undefined;
  
  return feature;
};

/**
 * Checks if a feature is available in a plan (boolean features)
 */
export const hasFeature = (plan: Plan, featureId: string): boolean => {
  const value = getFeatureValue(plan, featureId);
  return !!value;
};

/**
 * Gets a numeric feature value with a default value if not found
 */
export const getNumericFeature = (plan: Plan, featureId: string, defaultValue = 0): number => {
  const value = getFeatureValue(plan, featureId);
  if (typeof value === 'number') return value;
  return defaultValue;
};

/**
 * Gets a string feature value with a default value if not found
 */
export const getStringFeature = (plan: Plan, featureId: string, defaultValue = ''): string => {
  const value = getFeatureValue(plan, featureId);
  if (typeof value === 'string') return value;
  return defaultValue;
};

/**
 * Maps raw plan data with feature definitions for display
 */
export const mapPlansWithFeatures = (
  plans: Plan[],
  featureMappings: PlanFeatureMapping[]
): MappedPlan[] => {
  return plans.map(plan => {
    // Map each feature to its display value
    const mappedFeatures = featureMappings.reduce((acc, mapping) => {
      const { featureId, valueType, valueFormatter } = mapping;
      const value = getFeatureValue(plan, featureId);
      
      let displayValue: string | null = null;
      
      if (value !== undefined) {
        if (valueType === 'boolean') {
          displayValue = value ? 'Yes' : 'No';
        } else if (valueType === 'number') {
          if (typeof value === 'number') {
            displayValue = valueFormatter ? valueFormatter(value) : value.toString();
          }
        } else if (valueType === 'string') {
          if (typeof value === 'string') {
            displayValue = valueFormatter ? valueFormatter(value) : value;
          }
        }
      }
      
      return {
        ...acc,
        [featureId]: {
          value,
          displayValue
        }
      };
    }, {});
    
    return {
      ...plan,
      mappedFeatures
    };
  });
};

/**
 * Groups plans by category for display
 */
export const groupPlansByCategory = (plans: Plan[]): PlansByCategory => {
  return plans.reduce((acc, plan) => {
    const category = plan.category || 'default';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(plan);
    return acc;
  }, {} as PlansByCategory);
};

/**
 * Formats a plan price for display
 */
export const formatPlanPrice = (price: number, billingPeriod: string): string => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
  
  return `${formattedPrice}/${billingPeriod === 'monthly' ? 'mo' : 'yr'}`;
};

/**
 * Formats an unlimited value for display
 */
export const formatUnlimited = (value: number): string => {
  return value === -1 ? 'Unlimited' : value.toString();
};

/**
 * Formats a team size value for display
 */
export const formatTeamSize = (value: number): string => {
  return value === 1 ? '1 user' : `${value} users`;
};

/**
 * Checks if a plan is free
 */
export const isPlanFree = (plan: Plan): boolean => {
  return plan.price === 0;
};

/**
 * Gets the most suitable Stripe price ID for a plan
 */
export const getStripePriceId = (plan: Plan, billingPeriod: string): string | undefined => {
  if (!plan.stripe) return undefined;
  return billingPeriod === 'monthly' 
    ? plan.stripe.monthlyPriceId 
    : plan.stripe.yearlyPriceId;
};

/**
 * Gets the most suitable Paddle price ID for a plan
 */
export const getPaddlePriceId = (plan: Plan, billingPeriod: string): string | undefined => {
  if (!plan.paddle) return undefined;
  return billingPeriod === 'monthly' 
    ? plan.paddle.monthlyPriceId 
    : plan.paddle.yearlyPriceId;
}; 
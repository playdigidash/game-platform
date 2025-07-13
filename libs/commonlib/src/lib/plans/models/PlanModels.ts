/**
 * Type definitions for subscription plans
 */

import { Document, ObjectId } from 'bson';
import { FeatureDefinition } from '../PlanDefinition';

/**
 * Represents a pricing plan in the system
 */
export interface Plan {
  _id: ObjectId;
  planId: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  category: string;
  features: Record<string, boolean | number | string>;
  stripe?: {
    priceId: string;
    productId: string;
    monthlyPriceId?: string;
    yearlyPriceId?: string;
  };
  paddle?: {
    planId: string;
    monthlyPriceId?: string;
    yearlyPriceId?: string;
  };
  isPopular?: boolean;
  isEnterprise?: boolean;
  customCTA?: string;
  customCTALink?: string;
  hidden?: boolean;
  order?: number;
}

/**
 * Represents a mapped feature value with display formatting
 */
export interface MappedFeatureValue {
  value: boolean | number | string | undefined;
  displayValue: string | null;
}

/**
 * Grouped features by feature group
 */
export interface FeaturesByGroup {
  [groupId: string]: {
    groupName: string;
    features: Array<{
      featureId: string;
      definition: FeatureDefinition;
      value: MappedFeatureValue;
    }>;
  };
}

/**
 * Represents a plan with additional mapped display data
 */
export interface MappedPlan extends Plan {
  mappedFeatures: Record<string, MappedFeatureValue>;
  featuresByGroup: FeaturesByGroup;
}

/**
 * Plans organized by category
 */
export interface PlansByCategory {
  [category: string]: Plan[];
}

/**
 * Feature type for display mapping
 */
export type FeatureValueType = 'boolean' | 'number' | 'string';

/**
 * Function type for formatting feature values
 */
export type FeatureValueFormatter = (value: number | string) => string;

/**
 * Mapping between plan features and their display configuration
 */
// export interface PlanFeatureMapping {
//   featureId: string;
//   valueType: FeatureValueType;
//   valueFormatter?: FeatureValueFormatter;
// }

/**
 * Type for billing periods
 */
export type BillingPeriod = 'monthly' | 'yearly';

/**
 * Plan comparison selection
 */
export interface PlanSelection {
  planId: string;
  billingPeriod: BillingPeriod;
}

/**
 * Subscription provider options
 */
export type SubscriptionProvider = 'stripe' | 'paddle' | 'manual' | 'none';

// export interface PlanFeatureMapping extends Document {
//   _id: ObjectId;
//   planId: string;
//   featureId: string;
//   value: string | number | boolean;
// }

export interface SubscriptionDetails {
  planId: string;
  status: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  billingPlatform: 'stripe' | 'paddle' | string;
  subscriptionId?: string;
  trialEnd?: number;
}

// Types for billing service
export interface SubscriptionResult {
  success: boolean;
  message: string;
  url?: string;
  error?: any;
} 
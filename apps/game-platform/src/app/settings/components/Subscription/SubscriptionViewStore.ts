import { makeAutoObservable, action } from 'mobx';
import {
  getCachedPlans,
  getCachedFeatures,
  getCachedPlanFeatureMappings,
  IFeatureDefinition,
  IPlan,
  IPlanFeatureMapping,
} from '@lidvizion/commonlib';
import { RootStore } from '../../../RootStore/RootStore';

// interface Plan {
//   planId: string;
//   name: string;
//   originalPrice: number;
//   discountPrice: number | null;
//   planMonths: number;
//   planYears: number;
//   stripePriceId: string;
// }

// Define plan-feature mapping interface
interface PlanFeatureMapping {
  planId: string;
  featureId: string;
  availability: boolean;
  limit: string | number;
}

// Define the Feature interface
interface Feature {
  featureId: string;
  title: string;
  tooltip: string;
  isTopFeature: boolean;
  group: string;
}

export class SubscriptionViewStore {
  root: RootStore;
  plans: IPlan[] = [];
  features: IFeatureDefinition[] = [];
  planFeatureMappings: IPlanFeatureMapping[] = [];
  redirectUrl = 'https://create.playdigidash.io/AppSettings/#usage';
  
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  async fetchPlansAndFeatures(): Promise<void> {
    console.log('[FEATURES][ViewStore] Starting plan and feature fetch operation');
    try {
      const database = this.root.db;
      
      console.log('[FEATURES][ViewStore] Requesting plans from MongoDB');
      const plansResult = await getCachedPlans(database);
      
      console.log('[FEATURES][ViewStore] Requesting features from MongoDB');
      const featuresResult = await getCachedFeatures(database);
      
      console.log('[FEATURES][ViewStore] Requesting feature mappings from MongoDB');
      const featureMappingsResult = await getCachedPlanFeatureMappings(database);
      
      console.log('[FEATURES][ViewStore] Processing fetched data');
      
      action(() => {
        if (Array.isArray(plansResult)) {
          // Filter out Teams plan (planId = 3) and any other plans that shouldn't be shown
          this.plans = plansResult.filter(plan => {
            // Filter out Team Plan (planId = 3)
            // Also filter out any plan with ID greater than 4 (for future plans that might be in dev)
            return plan.planId !== "3";
          });
          console.log('[FEATURES][ViewStore] Fetched plans:', this.plans.length);
          console.log('[FEATURES][ViewStore] Plan IDs:', this.plans.map(p => p.planId).join(', '));
        } else {
          console.error('[FEATURES][ViewStore] Unexpected result format from MongoDB for plans:', plansResult);
          this.plans = [];
        }
        
        // Set features from database
        if (Array.isArray(featuresResult) && featuresResult.length > 0) {
          console.log('[FEATURES][ViewStore] Feature result data type:', typeof featuresResult);
          console.log('[FEATURES][ViewStore] First feature sample:', JSON.stringify(featuresResult[0], null, 2));
          
          try {
            this.features = featuresResult as IFeatureDefinition[];
            console.log('[FEATURES][ViewStore] Assigned features:', this.features.length);
            console.log('[FEATURES][ViewStore] Feature IDs:', this.features.map(f => f.featureId).join(', '));
            
            // Check if features are conforming to IFeatureDefinition interface
            const missingFields = this.features.filter(f => 
              !f.featureId || !f.title || f.valueType === undefined
            );
            
            if (missingFields.length > 0) {
              console.warn('[FEATURES][ViewStore] Some features missing required fields:', 
                missingFields.map(f => f.featureId || 'unknown').join(', '));
            }
          } catch (parseError) {
            console.error('[FEATURES][ViewStore] Error parsing feature data:', parseError);
            this.features = [];
          }
        } else {
          console.error('[FEATURES][ViewStore] No features found in database or invalid format');
          console.log('[FEATURES][ViewStore] Features result:', featuresResult);
          this.features = [];
        }
        
        // Set feature mappings from database
        if (Array.isArray(featureMappingsResult) && featureMappingsResult.length > 0) {
          this.planFeatureMappings = featureMappingsResult;
          console.log('[FEATURES][ViewStore] Fetched feature mappings:', this.planFeatureMappings.length);
          
          // Check for mappings that reference non-existent features
          const featureIds = new Set(this.features.map(f => f.featureId));
          const invalidMappings = this.planFeatureMappings.filter(m => !featureIds.has(m.featureId));
          
          if (invalidMappings.length > 0) {
            console.warn('[FEATURES][ViewStore] Mappings reference non-existent features:', 
              invalidMappings.map(m => `${m.planId}:${m.featureId}`).join(', '));
          }
        } else {
          console.warn('[FEATURES][ViewStore] No feature mappings found in database');
          this.planFeatureMappings = [];
        }
      })();
    } catch (error) {
      console.error('[FEATURES][ViewStore] Error fetching plan data from MongoDB:', error);
      console.error('[FEATURES][ViewStore] Error details:', JSON.stringify(error, null, 2));
    }
  }
  
  get allPlansWithFeatures() {
    console.log('[FEATURES][ViewStore] Building plans with features');
    
    return this.plans.map((plan) => {
      const {
        originalPrice,
        discountPrice,
        planId,
        name,
        stripePriceId,
      } = plan;

      console.log(`[FEATURES][ViewStore] Processing plan: ${planId} - ${name}`);

      // Get all feature mappings for this plan
      const planMappings = this.planFeatureMappings.filter(
        mapping => mapping.planId === planId
      );
      
      console.log(`[FEATURES][ViewStore] Found ${planMappings.length} mappings for plan ${planId}`);
      
      // Map features using the feature mappings
      const mappedFeatures = this.features.map((feature) => {
        // Find if this feature is mapped to the current plan
        const mapping = planMappings.find(
          mapping => String(mapping.featureId) === String(feature.featureId)
        );
        
        // Debug logging for feature mappings
        if (planId === "1" && feature.isTopFeature) {
          console.log(`[FEATURES][ViewStore] Feature mapping check for top feature: ${feature.featureId} (${feature.title})`, 
            mapping ? `Found matching mapping with value: ${mapping.limit}` : "No mapping found");
        }
        
        // Determine feature value based on mapping
        let featureValue: boolean | number | string = false;
        if (mapping) {
          if (mapping.limit === "Yes") {
            featureValue = true;
          } else {
            featureValue = mapping.limit;
          }
        }
        
        return {
          featureKey: feature.featureId,
          featureValue,
          title: feature.title || '',
          tooltip: feature.tooltip || '',
          isTopFeature: feature.isTopFeature || false,
          group: feature.group || '',
          isIncluded: !!mapping,
        };
      });
      
      console.log(`[FEATURES][ViewStore] Mapped ${mappedFeatures.length} features for plan ${planId}`);
      
      // Group features by category
      const groupedFeatures = mappedFeatures.reduce((acc, feature) => {
        const group = feature.group as string;
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(feature);
        return acc;
      }, {} as Record<string, typeof mappedFeatures>);
  
      console.log(`[FEATURES][ViewStore] Created ${Object.keys(groupedFeatures).length} feature groups for plan ${planId}`);
      
      return {
        planId,
        name,
        originalPrice,
        discountPrice,
        features: mappedFeatures,
        groupedFeatures,
        stripePriceId,
      };
    });
  }
  
  // For game-platform, we redirect to dashboard for subscription management
  handleSubscribe = (planId: string): void => {
    // Redirect to dashboard with the selected plan
    window.location.href = `${this.redirectUrl}?planId=${planId}`;
  }

  // Downgrade handler
  handleDowngrade = (): void => {
    window.location.href = `${this.redirectUrl}?action=downgrade`;
  }

  // Get the user's current plan ID
  getUserPlanId(): string | undefined {
    try {
      // Game users don't have a plan property directly in the IGameUserModel
      // For demo/UI purposes, we'll default to planId "1" (free plan) if not found
      return "1"; // Default to free plan for the game-platform UI
    } catch (error) {
      console.error('Error getting user plan ID:', error);
      return undefined;
    }
  }
}

export default SubscriptionViewStore; 
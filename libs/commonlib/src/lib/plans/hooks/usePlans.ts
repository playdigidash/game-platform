import { useCallback, useEffect, useState } from 'react';
import { Plan, PlanFeatureMapping, PlanWithFeatures } from '../types/PlanTypes';
import { BillingService } from '../../billing/BillingService';
import { FeatureDefinition, FEATURE_DEFINITIONS } from '../PlanDefinition';
import { getPlans } from '../PlanService';

interface UsePlansParams {
  mode: 'dashboard' | 'game-platform';
  redirectUrl?: string;
  db?: Realm.Services.MongoDBDatabase;
  user?: {
    email?: string;
    uid?: string;
    plan?: {
      planId?: string;
      subId?: string;
      currentSubMonth?: Date;
    };
  };
}

export function usePlans({ 
  mode, 
  redirectUrl = 'https://create.playdigidash.io/AppSettings/#usage',
  db,
  user
}: UsePlansParams) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<Record<string, FeatureDefinition>>(FEATURE_DEFINITIONS);
  const [planFeatureMappings, setPlanFeatureMappings] = useState<PlanFeatureMapping[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch plans and feature mappings
  useEffect(() => {
    if (db) {
      fetchPlansAndFeatures();
    }
  }, [db]);

  const fetchPlansAndFeatures = async () => {
    if (!db) return;

    setLoading(true);
    try {
      const plansResult = await getPlans(db);
      if (Array.isArray(plansResult)) {
        // Filter out Teams plan (planId = 3)
        setPlans(plansResult.filter(plan => plan.planId !== "3"));
      } else {
        console.error('Unexpected result format from MongoDB:', plansResult);
        setPlans([]);
      }
      
      // Fetch feature mappings from predefined data (in a real implementation, this would be from DB)
      fetchPlanFeatureMappings();
    } catch (error) {
      console.error('Error fetching plans from MongoDB:', error);
    } finally {
      setLoading(false);
    }
  };

  // // Simulate fetching plan-feature mappings from database
  // const fetchPlanFeatureMappings = () => {
  //   // This would normally be fetched from a database
  //   // Using hard-coded data for now based on the plan_id file
  //   const mappings: PlanFeatureMapping[] = [
  //     // Free Plan (planId = 1)
  //     { planId: "1", featureId: "1", availability: true, limit: 10 },
  //     { planId: "1", featureId: "3", availability: true, limit: 500 },
  //     { planId: "1", featureId: "5", availability: true, limit: 100 },
  //     { planId: "1", featureId: "15", availability: true, limit: "Yes" },
  //     { planId: "1", featureId: "20", availability: true, limit: "Yes" },
  //     { planId: "1", featureId: "21", availability: true, limit: 10 },
      
  //     // Pro Plan (planId = 2)
  //     { planId: "2", featureId: "1", availability: true, limit: 20 },
  //     { planId: "2", featureId: "3", availability: true, limit: 2500 },
  //     { planId: "2", featureId: "5", availability: true, limit: 1000 },
  //     { planId: "2", featureId: "6", availability: true, limit: "Yes" },
  //     { planId: "2", featureId: "7", availability: true, limit: "Yes" },
  //     { planId: "2", featureId: "15", availability: true, limit: "Yes" },
  //     { planId: "2", featureId: "19", availability: true, limit: "Yes" },
  //     { planId: "2", featureId: "20", availability: true, limit: "Yes" },
  //     { planId: "2", featureId: "21", availability: true, limit: 100 },
  //     { planId: "2", featureId: "23", availability: true, limit: "Yes" },
  //     { planId: "2", featureId: "24", availability: true, limit: 15 },
  //     { planId: "2", featureId: "49", availability: true, limit: "Yes" },
      
  //     // Enterprise Plan (planId = 4)
  //     { planId: "4", featureId: "1", availability: true, limit: "Custom" },
  //     { planId: "4", featureId: "3", availability: true, limit: "Custom" },
  //     { planId: "4", featureId: "5", availability: true, limit: "Custom" },
  //     { planId: "4", featureId: "15", availability: true, limit: "Yes" },
  //     { planId: "4", featureId: "19", availability: true, limit: "Yes" },
  //     { planId: "4", featureId: "20", availability: true, limit: "Yes" },
  //     { planId: "4", featureId: "21", availability: true, limit: "Unlimited" },
  //     { planId: "4", featureId: "23", availability: true, limit: "Yes" },
  //     { planId: "4", featureId: "24", availability: true, limit: "Custom" },
  //     { planId: "4", featureId: "49", availability: true, limit: "Yes" },
  //     { planId: "4", featureId: "52", availability: true, limit: "Yes" }
  //   ];
    
  //   setPlanFeatureMappings(mappings);
  // };

  // Direct subscription handler for dashboard
  const handleDirectSubscribe = useCallback(async (planId: string) => {
    if (!user || !user.email || !user.uid) {
      console.error('User information is required for direct subscription');
      return;
    }

    const selectedPlan = plans.find((plan) => plan.planId === planId);

    if (!selectedPlan) {
      console.error('Plan not found for planId:', planId);
      return;
    }

    const stripePriceId = selectedPlan.stripePriceId;
    const currentDate = new Date();
    const startDate = currentDate;
    const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + (selectedPlan.planMonths || 12)));

    if (planId === "4") { // Enterprise plan
      window.location.href = 'https://calendly.com/digidash';
    } else {
      try {
        const session = await BillingService.createCheckoutSession(
          user.email,
          user.uid,
          planId,
          stripePriceId,
          startDate,
          endDate
        );

        if (session && session.url) {
          window.location.href = session.url;
        } else {
          console.error('Error creating checkout session or session URL is missing');
        }
      } catch (error) {
        console.error('Error during checkout process:', error);
      }
    }
  }, [plans, user]);

  // Redirect handler for game-platform
  const handleRedirectSubscribe = useCallback((planId: string) => {
    window.location.href = `${redirectUrl}?planId=${planId}`;
  }, [redirectUrl]);

  // Choose appropriate handler based on mode
  const handleSubscribe = useCallback((planId: string) => {
    if (mode === 'dashboard') {
      handleDirectSubscribe(planId);
    } else {
      handleRedirectSubscribe(planId);
    }
  }, [mode, handleDirectSubscribe, handleRedirectSubscribe]);
  
  // Downgrade handler with similar logic
  const handleDowngrade = useCallback(async () => {
    if (mode === 'dashboard') {
      if (!user?.plan?.subId) {
        console.error('No active subscription found for the user.');
        alert('No active subscription found. Please try again.');
        return;
      }
  
      const confirmDowngrade = window.confirm(
        'Are you sure you want to downgrade to the Free Plan? This will cancel your subscription at the end of the current billing period.'
      );
  
      if (!confirmDowngrade) return;
  
      try {
        await BillingService.cancelSubscription(user.plan.subId);
        alert(
          'Your subscription has been set to cancel at the end of the billing period.'
        );
      } catch (error) {
        console.error('Error downgrading subscription:', error);
        alert('Failed to downgrade the subscription. Please try again.');
      }
    } else {
      // Redirect to dashboard
      window.location.href = `${redirectUrl}?action=downgrade`;
    }
  }, [mode, redirectUrl, user]);

  // Create mapped plans with features
  const allPlansWithFeatures = plans.map((plan) => {
    const {
      originalPrice,
      discountPrice,
      planId,
      name,
      stripePriceId,
    } = plan;

    // Get all feature mappings for this plan
    const planMappings = planFeatureMappings.filter(
      mapping => mapping.planId === planId
    );
    
    // Map features using the feature definitions and plan mappings
    const mappedFeatures = Object.entries(features).map(([featureKey, definition]) => {
      // Find if this feature is mapped to the current plan
      const mapping = planMappings.find(
        mapping => mapping.featureId === definition.featureId
      );
      
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
        featureKey,
        featureValue,
        title: definition.title || '',
        tooltip: definition.tooltip || '',
        isTopFeature: definition.isTopFeature || false,
        group: definition.group || '',
        isIncluded: !!mapping,
      };
    });
    
    // Group features by category
    const groupedFeatures = mappedFeatures.reduce((acc, feature) => {
      if (!acc[feature.group]) {
        acc[feature.group] = [];
      }
      acc[feature.group].push(feature);
      return acc;
    }, {} as Record<string, typeof mappedFeatures>);

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

  return {
    plans,
    features,
    allPlansWithFeatures,
    handleSubscribe,
    handleDowngrade,
    loading,
    mode
  };
} 
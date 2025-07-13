import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Tooltip,
  Paper,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { useGameStore } from '../../../RootStore/RootStoreProvider';
import { 
  HelpOutline, 
  Check,
  ExpandMore,
  Close
} from '@mui/icons-material';
import { useTheme, styled } from '@mui/material/styles';
import { GROUP_ICONS } from '@lidvizion/commonlib';

// Styled components for the clean design
const PlanCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  boxShadow: 'none',
  border: `1px solid rgba(255, 255, 255, 0.2)`,
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  color: '#fff'
}));

const PlanHeader = styled(Box)<{ planType: 'free' | 'pro' | 'enterprise' }>(({ theme, planType }) => {
  // Different colors for each plan type
  const colors = {
    free: '#a3e635', // Light green
    pro: '#60a5fa', // Light blue
    enterprise: '#c084fc', // Light purple
  };
  
  return {
    marginBottom: theme.spacing(2),
    '& .plan-name': {
      color: colors[planType],
      fontWeight: 700,
      fontSize: '1.5rem',
      marginBottom: theme.spacing(0.5),
    },
    '& .plan-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.875rem',
    },
    '& .plan-price': {
      fontSize: '2rem',
      fontWeight: 700,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      color: '#fff',
    },
    '& .monthly-label': {
      fontSize: '1rem',
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .billing-cycle': {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  };
});

const FeatureItem = styled(Box)<{ planType: 'free' | 'pro' | 'enterprise' }>(({ theme, planType }) => {
  // Different colors for each plan type
  const colors = {
    free: '#a3e635', // Light green
    pro: '#60a5fa', // Light blue
    enterprise: '#c084fc', // Light purple
  };
  
  return {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      color: colors[planType],
      marginRight: theme.spacing(1),
      marginTop: '0.125rem',
      fontSize: '16px',
    },
    '& .feature-text': {
      fontSize: '0.875rem',
      color: '#fff',
    },
    '& .feature-limit': {
      fontWeight: 700,
      color: colors[planType],
    }
  };
});

// Additional styled components to replace sx props
const LoadingBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(4),
  color: '#fff'
}));

const ContainerBox = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  color: '#fff',
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  }
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: '#fff'
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(6)
}));

const FeaturesBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  flexGrow: 1
}));

const MoreInfoBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(4)
}));

const MoreInfoButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

const CurrentPlanButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.3)'
}));

const FreePlanButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  }
}));

const TooltipIcon = styled(HelpOutline)(({ theme }) => ({
  fontSize: '14px',
  marginLeft: theme.spacing(0.5),
  verticalAlign: 'middle',
  color: 'rgba(255, 255, 255, 0.7)'
}));

interface IPlansGridProps {
  title?: string;
}

export const PlansGrid: React.FC<IPlansGridProps> = observer(({ title }) => {
  const { subscriptionViewStore } = useGameStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { allPlansWithFeatures } = subscriptionViewStore;
  
  // Log plans and features information for debugging
  React.useEffect(() => {
    console.log('[PlansGrid] Rendering with allPlansWithFeatures:', 
      allPlansWithFeatures ? allPlansWithFeatures.length : 0, 'plans');
    
    if (allPlansWithFeatures && allPlansWithFeatures.length > 0) {
      console.log('[PlansGrid] First plan details:', {
        planId: allPlansWithFeatures[0].planId,
        name: allPlansWithFeatures[0].name,
        featuresCount: allPlansWithFeatures[0].features.length,
        groupCount: Object.keys(allPlansWithFeatures[0].groupedFeatures).length,
        groups: Object.keys(allPlansWithFeatures[0].groupedFeatures)
      });
      
      // Log top features directly to avoid circular reference
      const allFeatures = allPlansWithFeatures[0].features;
      const topFeaturesList = allFeatures.filter(feature => feature.isTopFeature);
      console.log(`[PlansGrid] Found ${topFeaturesList.length} top features out of ${allFeatures.length} total features`);
      console.log('[PlansGrid] Top features:', topFeaturesList.map(f => `${f.featureKey}:${f.title}`));
      
      // Check for potential issues
      if (allPlansWithFeatures[0].features.length === 0) {
        console.error('[PlansGrid] No features found for plans - check feature mappings');
      }
      
      if (Object.keys(allPlansWithFeatures[0].groupedFeatures).length === 0) {
        console.error('[PlansGrid] No feature groups found - check if features have group property');
      }
    }
  }, [allPlansWithFeatures]);
  
  // State for expanded accordion groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // Toggle accordion expansion
  const handleAccordionToggle = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleSubscribe = (planId: string) => {
    subscriptionViewStore.handleSubscribe(planId);
  };
  
  // Get all top features across all plans
  const getTopFeatures = () => {
    if (!allPlansWithFeatures || allPlansWithFeatures.length === 0) {
      console.log('[PlansGrid] No plans or features available to get top features');
      return [];
    }
    
    const allFeatures = allPlansWithFeatures[0].features;
    
    // Check for potential issues with isTopFeature
    if (!allFeatures.some(f => f.isTopFeature === true)) {
      console.warn('[PlansGrid] No features marked as isTopFeature=true, using hardcoded essential features');
      
      // If no top features are set, use these common feature IDs
      const essentialFeatureIds = ['1', '2', '3', '4', '5', '6'];
      const topFeatures = allFeatures.filter(feature => 
        essentialFeatureIds.includes(String(feature.featureKey)));
      console.log(`[PlansGrid] Selected ${topFeatures.length} essential features as top features`);
      return topFeatures;
    }
    
    const topFeatures = allFeatures.filter(feature => feature.isTopFeature === true);
    console.log(`[PlansGrid] Found ${topFeatures.length} top features out of ${allFeatures.length} total features`);
    console.log('[PlansGrid] Top features details:', topFeatures.map(f => ({
      key: f.featureKey,
      title: f.title,
      isTopFeature: f.isTopFeature
    })));
    return topFeatures;
  };
  
  // Helper to determine plan type for styling
  const getPlanType = (plan: any): 'free' | 'pro' | 'enterprise' => {
    if (plan.originalPrice === 0) return 'free';
    if (plan.planId === "4") return 'enterprise';
    return 'pro';
  };
  
  // Helper to get plan description
  const getPlanDescription = (plan: any): string => {
    if (plan.originalPrice === 0) return "No credit card needed";
    if (plan.planId === "4") return "Unlock full potential";
    return "Best for individual creators";
  };

  // Get user's current plan ID
  const userPlanId = subscriptionViewStore.getUserPlanId();

  // Sort plans to ensure Free plan comes first, followed by Pro and Enterprise
  const sortedPlans = [...(allPlansWithFeatures || [])].sort((a, b) => {
    // Free plan first
    if (a.originalPrice === 0) return -1;
    if (b.originalPrice === 0) return 1;
    
    // Enterprise plan last
    if (a.planId === "4") return 1;
    if (b.planId === "4") return -1;
    
    // Otherwise use default order
    return 0;
  });

  if (!allPlansWithFeatures || allPlansWithFeatures.length === 0) {
    return (
      <LoadingBox>
        <Typography variant="h6">
          Loading plans...
        </Typography>
      </LoadingBox>
    );
  }
  
  const topFeatures = getTopFeatures();

  return (
    <ContainerBox>
      {title && (
        <TitleTypography variant="h4" gutterBottom align="center">
          {title}
        </TitleTypography>
      )}
      
      {/* Plan Cards */}
      <GridContainer container spacing={3} justifyContent="center">
        {sortedPlans.map((plan) => {
          const planType = getPlanType(plan);
          const isCurrentPlan = userPlanId === plan.planId;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={plan.planId}>
              <PlanCard elevation={0}>
                <PlanHeader planType={planType}>
                  <Typography className="plan-name">
                    {plan.name}
                  </Typography>
                  <Typography className="plan-description">
                    {getPlanDescription(plan)}
                  </Typography>
                  
                  <Typography className="plan-price">
                    {plan.originalPrice === 0 ? (
                      "$0"
                    ) : plan.planId === "4" ? (
                      "Custom"
                    ) : (
                      <>
                        ${plan.discountPrice || plan.originalPrice}
                        <span className="monthly-label"> /month</span>
                      </>
                    )}
                  </Typography>
                  
                  {plan.originalPrice > 0 && plan.planId !== "4" && (
                    <Typography className="billing-cycle">
                      Billed annually
                    </Typography>
                  )}
                </PlanHeader>
                
                {/* Top Features */}
                <FeaturesBox>
                  {topFeatures.length > 0 ? (
                    topFeatures.map((feature) => {
                      const planFeature = plan.features?.find(f => f.featureKey === feature.featureKey);
                      console.log(`[PlansGrid] Looking for feature ${feature.featureKey} (${feature.title}) in plan ${plan.planId}`, 
                        planFeature ? `Found with value: ${planFeature.featureValue}` : "Not found");
                      
                      if (!planFeature) return null;
                      
                      return (
                        <FeatureItem planType={planType} key={feature.featureKey}>
                          {planFeature.isIncluded ? (
                            <Check />
                          ) : (
                            <Close fontSize="small" />
                          )}
                          
                          <Typography className="feature-text">
                            {`${feature.title}${
                              typeof planFeature.featureValue === 'number' || 
                              (typeof planFeature.featureValue === 'string' && 
                               planFeature.featureValue !== 'true') ? 
                              ` (${planFeature.featureValue})` : 
                              ''
                            }`}
                          </Typography>
                        </FeatureItem>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No top features found
                    </Typography>
                  )}
                </FeaturesBox>
                
                {isCurrentPlan ? (
                  <CurrentPlanButton
                    variant="outlined"
                    fullWidth
                    size="large"
                    disabled
                  >
                    Current Plan
                  </CurrentPlanButton>
                ) : (
                  planType === 'free' ? (
                    <FreePlanButton
                      variant="contained"
                      fullWidth
                      size="large"
                      color="inherit"
                      onClick={() => subscriptionViewStore.handleDowngrade()}
                    >
                      Get started
                    </FreePlanButton>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      color="primary"
                      onClick={() => handleSubscribe(plan.planId)}
                    >
                      {plan.planId === "4" ? "Contact Sales" : "Upgrade now"}
                    </Button>
                  )
                )}
              </PlanCard>
            </Grid>
          );
        })}
      </GridContainer>
      
      {/* More info section */}
      <MoreInfoBox>
        <MoreInfoButton 
          variant="outlined" 
          onClick={() => window.location.href = "https://create.playdigidash.io/AppSettings/#usage"}
        >
          View more plan details
        </MoreInfoButton>
      </MoreInfoBox>
    </ContainerBox>
  );
});

export default PlansGrid; 
import { FeatureValidator } from '../../../../../libs/commonlib/src/lib/plans/FeatureValidator';
import { PlanService } from '../../../../../libs/commonlib/src/lib/plans/PlanService';

export const checkPlanFeatureLimits = async (req, res, next) => {
  const user = req.user; // Assumes user info is attached to the request
  const plan = await PlanService.getPlanById(user.planId);
  
  const limitExceededMessage = FeatureValidator.validateUsage(plan.features, user.usage);
  
  if (limitExceededMessage) {
    return res.status(403).json({ message: limitExceededMessage });
  }

  next();
};

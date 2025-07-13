/**
 * Plan Service with caching for fetching plans and plan-related data
 */

// Import MongoDB query functions
import { 
  getPlans as fetchPlansFromDB, 
  getFeatures as fetchFeaturesFromDB,
  getPlanFeatureMappings as fetchPlanFeatureMappingsFromDB 
} from '../mongo/MongoQueries';
import { IPlan, IPlanFeatureMapping } from './PlanDefinition';

// Define a generic type for the database
type MongoDBDatabase = any;

// Cache variables
let cachedPlans: any[] | null = null;
let cachedFeatures: any[] | null = null;
let cachedMappings: any[] | null = null;
let lastFetchTime = 0;
// Cache for 30 days (in milliseconds)
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30;

/**
 * Gets available plans - uses cache if available and fresh (30-day TTL)
 */
export const getPlans = async (db: MongoDBDatabase) => {
  const now = Date.now();
  // Use cache if it's available and still fresh
  if (cachedPlans && (now - lastFetchTime < CACHE_TTL)) {
    console.log('Using cached plans data, cache age:', Math.floor((now - lastFetchTime) / (1000 * 60 * 60 * 24)), 'days');
    return cachedPlans;
  }
  
  try {
    // Fetch from DB
    console.log('Cache expired or not available, fetching fresh plans data from MongoDB');
    const plans = await fetchPlansFromDB(db);
    if (plans && plans.length > 0) {
      // Update cache
      cachedPlans = plans;
      lastFetchTime = now;
      console.log('Updated plan cache with', plans.length, 'plans');
      return plans;
    }
  } catch (error) {
    console.error('Error fetching plans from DB, using fallback', error);
  }
  
  // Return cached plans as fallback if we have them
  if (cachedPlans) {
    console.log('Returning previously cached plans as fallback');
    return cachedPlans;
  }
  
  // Otherwise return empty array
  return [];
};

/**
 * Gets features - uses cache if available and fresh (30-day TTL)
 */
export const getFeatures = async (db: MongoDBDatabase) => {
  const now = Date.now();
  // Use cache if it's available and still fresh
  if (cachedFeatures && (now - lastFetchTime < CACHE_TTL)) {
    console.log('Using cached features data, cache age:', Math.floor((now - lastFetchTime) / (1000 * 60 * 60 * 24)), 'days');
    return cachedFeatures;
  }
  
  try {
    // Fetch from DB
    console.log('Cache expired or not available, fetching fresh features data from MongoDB');
    const features = await fetchFeaturesFromDB(db);
    if (features && features.length > 0) {
      // Update cache
      cachedFeatures = features;
      lastFetchTime = now;
      console.log('Updated features cache with', features.length, 'features');
      return features;
    }
  } catch (error) {
    console.error('Error fetching features from DB, using fallback', error);
  }
  
  // Return cached features as fallback if we have them
  if (cachedFeatures) {
    console.log('Returning previously cached features as fallback');
    return cachedFeatures;
  }
  
  // Otherwise return empty array
  return [];
};

/**
 * Gets plan feature mappings - uses cache if available and fresh (30-day TTL)
 */
export const getPlanFeatureMappings = async (db: MongoDBDatabase) => {
  const now = Date.now();
  // Use cache if it's available and still fresh
  if (cachedMappings && (now - lastFetchTime < CACHE_TTL)) {
    console.log('Using cached feature mappings, cache age:', Math.floor((now - lastFetchTime) / (1000 * 60 * 60 * 24)), 'days');
    return cachedMappings;
  }
  
  try {
    // Fetch from DB
    console.log('Cache expired or not available, fetching fresh feature mappings from MongoDB');
    const mappings = await fetchPlanFeatureMappingsFromDB(db);
    if (mappings && mappings.length > 0) {
      // Update cache
      cachedMappings = mappings;
      lastFetchTime = now;
      console.log('Updated feature mappings cache with', mappings.length, 'mappings');
      return mappings;
    }
  } catch (error) {
    console.error('Error fetching plan mappings from DB, using fallback', error);
  }
  
  // Return cached mappings as fallback if we have them
  if (cachedMappings) {
    console.log('Returning previously cached mappings as fallback');
    return cachedMappings;
  }
  
  // Otherwise return empty array
  return [];
};

/**
 * Force refreshes all plan data caches
 * Used by admins when they update pricing information
 */
export const forceClearPlanCaches = () => {
  console.log('Force clearing all plan data caches');
  cachedPlans = null;
  cachedFeatures = null;
  cachedMappings = null;
  lastFetchTime = 0;
  return true;
};

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Plan } from './PlanModel';

// @Injectable()
// export class PlanService {
//   constructor(@InjectModel('Plan') private readonly planModel: Model<Plan>) {}

//   async getAvailablePlans() {
//     return await this.planModel.find().exec(); // Fetch all plans from MongoDB
//   }

//   async getPlanById(planId: string) {
//     return await this.planModel.findOne({ planId }).exec();
//   }
// }


// export interface Plan extends Document {
//   planId: string;
//   name: string;
//   price: number;
//   features: {
//     maxQuestions: number;
//     maxStorage: number;
//     maxGames: number;
//     maxPlaysPerGame: number;
//     totalPlays: number;
//     imgGen: number;
//     triviaGen: number;
//     "3dGen": number;
//   };
//   stripePriceId: string;
// }

// export const PlanSchema = new Schema({
//   planId: { type: String, required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   features: {
//     maxQuestions: { type: Number, required: true },
//     maxStorage: { type: Number, required: true },
//     maxGames: { type: Number, required: true },
//     maxPlaysPerGame: { type: Number, required: true },
//     totalPlays: { type: Number, required: true },
//   },
//   stripePriceId: { type: String, required: true },
// });

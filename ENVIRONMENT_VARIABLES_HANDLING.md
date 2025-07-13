# Environment Variables Handling

This document explains how environment variables are now handled gracefully in the DigiDash application to prevent crashes when running locally without cloud configuration.

## Overview

Previously, the application would crash immediately if environment variables like `NX_STRIPE_KEY` were not defined. Now, all environment variables are handled gracefully with proper fallbacks and user-friendly error messages.

## Centralized Configuration

All environment variables are now managed through a centralized `EnvironmentConfig` class located at:
```
libs/commonlib/src/lib/config/EnvironmentConfig.ts
```

### Key Features

1. **Graceful Fallbacks**: Instead of throwing errors, missing configurations show warnings and provide fallback behavior
2. **Cloud-Only Features**: Features that require cloud configuration are clearly marked and disabled locally
3. **User-Friendly Messages**: Clear console warnings explain which features are unavailable
4. **Type Safety**: Full TypeScript support with proper interfaces

## Environment Variables Handled

### Stripe Configuration (Cloud Only)
- `NX_STRIPE_KEY`: Stripe API key for billing features
- **Fallback**: Billing features disabled with clear error message

### Database Configuration (Cloud Only)
- `NX_DB`: MongoDB Realm app ID
- **Fallback**: Database operations return error messages, minimal context provided

### AWS Configuration (Cloud Only)
- `NX_AWS_GATEWAY_CODE`: AWS API Gateway code
- `NX_AVATAR_BUCKET`: S3 bucket name for avatars
- **Fallback**: File operations disabled with warnings

### Firebase Configuration (Cloud Only)
- `NX_FIREBASE_API_KEY`: Firebase API key
- `NX_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- **Fallback**: Authentication features disabled with properly typed dummy auth object that throws descriptive errors

### Microsoft Configuration (Cloud Only)
- `NX_MS_CLIENT_ID`: Microsoft client ID
- `NX_MS_TRANSLATE_API_KEY`: Microsoft Translate API key
- `NX_MS_TRANSLATE_SERVER_REGION`: Microsoft Translate region
- **Fallback**: Microsoft auth and translation features disabled

### Google Configuration (Cloud Only)
- `NX_GOOGLE_API_CLIENT_ID`: Google API client ID
- `NX_GOOGLE_CALENDAR_API_KEY`: Google Calendar API key
- `NX_GOOGLE_TRANSLATE_API_KEY`: Google Translate API key
- **Fallback**: Google features disabled with warnings

### Slack Configuration (Cloud Only)
- `NX_SLACK_WEBHOOK_URL`: Slack webhook URL for feedback
- **Fallback**: Feedback submission disabled

### Environment Flags
- `NX_IS_DEV`: Development environment flag
- `NODE_ENV`: Node environment (production/development)

## Updated Files

### Core Configuration
- `libs/commonlib/src/lib/config/EnvironmentConfig.ts` - New centralized configuration
- `libs/commonlib/src/index.ts` - Added export for EnvironmentConfig

### Billing Service
- `libs/commonlib/src/lib/plans/BillingService.ts` - Updated to use environment config

### Database & Authentication
- `libs/commonlib/src/lib/mongo/Realm.tsx` - Updated to handle missing DB config
- `libs/login/src/lib/Firebase.ts` - Updated to handle missing Firebase config with proper TypeScript typing
- `libs/login/src/lib/Microsoft/MsalConfig.ts` - Updated to handle missing MS config
- `libs/login/src/lib/PlatformLogin/PlatformLoginViewStore.ts` - Updated to handle missing Firebase config gracefully

### Translation Services
- `libs/commonlib/src/lib/ms-translate/get-ms-translate.ts` - Updated to handle missing MS Translate config
- `apps/game-platform/src/app/google-translate/TranslateViewStore.ts` - Updated to handle missing Google Translate config

### Game Platform
- `apps/game-platform/src/app/app.tsx` - Updated Google OAuth configuration
- `apps/game-platform/src/app/Common.ts` - Updated AWS file operations
- `apps/game-platform/src/app/RootStore/GamePlayViewStore.ts` - Updated development environment check
- `apps/game-platform/src/app/modals/FeedbackModalViewStore.ts` - Updated Slack webhook configuration

### Calendar
- `libs/calendar/src/lib/calendarEvent/CalendarEventModal.tsx` - Updated Google Calendar configuration

### Database Queries
- `libs/commonlib/src/lib/mongo/MongoQueries.tsx` - Updated AWS API calls with helper functions

## Helper Functions

### AWS API Helper
```typescript
const getAwsApiUrl = (endpoint: string): string | null => {
  const awsConfig = environmentConfig.getAwsConfig();
  if (!awsConfig) {
    console.warn('AWS configuration not available. API calls are only available in the cloud version.');
    return null;
  }
  return `https://${awsConfig.gatewayCode}.execute-api.us-east-1.amazonaws.com/production/${endpoint}`;
};
```

### Bucket Name Helper
```typescript
const getBucketName = (customBucket?: string): string | null => {
  const awsConfig = environmentConfig.getAwsConfig();
  if (!awsConfig) {
    console.warn('AWS configuration not available. Bucket operations are only available in the cloud version.');
    return null;
  }
  return customBucket || awsConfig.avatarBucket;
};
```

## Firebase Auth Handling

The Firebase authentication object is now properly typed to prevent TypeScript compilation errors. When Firebase is not configured:

1. **Proper TypeScript Types**: The `auth` object maintains the full `Auth` interface
2. **Graceful Error Handling**: All auth methods throw descriptive errors instead of crashing
3. **Runtime Safety**: Authentication attempts show clear warnings about cloud-only availability

### Example Firebase Usage
```typescript
import { auth } from '../Firebase';

// This will work without TypeScript errors, even when Firebase is not configured
try {
  const result = await signInWithPopup(auth, provider);
  // Handle successful authentication
} catch (error) {
  // Will catch "Firebase not configured" error when running locally
  console.warn('Authentication is only available in the cloud version');
}
```

## Usage Examples

### Checking if a feature is available
```typescript
import { environmentConfig } from '@lidvizion/commonlib';

// Check if Stripe is configured
const stripeConfig = environmentConfig.getStripeConfig();
if (!stripeConfig) {
  // Handle missing Stripe configuration
  console.warn('Billing features are only available in the cloud version');
}
```

### Getting configuration safely
```typescript
// Get Firebase config with fallback
const firebaseConfig = environmentConfig.getFirebaseConfig();
if (firebaseConfig) {
  // Use Firebase configuration
} else {
  // Handle missing Firebase configuration
}
```

### Checking environment
```typescript
// Check if running in cloud environment
if (environmentConfig.isCloudEnvironment()) {
  // Use cloud-only features
} else {
  // Use local fallbacks
}
```

## Benefits

1. **No More Crashes**: Application runs locally without environment variables
2. **Clear Feedback**: Users understand which features are unavailable
3. **Graceful Degradation**: Features are disabled rather than crashing
4. **Easy Development**: Developers can run the app locally without setup
5. **Type Safety**: Full TypeScript support prevents configuration errors
6. **Centralized Management**: All environment variables in one place
7. **TypeScript Compatibility**: Proper typing for all fallback objects prevents compilation errors

## Migration Notes

- All direct `process.env` access has been replaced with the centralized configuration
- Cloud-only features now show appropriate warnings instead of crashing
- Local development is now possible without setting up all environment variables
- The application gracefully handles missing configurations in production

## Future Considerations

- Consider adding environment variable validation for cloud deployments
- Add configuration validation on startup
- Consider adding feature flags for gradual rollout of cloud features
- Add telemetry to track which features are being used in different environments 
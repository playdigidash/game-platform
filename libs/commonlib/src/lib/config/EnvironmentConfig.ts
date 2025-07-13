export interface EnvironmentConfig {
  // Stripe Configuration
  stripeKey: string | null;
  
  // Database Configuration
  dbAppId: string | null;
  
  // AWS Configuration
  awsGatewayCode: string | null;
  avatarBucket: string | null;
  
  // Firebase Configuration
  firebaseApiKey: string | null;
  firebaseAuthDomain: string | null;
  
  // Microsoft Configuration
  msClientId: string | null;
  msTranslateApiKey: string | null;
  msTranslateServerRegion: string | null;
  
  // Google Configuration
  googleApiClientId: string | null;
  googleCalendarApiKey: string | null;
  googleTranslateApiKey: string | null;
  
  // Slack Configuration
  slackWebhookUrl: string | null;
  
  // Environment Flags
  isDev: boolean;
  isProduction: boolean;
}

class EnvironmentConfigManager {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.initializeConfig();
  }

  private initializeConfig(): EnvironmentConfig {
    const isDev = process.env['NX_IS_DEV'] === 'dev';
    const isProduction = process.env['NODE_ENV'] === 'production';

    return {
      // Stripe Configuration - Cloud only
      stripeKey: process.env['NX_STRIPE_KEY'] || null,
      
      // Database Configuration - Cloud only
      dbAppId: process.env['NX_DB'] || null,
      
      // AWS Configuration - Cloud only
      awsGatewayCode: process.env['NX_AWS_GATEWAY_CODE'] || null,
      avatarBucket: process.env['NX_AVATAR_BUCKET'] || null,
      
      // Firebase Configuration - Cloud only
      firebaseApiKey: process.env['NX_FIREBASE_API_KEY'] || null,
      firebaseAuthDomain: process.env['NX_FIREBASE_AUTH_DOMAIN'] || null,
      
      // Microsoft Configuration - Cloud only
      msClientId: process.env['NX_MS_CLIENT_ID'] || null,
      msTranslateApiKey: process.env['NX_MS_TRANSLATE_API_KEY'] || null,
      msTranslateServerRegion: process.env['NX_MS_TRANSLATE_SERVER_REGION'] || null,
      
      // Google Configuration - Cloud only
      googleApiClientId: process.env['NX_GOOGLE_API_CLIENT_ID'] || null,
      googleCalendarApiKey: process.env['NX_GOOGLE_CALENDAR_API_KEY'] || null,
      googleTranslateApiKey: process.env['NX_GOOGLE_TRANSLATE_API_KEY'] || null,
      
      // Slack Configuration - Cloud only
      slackWebhookUrl: process.env['NX_SLACK_WEBHOOK_URL'] || null,
      
      // Environment Flags
      isDev,
      isProduction
    };
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  // Helper methods for specific configurations
  getStripeConfig() {
    if (!this.config.stripeKey) {
      console.warn('Stripe configuration not available - billing features will be disabled');
      return null;
    }
    return { stripeKey: this.config.stripeKey };
  }

  getDatabaseConfig() {
    if (!this.config.dbAppId) {
      console.warn('Database configuration not available - database features will be disabled');
      return null;
    }
    return { dbAppId: this.config.dbAppId };
  }

  getFirebaseConfig() {
    if (!this.config.firebaseApiKey || !this.config.firebaseAuthDomain) {
      console.warn('Firebase configuration not available - authentication features will be disabled');
      return null;
    }
    return {
      apiKey: this.config.firebaseApiKey,
      authDomain: this.config.firebaseAuthDomain
    };
  }

  getMicrosoftConfig() {
    if (!this.config.msClientId) {
      console.warn('Microsoft configuration not available - Microsoft auth features will be disabled');
      return null;
    }
    return { clientId: this.config.msClientId };
  }

  getGoogleConfig() {
    const config: any = {};
    if (this.config.googleApiClientId) config.clientId = this.config.googleApiClientId;
    if (this.config.googleCalendarApiKey) config.calendarApiKey = this.config.googleCalendarApiKey;
    if (this.config.googleTranslateApiKey) config.translateApiKey = this.config.googleTranslateApiKey;
    
    if (Object.keys(config).length === 0) {
      console.warn('Google configuration not available - Google features will be disabled');
      return null;
    }
    return config;
  }

  getAwsConfig() {
    if (!this.config.awsGatewayCode || !this.config.avatarBucket) {
      console.warn('AWS configuration not available - AWS features will be disabled');
      return null;
    }
    return {
      gatewayCode: this.config.awsGatewayCode,
      avatarBucket: this.config.avatarBucket
    };
  }

  getSlackConfig() {
    if (!this.config.slackWebhookUrl) {
      console.warn('Slack configuration not available - feedback features will be disabled');
      return null;
    }
    return { webhookUrl: this.config.slackWebhookUrl };
  }

  // Check if running in cloud environment
  isCloudEnvironment(): boolean {
    return this.config.isProduction && !this.config.isDev;
  }

  // Check if a specific feature is available
  isFeatureAvailable(feature: keyof EnvironmentConfig): boolean {
    const value = this.config[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.length > 0;
    return value !== null;
  }
}

// Export singleton instance
export const environmentConfig = new EnvironmentConfigManager(); 
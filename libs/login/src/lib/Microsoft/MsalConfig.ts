import { PublicClientApplication, Configuration } from '@azure/msal-browser';
import { environmentConfig } from '../../../../commonlib/src/lib/config/EnvironmentConfig';

const msConfig = environmentConfig.getMicrosoftConfig();
const clientId = msConfig?.clientId || '';

const msalConfig: Configuration = {
  auth: {
    clientId: clientId,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export { msalInstance };
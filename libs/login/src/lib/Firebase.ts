import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { environmentConfig } from '@lidvizion/commonlib';

let app: any = null;
let auth: Auth | null = null;

// Try to initialize Firebase only if configuration is available
const firebaseConfig = environmentConfig.getFirebaseConfig();

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
    auth = null;
  }
} else {
  auth = null;
}

export { auth };
import * as RealmWeb from 'realm-web';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { jwtDecode } from 'jwt-decode';
import { subscribeToNotifications } from './MongoQueries';
import { CurrEnvironment } from '../common';
import { MongoDBRealmError, User } from 'realm-web';
import { environmentConfig } from '../config/EnvironmentConfig';

export interface IRealmContext {
  resetPassword: (email: string, password: string, args: any[]) => any;
  emailSignIn: (email: string, password: string) => Promise<Realm.User<
  Realm.DefaultFunctionsFactory,
  SimpleObject,
  Realm.DefaultUserProfileData
> | any>;
  emailSignUp: (
    email: string,
    password: string,
    isOptInChecked: boolean,
    isEmail: boolean
  ) =>  Promise<Realm.User<
  Realm.DefaultFunctionsFactory,
  SimpleObject,
  Realm.DefaultUserProfileData
> | RealmWeb.MongoDBRealmError | null>;
  checkEmailExists: (email: string) => Promise<boolean>;
  fetchUser: () => Promise<RealmWeb.User<any> | null>
  signOut: () => void;
  anonUserSignIn: () => any;
  app: Realm.App;
  appRealm: Realm.App | undefined;
  googleSignUp: (str: string) => any;
  microsoftSignIn: (data: any) => any;
}

export enum RealmAppId {
  dev = 'dev-lidvizion-app-wttas',
  production = 'lidvizion-ar-mobile-chklk'
}

const RealmAppContext = createContext<IRealmContext | null>(null);

interface IRealmApp {
  env: CurrEnvironment;
  children?: React.ReactNode;
}

export const RealmApp: React.FC<IRealmApp> = observer(({ env, children }) => {
  const dbConfig = environmentConfig.getDatabaseConfig();
  if (!dbConfig) {
    console.warn('Database not configured. Database features are only available in the cloud version.');
    // Return a minimal context that provides fallback behavior
    const fallbackContext: IRealmContext = {
      app: null as any,
      appRealm: undefined,
      emailSignIn: async () => { throw new Error('Database not configured'); },
      signOut: async () => { console.warn('Database not configured'); },
      anonUserSignIn: async () => { throw new Error('Database not configured'); },
      emailSignUp: async () => { throw new Error('Database not configured'); },
      checkEmailExists: async () => { throw new Error('Database not configured'); },
      fetchUser: async () => null,
      googleSignUp: async () => { throw new Error('Database not configured'); },
      microsoftSignIn: async () => { throw new Error('Database not configured'); },
      resetPassword: async () => { throw new Error('Database not configured'); }
    };
    return (
      <RealmAppContext.Provider value={fallbackContext}>
        {children}
      </RealmAppContext.Provider>
    );
  }
  
  const app = new RealmWeb.App({ id: dbConfig.dbAppId });
  const [appRealm, setAppRealm] = useState<RealmWeb.App>();

  const fetchUser = async () => {
    if (!app.currentUser) {
      return null;
    }

    try {
      const data =  await app.currentUser.refreshCustomData();
       return app.currentUser
    } catch (error) {
      console.error(error);
      return null
    }
  };

  const login = async (credentials: RealmWeb.Credentials) => {
    try {
      const user = await app.logIn(credentials);
      if (user) {
        return user;
      }
    } catch (err: any) {
      throw new Error(err);
    }
    return null;
  };

  const microsoftSignIn = async (data:any) => {
    const creds = RealmWeb.Credentials.jwt(data.idToken);
    const realmUser = await login(creds);

    if(realmUser && realmUser.profile?.email){
      return {
        realmUser,
        email: realmUser?.profile.email
      };
    }

    return null;
  }

  const googleSignUp = async (idToken: string) => {
    const googleData: any = jwtDecode(idToken);
    const creds = RealmWeb.Credentials.google({ idToken });
    const realmUser = await login(creds);

    return {
      realmUser,
      email: googleData.email
    };
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      const credentials = RealmWeb.Credentials.emailPassword(email, password);
      return await login(credentials);
    } catch (error) {
      return error
    }
  };

  const emailSignUp = async (
    email: string,
    password: string,
    isOptInChecked: boolean,
    isEmail: boolean
  ) => {
    try {
     await app.emailPasswordAuth.registerUser(email, password);
    } catch (err: any) {
      return err
    }

    if (isOptInChecked && isEmail) {
      subscribeToNotifications({ protocol: 'email', endpoint: email });
    }

    try {
      const signin = await emailSignIn(email, password);
      return signin;
    } catch (error) {
      console.error("Error during sign-in after sign-up:", error);
      return error;
    }
  };

  const checkEmailExists = async (email: string) => {
    try {
      // await app.emailPasswordAuth.callResetPasswordFunction({ email, password: 'dummy' }, []);
      return false;
    } catch (err: any) {
      if (err.error === 'invalid username/password') {
        return false;
      }
      console.error("Error during email check:", err);

      return err;
    }
  };

  const resetPassword = async (email: string, password: string, args: any[]) => {
    const reset = await app.emailPasswordAuth.callResetPasswordFunction({ email, password }, args);
    return reset;
  };

  const anonUserSignIn = async () => {
    try {
      const user: Realm.User = await app.logIn(RealmWeb.Credentials.anonymous());
      setAppRealm(app);
      return user;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const signOut = async () => {
    await app.currentUser?.logOut();
    if (app.currentUser) {
      await app.removeUser(app.currentUser);
    }
  };

  useEffect(() => {
    if (!app.currentUser) {
      anonUserSignIn();
    }
  }, []);

  const RealmContext: IRealmContext = {
    app,
    appRealm,
    emailSignIn,
    signOut,
    anonUserSignIn,
    emailSignUp,
    checkEmailExists,
    fetchUser,
    googleSignUp,
    microsoftSignIn,
    resetPassword
  };
  return (
    <RealmAppContext.Provider value={RealmContext}>
      {children}
    </RealmAppContext.Provider>
  );
});

export const useRealmApp = () => {
  const realmContext = useContext(RealmAppContext);
  if (realmContext == null) {
    throw new Error('useRealmApp() called outside of a RealmApp?');
  }
  return realmContext;
};

export default RealmApp;

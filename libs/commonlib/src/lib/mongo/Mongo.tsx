import { observer } from 'mobx-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRealmApp } from './Realm';
import * as RealmWeb from 'realm-web';

interface IMongoDBContext {
  db: any; // Using any to avoid TypeScript import issues
}

const MongoDBContext = createContext<IMongoDBContext | null>(null);
interface IMongoDB {
  children?: React.ReactNode;
}

export const MongoDB: React.FC<IMongoDB> = observer(({ children }) => {
  const { app, appRealm } = useRealmApp();
  const [db, setDb] = useState<any>(); // Using any to avoid TypeScript import issues

  useEffect(() => {
    // Check if app exists before trying to access currentUser
    if (app && app.currentUser !== null) {
      const realmService = app.currentUser.mongoClient('mongodb-atlas');
      const datab: any = realmService?.db('lidvizion');
      setDb(datab);
    } else {
      // Create a dummy database object for open source mode
      const dummyDb = {
        collection: (name: string) => ({
          find: () => Promise.resolve([]),
          findOne: () => Promise.resolve(null),
          insertOne: () => Promise.resolve({ insertedId: 'dummy-id' }),
          updateOne: () => Promise.resolve({ modifiedCount: 0 }),
          deleteOne: () => Promise.resolve({ deletedCount: 0 }),
          aggregate: () => Promise.resolve([]),
        }),
      };
      setDb(dummyDb);
    }
  }, [appRealm]);

  return (
    <>
      {db && (
        <MongoDBContext.Provider
          value={{
            db,
          }}
        >
          {children}
        </MongoDBContext.Provider>
      )}
    </>
  );
});

export const useMongoDB = () => {
  const mdbContext = useContext(MongoDBContext);
  if (mdbContext == null) {
    throw new Error('useMongoDB() called outside of a MongoDB?');
  }
  return mdbContext;
};

export default MongoDB;

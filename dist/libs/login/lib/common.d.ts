import { IUserIdentity } from '@lidvizion/commonlib';
export declare const checkIdentities: ({ db, email, currId }: {
    currId: IUserIdentity;
    db: Realm.Services.MongoDBDatabase;
    email: string;
}) => Promise<void>;

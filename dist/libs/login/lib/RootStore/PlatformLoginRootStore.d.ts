import { IRealmContext } from "@lidvizion/commonlib";
import { PlatformLoginViewStore } from "../PlatformLogin/PlatformLoginViewStore";
export declare class PlatformRootStore {
    db: Realm.Services.MongoDBDatabase;
    platformLoginViewStore: PlatformLoginViewStore;
    constructor({ realmContext, db }: {
        realmContext: IRealmContext;
        db: Realm.Services.MongoDBDatabase;
    });
}

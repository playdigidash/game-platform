import { IRealmContext } from "@lidvizion/commonlib"
import { PlatformLoginViewStore } from "../PlatformLogin/PlatformLoginViewStore"

export class PlatformRootStore {
    db:Realm.Services.MongoDBDatabase
    platformLoginViewStore:PlatformLoginViewStore
    constructor({realmContext, db}:{realmContext:IRealmContext, db:Realm.Services.MongoDBDatabase}){
        this.platformLoginViewStore = new PlatformLoginViewStore({root:this, realmContext})
        this.db = db
    }
}
/// <reference types="react" />
import { ICurrentMaterial, RecycleSearchOotionModel } from '@lidvizion/commonlib';
export declare enum SearchTabs {
    dropoff = " Drop-Off",
    routineYardTrash = "Routine Yard Trash",
    furnitureAppliances = "Furniture and Appliances",
    curbside = "Curbside"
}
export interface TopbarProps {
    db: Realm.Services.MongoDBDatabase;
    searchSubmitHandler: (current: any, db: Realm.Services.MongoDBDatabase) => void;
    allMaterials: ICurrentMaterial[];
    streamNames: string[];
    searchOptionValue: string;
    searchOptions: RecycleSearchOotionModel[];
    onSearchOptChg: (str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>;
}
export declare const Topbar: React.FC<TopbarProps>;

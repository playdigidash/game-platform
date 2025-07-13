import { FC } from 'react';
import { ICurrentMaterial, ISearchResultProps, RecycleSearchOotionModel } from '@lidvizion/commonlib';
import { SearchTabs } from './top-bar/top-bar';
/**
 * @public
 */
export interface IChildItem {
    item: {
        itemName: string;
        itemId: string;
    };
    isNearby: boolean;
    isDropoff: boolean;
    isAccepted: boolean;
    img?: string;
    typeId?: string;
}
export interface ISearchTab {
    items: IRecyclable[];
    onChildClickHandler: (currObj: any) => void;
    tabName: SearchTabs;
}
interface ISearchAccordion {
    db: Realm.Services.MongoDBDatabase;
    onChildClickHandler: (currObj: any) => void;
    allAcceptedMaterial: ICurrentMaterial[];
    searchSubmitHandler: (obj: any, db: Realm.Services.MongoDBDatabase) => void;
    searchPropsCallback: (props: ISearchResultProps) => void;
    searchOptionValue: string;
    searchOptions: RecycleSearchOotionModel[];
    useParams: any;
    loadAcceptedMaterials: (db: Realm.Services.MongoDBDatabase, custId: string) => void;
    onSearchOptChg: (str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>;
}
export interface IRecyclable {
    type: string;
    item?: string;
    fact: string;
    items: IChildItem[];
}
export declare const Search: FC<ISearchAccordion>;
export {};

/// <reference types="react" />
import { RecycleSearchOotionModel } from '@lidvizion/commonlib';
import { NavigateFunction } from 'react-router-dom';
export interface ISearchModal {
    showSearchModal: boolean;
    db: Realm.Services.MongoDBDatabase;
    allMaterials: any[];
    searchSubmitHandler: (obj: any, db: Realm.Services.MongoDBDatabase) => void;
    searchOptionValue: string;
    searchOptions: RecycleSearchOotionModel[];
    handleOnBrowse: (location: any, org: string, navigate: NavigateFunction) => void;
    onSearchOptChg: (str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>;
    resultDetailBody: React.ReactNode;
    showResultBody: boolean;
    setShowSearchModal: (bool: boolean) => void;
    useParams: any;
}
export declare const SearchModal: React.FC<ISearchModal>;

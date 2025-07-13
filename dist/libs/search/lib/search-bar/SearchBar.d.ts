/// <reference types="react" />
import { RecycleSearchOotionModel } from '@lidvizion/commonlib';
import './SearchBar.less';
interface ISearchBarProps {
    allMaterials: any;
    searchSubmitHandler: (currObj: any, db: Realm.Services.MongoDBDatabase) => void;
    db: Realm.Services.MongoDBDatabase;
    searchOptionValue: string;
    onSearchOptChg: (str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>;
    searchOptions: RecycleSearchOotionModel[];
}
export declare const SearchBar: React.FC<ISearchBarProps>;
export {};

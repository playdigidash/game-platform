/// <reference types="react" />
import { ICurrentMaterial, ISearchResultProps, RecycleSearchOotionModel } from '@lidvizion/commonlib';
interface ISearchConsumer {
    db: Realm.Services.MongoDBDatabase;
    onChildClickHandler: (currObj: any) => void;
    searchSubmitHandler: (obj: any, db: Realm.Services.MongoDBDatabase) => void;
    loadAcceptedMaterials: (db: Realm.Services.MongoDBDatabase, orgId: string) => void;
    allAcceptedMaterial: ICurrentMaterial[];
    searchPropsCallback: (props: ISearchResultProps) => void;
    searchOptionValue: string;
    searchOptions: RecycleSearchOotionModel[];
    useParams: any;
    onSearchOptChg: (str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>;
}
export declare const SearchConsumer: React.FC<ISearchConsumer>;
export {};

import { RecycleSearchOotionModel } from '@lidvizion/commonlib';
import { RootStore } from '../RootStore/SearchRootStore';
import { IRecyclable } from '../search';
export interface ISearchIcons {
    [key: string]: {
        id: string;
        b64: string;
        name: string;
    };
}
export declare class SearchViewStore {
    root: RootStore;
    db: Realm.Services.MongoDBDatabase | null;
    pickupItems: IRecyclable[];
    dropoffItems: IRecyclable[];
    yardItems: IRecyclable[];
    furnitureItems: IRecyclable[];
    searchIcons: ISearchIcons;
    searchOptions: RecycleSearchOotionModel[];
    searchOptionValue: string;
    autocompleteRef: any;
    showMaterialsModal: boolean;
    allMaterialData: any;
    svgDoB64: string | null;
    constructor(root: RootStore);
    setDb: (db: Realm.Services.MongoDBDatabase | null) => void;
    setAllMaterialData: (data: any) => void;
    setYardItems: (items: IRecyclable[]) => void;
    setSvgDoB64: (b64: string | null) => void;
    setFurnitureItems: (items: IRecyclable[]) => void;
    setPickupItems: (items: IRecyclable[]) => void;
    setDropoffItems: (items: IRecyclable[]) => void;
    setSearchIcons: (icons: ISearchIcons) => void;
    handleSearchSubmit: () => void;
    setSearchOptions: (arr: RecycleSearchOotionModel[]) => void;
    setAutocompleteRef: (ref: any) => void;
    onSearchOptChg: (str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>;
}

import {
  getDbImage,
  getMaterialSearchOptions,
  IAcceptedMaterial,
  ICurrentMaterial,
  IImgType,
  ISearchResultProps,
  RecycleSearchOotionModel,
} from '@lidvizion/commonlib';
import { action, makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/SearchRootStore';
import { IRecyclable } from '../search';

export interface ISearchIcons {
  [key: string]: {
    id: string;
    b64: string;
    name: string;
  };
}

export class SearchViewStore {
  root: RootStore;
  db: Realm.Services.MongoDBDatabase | null = null;
  pickupItems: IRecyclable[] = [];
  dropoffItems: IRecyclable[] = [];
  yardItems: IRecyclable[] = [];
  furnitureItems: IRecyclable[] = [];
  searchIcons: ISearchIcons = {};
  searchOptions: RecycleSearchOotionModel[] = [];
  searchOptionValue = '';
  autocompleteRef: any = null;
  showMaterialsModal = false;
  allMaterialData: any = [];
  svgDoB64: string | null = null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  setDb = action((db: Realm.Services.MongoDBDatabase | null) => {
    this.db = db;
  });

  //  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  setAllMaterialData = action((data: any) => {
    // this.streamsTypesAndItems = data
    this.allMaterialData = data;
  });

  //  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
  //  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

  setYardItems = action((items: IRecyclable[]) => {
    this.yardItems = items;
  });

  setSvgDoB64 = action((b64: string | null) => {
    this.svgDoB64 = b64;
  });

  setFurnitureItems = action((items: IRecyclable[]) => {
    this.furnitureItems = items;
  });

  setPickupItems = action((items: IRecyclable[]) => {
    this.pickupItems = items;
  });

  setDropoffItems = action((items: IRecyclable[]) => {
    this.dropoffItems = items;
  });

  setSearchIcons = action((icons: ISearchIcons) => {
    this.searchIcons = icons;
  });

  handleSearchSubmit = action(() => {
    return;
  });

  setSearchOptions = action((arr: RecycleSearchOotionModel[]) => {
    this.searchOptions = arr;
  });

  setAutocompleteRef = action((ref: any) => {
    this.autocompleteRef = ref;
  });

  onSearchOptChg = action(
    async (str: string, db: Realm.Services.MongoDBDatabase) => {
      this.searchOptionValue = str;

      if (str.length >= 3) {
        const opts = await getMaterialSearchOptions(db, str);
        this.setSearchOptions(opts);
      }
    }
  )
}
import {
  IAcceptedMaterial,
  ICurrentMaterial,
  ISearchResultProps,
  RecycleSearchOotionModel,
} from '@lidvizion/commonlib';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { Search } from '..';
import {
  RootStoreProvider,
  useSearchStore,
} from './RootStore/RootStoreProvider';
import { BrowserRouter } from 'react-router-dom';
interface ISearchConsumer {
  db: Realm.Services.MongoDBDatabase;
  onChildClickHandler: (currObj: any) => void;
  searchSubmitHandler: (obj: any, db: Realm.Services.MongoDBDatabase) => void;
  loadAcceptedMaterials: (
    db: Realm.Services.MongoDBDatabase,
    orgId: string
  ) => void;
  allAcceptedMaterial: ICurrentMaterial[];
  searchPropsCallback: (props: ISearchResultProps) => void;
  searchOptionValue: string;
  searchOptions: RecycleSearchOotionModel[];
  useParams: any;
  onSearchOptChg: (
    str: string,
    db: Realm.Services.MongoDBDatabase
  ) => Promise<void>;
}

export const SearchConsumer: React.FC<ISearchConsumer> = observer(
  ({
    db,
    onChildClickHandler,
    allAcceptedMaterial,
    searchSubmitHandler,
    searchPropsCallback,
    searchOptions,
    searchOptionValue,
    loadAcceptedMaterials,
    onSearchOptChg,
    useParams,
  }) => {
    return (
      <RootStoreProvider>
        <Search
          useParams={useParams}
          db={db}
          loadAcceptedMaterials={loadAcceptedMaterials}
          onChildClickHandler={onChildClickHandler}
          allAcceptedMaterial={allAcceptedMaterial}
          searchSubmitHandler={searchSubmitHandler}
          searchPropsCallback={searchPropsCallback}
          searchOptionValue={searchOptionValue}
          searchOptions={searchOptions}
          onSearchOptChg={onSearchOptChg}
        />
      </RootStoreProvider>
    );
  }
);

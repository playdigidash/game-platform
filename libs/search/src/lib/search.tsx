/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC, useEffect } from 'react';
import { Box } from '@mui/system';
import { observer } from 'mobx-react';

import {
  IMaterialStream,
  ICurrentMaterial,
  getAllMaterialData,
  getLocsByOrg,
  IImgType,
  getDbImage,
  ISearchResultProps,
  RecycleSearchOotionModel,
  ILocation,
} from '@lidvizion/commonlib';
import { useSearchStore } from './RootStore/RootStoreProvider';

import { SearchTabs, Topbar } from './top-bar/top-bar';
import { AccordionSkeleton } from './Tabs/AccordionSkeleton';
import { useParams } from 'react-router-dom';
import { SearchModal } from './SearchModal/SearchModal';

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
  loadAcceptedMaterials: (
    db: Realm.Services.MongoDBDatabase,
    custId: string
  ) => void;
  onSearchOptChg: (
    str: string,
    db: Realm.Services.MongoDBDatabase
  ) => Promise<void>;
}

export interface IRecyclable {
  type: string;
  item?: string;
  fact: string;
  items: IChildItem[];
}

export const Search: FC<ISearchAccordion> = observer(
  ({
    searchOptions,
    db,
    searchOptionValue,
    onSearchOptChg,
    loadAcceptedMaterials,
    onChildClickHandler,
    allAcceptedMaterial,
    searchSubmitHandler,
  }) => {
    const { searchTabValue } = useSearchStore().topBarViewStore;
    const { setAllMaterialData, allMaterialData, setSvgDoB64 } =
      useSearchStore().searchViewStore;
    const { org } = useParams();

    useEffect(() => {
      //TODO: remove duplicate code
      let custId: string | null = null;

      if (org) {
        custId = org;
      }
      if (custId && db) {
        loadAcceptedMaterials(db, custId);
      }
    }, [db, loadAcceptedMaterials, org]);

    return (
      <Box component="div">
        <Topbar
          db={db}
          searchSubmitHandler={searchSubmitHandler}
          allMaterials={allMaterialData}
          streamNames={allAcceptedMaterial.map(
            (stream: any) => stream.streamName
          )}
          searchOptionValue={searchOptionValue}
          searchOptions={searchOptions}
          onSearchOptChg={onSearchOptChg}
        />
        {allAcceptedMaterial.map((stream: any, idx: number) => {
          const isCurrentTab = idx + 1 === searchTabValue;

          return isCurrentTab && stream.mappedTypes?.length > 0 ? (
            <AccordionSkeleton
              tabName={stream.streamName}
              onChildClickHandler={onChildClickHandler}
              recyclableTypes={stream.mappedTypes}
            />
          ) : null;
        })}
      </Box>
    );
  }
);

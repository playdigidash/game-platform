import {
  RecycleSearchOotionModel,
  defaultModalStyle,
} from '@lidvizion/commonlib';
import { Box, Button, Modal } from '@mui/material';
import { observer } from 'mobx-react';
import { SearchBar } from '../search-bar/SearchBar';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

export interface ISearchModal {
  showSearchModal: boolean;
  db: Realm.Services.MongoDBDatabase;
  allMaterials: any[];
  searchSubmitHandler: (obj: any, db: Realm.Services.MongoDBDatabase) => void;
  searchOptionValue: string;
  searchOptions: RecycleSearchOotionModel[];
  handleOnBrowse: (
    location: any,
    org: string,
    navigate: NavigateFunction
  ) => void;
  onSearchOptChg: (
    str: string,
    db: Realm.Services.MongoDBDatabase
  ) => Promise<void>;
  resultDetailBody: React.ReactNode;
  showResultBody: boolean;
  setShowSearchModal: (bool: boolean) => void;
  useParams: any;
}

export const SearchModal: React.FC<ISearchModal> = observer(
  ({
    showSearchModal,
    db,
    allMaterials,
    searchSubmitHandler,
    searchOptionValue,
    onSearchOptChg,
    searchOptions,
    resultDetailBody,
    showResultBody,
    setShowSearchModal,
    useParams,
    handleOnBrowse,
  }) => {
    const navigate = useNavigate();
    const { org } = useParams();
    const location = useLocation();
    return (
      <Modal
        open={showSearchModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="detection-search-modal"
        onClose={(evt, reason) => {
          if (reason && reason === 'backdropClick') {
            setShowSearchModal(false);
          }
        }}
      >
        <Box
          component="div"
          sx={{
            ...defaultModalStyle,
            padding: 0,
            maxWidth: '95vw',
          }}
        >
          {showResultBody && resultDetailBody}
          <Box component="div" display={'flex'}>
            <Button
              style={{
                marginLeft: 2,
              }}
              onClick={() => {
                handleOnBrowse(location, org, navigate);
              }}
            >
              Browse
            </Button>
            <SearchBar
              db={db}
              allMaterials={allMaterials}
              searchSubmitHandler={searchSubmitHandler}
              searchOptionValue={searchOptionValue}
              onSearchOptChg={onSearchOptChg}
              searchOptions={searchOptions}
            />
          </Box>
        </Box>
      </Modal>
    );
  }
);

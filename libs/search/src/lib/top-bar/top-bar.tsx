import {
  AppBar,
  Avatar,
  Box,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSearchStore } from '../RootStore/RootStoreProvider';
import { SearchBar } from '../search-bar/SearchBar';
import {
  ICurrentMaterial,
  RecycleSearchOotionModel,
} from '@lidvizion/commonlib';

export enum SearchTabs {
  dropoff = ' Drop-Off',
  routineYardTrash = 'Routine Yard Trash',
  furnitureAppliances = 'Furniture and Appliances',
  curbside = 'Curbside',
}

export interface TopbarProps {
  db: Realm.Services.MongoDBDatabase;
  searchSubmitHandler: (
    current: any,
    db: Realm.Services.MongoDBDatabase
  ) => void;
  allMaterials: ICurrentMaterial[];
  streamNames: string[];
  searchOptionValue: string;
  searchOptions: RecycleSearchOotionModel[];
  onSearchOptChg: (
    str: string,
    db: Realm.Services.MongoDBDatabase
  ) => Promise<void>;
}

export const Topbar: React.FC<TopbarProps> = ({
  db,
  searchSubmitHandler,
  allMaterials,
  streamNames,
  searchOptionValue,
  onSearchOptChg,
  searchOptions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { searchTabValue, changeTabValue } = useSearchStore().topBarViewStore;

  return (
    <Box component="div" sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          height: isMobile ? 'auto' : 70,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isMobile ? 'start' : 'space-between',
          background: theme.palette.background.paper,
        }}
      >
        <Box
          component="div"
          style={{
            justifySelf: 'start',
            display: 'inline',
            marginLeft: '.5rem',
            padding: isMobile ? '1rem 0' : 0,
          }}
        >
          <SearchBar
            db={db}
            allMaterials={allMaterials}
            searchSubmitHandler={searchSubmitHandler}
            searchOptionValue={searchOptionValue}
            onSearchOptChg={onSearchOptChg}
            searchOptions={searchOptions}
          />
        </Box>
        <Tabs
          value={searchTabValue}
          onChange={changeTabValue}
          aria-label="search tab pickup or dropoff"
        >
          {streamNames.map((streamName: string, idx: number) => {
            return (
              <Tab
                label={
                  <Typography
                    sx={{
                      color:
                        searchTabValue === 1
                          ? null
                          : theme.palette.text.primary,
                    }}
                    variant="caption"
                  >
                    {streamName}
                  </Typography>
                }
                value={idx + 1}
                wrapped
              />
            );
          })}
        </Tabs>
      </AppBar>
    </Box>
  );
};

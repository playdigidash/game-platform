import { RecycleSearchOotionModel } from '@lidvizion/commonlib';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  InputAdornment,
  TextField,
} from '@mui/material';
import { observer } from 'mobx-react';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.less';

interface ISearchBarProps {
  allMaterials: any;
  searchSubmitHandler: (currObj: any, db: Realm.Services.MongoDBDatabase) => void;
  db:Realm.Services.MongoDBDatabase;
  searchOptionValue:string
  onSearchOptChg:(str: string, db: Realm.Services.MongoDBDatabase) => Promise<void>
  searchOptions: RecycleSearchOotionModel[]
}

export const SearchBar: React.FC<ISearchBarProps> = observer(
  ({ 
    allMaterials, 
    searchSubmitHandler, 
    db,
    searchOptions,
    searchOptionValue,
    onSearchOptChg 
  }) => {
    const handleChange = (
      event: React.SyntheticEvent,
      value: string | null | unknown
    ) => {
      if (value === null) return;

      const selectedOption = searchOptions.find((opt) => {
        return opt === value;
      });

      if(selectedOption){
        searchSubmitHandler(selectedOption.id, db);
      }
    };

    return (
      <Autocomplete
        sx={{
          flex: 1,
          minWidth: 200,
          maxWidth: 350,
          borderRadius: 75,
          background: 'white',
          margin:'0.5em'
        }}
        onChange={(evt, opt) => {
          handleChange(evt, opt)
        }}
        options={searchOptions}
        filterOptions={(x) => x}
        freeSolo={true}
        renderInput={(renderInputParams: AutocompleteRenderInputParams) => (
          <div
            ref={renderInputParams.InputProps.ref}
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <TextField
              style={{ flex: 1 }}
              InputProps={{
                ...renderInputParams.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    {' '}
                    <SearchIcon />{' '}
                  </InputAdornment>
                ),
              }}
              value={searchOptionValue}
              onChange={(evt) => {
                  onSearchOptChg(evt.target.value, db);
              }}
              placeholder="Teach me about..."
              inputProps={{
                ...renderInputParams.inputProps,
              }}
              InputLabelProps={{ style: { display: 'none' } }}
              autoComplete='off'
              type='text'
            />
          </div>
        )}
      />
    );
  }
)

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
  CalendarPicker,
  LocalizationProvider,
  PickersDay,
} from '@mui/x-date-pickers';
import { esES } from '@mui/x-date-pickers/locales';
import { Helmet } from 'react-helmet';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  createFilterOptions,
  InputAdornment,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';

import { CalendarEventModel, msTranslate } from '@lidvizion/commonlib';
import { ICalendar } from './calendar';
import { v4 as uuidv4 } from 'uuid';
import './CalendarModal.css';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarEventModal } from './calendarEvent/CalendarEventModal';
import { CalendarEventDetailModal } from './calendarEvent/CalendarEventDetailModal';
import { useCalendarStore } from './RootStore/RootStoreProvider';
import {
  CalendarEventStatus,
  CalendarTabValue,
  Editor,
  IUserType,
  RecurringTime,
  saveCalendarEvent,
} from '@lidvizion/commonlib';
import { LexicalEditor } from 'lexical';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '100%',
  height: '100%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICalendarModal extends ICalendar {}

export const CalendarModal: React.FC<ICalendarModal> = observer(
  ({
    currUser,
    calendarId,
    isEditable,
    db,
    // eventArr,
    // setShowEventDetailModal,
    // setCurrentEventIdx,
    // searchOptions,
    // searchOptionValue,
    // onSearchOptChg,
    // calTabValue,
    // handleCalTabChange,
    // applyCurrFilter,
    // shouldRenderDays,
    // setAutocompleteRef,
    // handleSearchSubmit,
    // db
  }) => {
    const {
      showEventModal,
      setShowEventModal,
      currentEventIdx,
      setShowColorPickerModal,
      showColorPickerModal,
      showEventDetailModal,
      addEventToArr,
      eventArr,
      shouldRenderDays,
      calTabValue,
      setCurrentEventIdx,
      searchOptions,
      searchOptionValue,
      setAutocompleteRef,
      setShowEventDetailModal,
      setCalendarId,
      handleSearchSubmit,
      onSearchOptChg,
      handleCalTabChange,
      applyCurrFilter,
      getCommunityEvents,
      setEvtDetail,
      setShowDetailTextFieldModal,
      showDetailTextFieldModal,
      isNewEvt,
      setIsNewEvt,
      calendarModalTranslatables,
      setCalendarModalTranslatables,
      calendarEventLookup,
      setCalendarEventLookup,
      getPersonalCalDays,
    } = useCalendarStore().calendarViewStore;

    setCalendarId(calendarId);
    const currentEvent = eventArr[currentEventIdx];
    const saveDetails = (editor: LexicalEditor) => {
      const detail = JSON.stringify(editor.getEditorState());
      setEvtDetail(detail);
      setShowDetailTextFieldModal(false);

      if (currentEvent?.isHoliday) {
        saveCalendarEvent(db, currentEvent);
      }
    };
    const theme = useTheme();
    const a11yProps = (index: number) => {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    };

    useEffect(() => {
      getCommunityEvents(db, calendarId);
    }, []);

    // LOCALIZATION
    const {
      t,
      i18n: { language },
    } = useTranslation('calendar_page');

    dayjs.locale(`${language}`);

    const date = dayjs();
    useEffect(() => {
      const toTranslate = eventArr.map((evt) => evt?.title ?? '');

      // don't translate errors/not loaded
      if (toTranslate[0] === undefined) {
        // setTranslation(toTranslate);
        setCalendarModalTranslatables(toTranslate);
        return;
      }

      // only use translation resources if content
      if (eventArr.length < 1) {
        setCalendarModalTranslatables(toTranslate);
        return;
      }

      msTranslate({
        toTranslate,
        language,
        setTranslation: setCalendarModalTranslatables,
        useLS: false,
      });
    }, [eventArr, language, shouldRenderDays]);

    useEffect(() => {
      function mapIdsToTitles(
        eventArr: CalendarEventModel[],
        translatedTitles: string[]
      ) {
        const lookup: { [key: string]: string } = {};
        eventArr.forEach((evt, idx) => {
          lookup[evt.eventId] = translatedTitles[idx];
        });

        return lookup;
      }

      const lookup = mapIdsToTitles(eventArr, calendarModalTranslatables);

      setCalendarEventLookup(lookup);
    }, [eventArr, calendarModalTranslatables]);

    return (
      <Box component="div" marginLeft={'65px'} className="calendar-container">
        <Helmet>
          <meta name="calendar" content="Polk County Calendar" />
        </Helmet>
        {currUser && (
          <Box component="div">
            <Box
              component="div"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap-reverse',
                gap: 5,
              }}
            >
              <Box
                component="div"
                flex={1}
                display={'flex'}
                flexDirection={'column'}
              >
                <Autocomplete
                  sx={{
                    flex: 1,
                    minWidth: 250,
                    maxWidth: 350,
                    display:
                      calTabValue === CalendarTabValue.personal
                        ? 'block'
                        : 'none',
                  }}
                  onChange={(evt, opt) => {
                    if (opt && typeof opt !== 'string' && opt.label) {
                      onSearchOptChg(opt.label, db);
                    }

                    handleSearchSubmit();
                  }}
                  options={searchOptions}
                  ref={(element: any) => {
                    if (element) {
                      setAutocompleteRef(element);
                    }
                  }}
                  filterOptions={(x) => x}
                  freeSolo={true}
                  renderInput={(
                    renderInputParams: AutocompleteRenderInputParams
                  ) => (
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
                        placeholder={`${t('autocomp_placeholder')}...`}
                        inputProps={{
                          ...renderInputParams.inputProps,
                        }}
                        InputLabelProps={{ style: { display: 'none' } }}
                      />
                    </div>
                  )}
                />
              </Box>
              <Tabs
                sx={{
                  flex: 1,
                  minWidth: 150,
                }}
                centered
                value={calTabValue}
                onChange={(evt, val) => {
                  handleCalTabChange(val, db, calendarId);
                }}
                aria-label="Calendar tab community or personal"
              >
                <Tab
                  value={CalendarTabValue.personal}
                  icon={<PersonIcon />}
                  {...a11yProps(1)}
                />
                <Tab
                  value={CalendarTabValue.community}
                  icon={<GroupsIcon />}
                  {...a11yProps(0)}
                />
              </Tabs>
            </Box>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={
                esES.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <CalendarPicker
                date={dayjs()}
                onChange={(pickedDay) => {
                  if (!isEditable) {
                    return;
                  }

                  addEventToArr({
                    eventId: uuidv4(),
                    calendarId: calendarId,
                    timeStart: pickedDay?.toDate(),
                    recurring: RecurringTime.Once,
                    status: CalendarEventStatus.active,
                    isHoliday: false,
                  });

                  setIsNewEvt(true);
                  setCurrentEventIdx(eventArr.length - 1);
                  setShowEventModal(true);
                }}
                dayOfWeekFormatter={(day) => {
                  return day;
                }}
                renderDay={(day, _value, DayComponentProps) => {
                  return (
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        flex: 1,
                      }}
                    >
                      <PickersDay
                        {...DayComponentProps}
                        sx={{
                          alignSelf: 'center',
                          margin: 1,
                        }}
                      />
                      <Box component="div">
                        {!DayComponentProps.outsideCurrentMonth &&
                          // DaysDisplay goes here
                          shouldRenderDays &&
                          applyCurrFilter(day).map((evt) => {
                            return (
                              <Card
                                key={`${evt.eventId}`}
                                sx={{
                                  background:
                                    evt.status === CalendarEventStatus.active
                                      ? evt.color
                                      : `repeating-linear-gradient(
                                  45deg,
                                  #5A5A5A,
                                  #5A5A5A 10px,
                                  #808080 10px,
                                  #808080 20px
                                )`,
                                  opacity: 0.75,
                                  flex: 1,
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                <CardActionArea
                                  id={`${evt.eventId}`}
                                  onClick={(onClickEvt) => {
                                    setIsNewEvt(false);
                                    const evtIdx = eventArr.findIndex((evt) => {
                                      return (
                                        evt.eventId ===
                                        onClickEvt.currentTarget.id
                                      );
                                    });

                                    if (
                                      evtIdx > -1 &&
                                      (currUser.userType ===
                                        IUserType.dashboardAdmin ||
                                        currUser.userType ===
                                          IUserType.fullAdmin)
                                    ) {
                                      if (eventArr[evtIdx]?.isHoliday) {
                                        setCurrentEventIdx(evtIdx);
                                        setShowDetailTextFieldModal(true);
                                      } else {
                                        setCurrentEventIdx(evtIdx);
                                        setShowEventModal(true);
                                      }
                                    } else if (evtIdx > -1) {
                                      setCurrentEventIdx(evtIdx);
                                      setShowEventDetailModal(true);
                                    }
                                  }}
                                >
                                  <Typography
                                    color={theme.palette.text.primary}
                                    variant="body1"
                                    fontSize={'2vw'}
                                  >
                                    {_.truncate(
                                      calendarEventLookup[
                                        evt.eventId as keyof typeof calendarEventLookup
                                      ] ?? evt.title
                                    )}
                                  </Typography>
                                </CardActionArea>
                              </Card>
                            );
                          })}
                      </Box>
                    </Card>
                  );
                }}
              />
            </LocalizationProvider>
          </Box>
        )}
        {/* <CalendarEventModal currUser={currUser} db={db} /> */}
        <CalendarEventDetailModal
          setShowEventDetailModal={setShowEventDetailModal}
          showEventDetailModal={showEventDetailModal}
          currentEvent={eventArr.length > 0 ? eventArr[currentEventIdx] : null}
        />
        <Modal
          open={showDetailTextFieldModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            component="div"
            className="instruction-modal-wrapper"
            sx={{
              ...style,
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Editor
              namespace="detail-editor"
              showToolbar={true}
              readOnly={false}
              detail={eventArr[currentEventIdx]?.detail || ''}
              saveDetails={saveDetails}
            />
            {/* <TextField
              sx={{
                alignSelf: 'stretch',
              }}
              id="event-detail"
              label="Details"
              multiline
              rows={4}
              value={currentEvent?.detail}
              onChange={(
                evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                currentEvent.detail = evt.target.value
              }}
            /> */}
            {/* <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setShowDetailTextFieldModal(false);
              }}
            >
              Done
            </Button> */}
          </Box>
        </Modal>
      </Box>
    );
  }
);

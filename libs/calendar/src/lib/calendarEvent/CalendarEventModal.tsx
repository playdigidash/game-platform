import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  SvgIcon,
  Avatar,
  Popover,
  Menu,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import ApiCalendar from 'react-google-calendar-api';
import moment from 'moment';
import ICalendarLink from 'react-icalendar-link';

import GoogleIcon from '@mui/icons-material/Google';
import goosvg from './google-signin-buttons-assets/btn_google_light_normal_ios.svg';
import outLookLogo from './calendar-assets/outlook.png';
import googleLogo from './calendar-assets/google.png';
import icalLogo from './calendar-assets/ical.png';
import yahooLogo from './calendar-assets/yahoo.png';
import {
  CalendarEventModel,
  CalendarEventStatus,
  Editor,
  msTranslate,
  environmentConfig,
} from '@lidvizion/commonlib';
import { useCalendarStore } from '../RootStore/RootStoreProvider';
import { ICalEvent } from 'react-icalendar-link/dist/utils';

const googleConfig = environmentConfig.getGoogleConfig();
const config = {
  clientId: googleConfig?.clientId || '',
  apiKey: googleConfig?.calendarApiKey || '',
  scope: 'https://www.googleapis.com/auth/calendar',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ],
};

const apiCalendar = new ApiCalendar(config);

interface ICalendarEventModal {
  showEventDetailModal: boolean;
  currentEvent: CalendarEventModel | null;
  setShowEventDetailModal: (bool: boolean) => void;
}

export const CalendarEventModal: React.FC<ICalendarEventModal> = observer(
  ({ showEventDetailModal, currentEvent, setShowEventDetailModal }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const mailOptsOpen = Boolean(anchorEl);

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '60vh',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: 1,
    };

    const icsEvent: ICalEvent = {
      title: currentEvent?.title || '',
      description: currentEvent?.detail || '',
      startTime: '2018-10-07T10:30:00+10:00',
      endTime: '2018-10-07T12:00:00+10:00',
      location: '10 Carlotta St, Artarmon NSW 2064, Australia',
      attendees: ['Hello World <hello@world.com>', 'Hey <hey@test.com>'],
    };

    const handleOnClick = async () => await apiCalendar.handleAuthClick();

    const handleAddToCal = async () => {
      try {
        // await apiCalendar.handleAuthClick(); // Handle authentication

        // Proceed with adding event to calendar if authentication is successful
        const start = moment(currentEvent?.timeStart).format(
          'YYYY-MM-DDTHH:mm:ssZ'
        );
        const end = moment(currentEvent?.timeEnd).format(
          'YYYY-MM-DDTHH:mm:ssZ'
        );

        const event = {
          summary: currentEvent?.title,
          location: 'Somewhere in New York',
          description: currentEvent?.detail,
          start: {
            dateTime: start,
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: end,
            timeZone: 'America/Los_Angeles',
          },
        };

        apiCalendar.createEvent(event).then(({ result }: any) => {
          console.log(result.items);
        });

        // const icsCal = ical({name: 'my first iCal'});
        // const _startTime = new Date();
        // const _endTime = new Date();
        // _endTime.setHours(_startTime.getHours()+1);
        // icsCal.createEvent({
        //     start: _startTime,
        //     end: _endTime,
        //     summary: 'Example Event',
        //     description: 'It works ;)',
        //     location: 'my room',
        //     url: 'http://sebbo.net/'
        // });
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };

    // const handleOnClick = async () => apiCalendar.handleAuthClick

    const {
      calendarEventDetailTranslatables,
      setCalendarEventDetailTranslatables,
    } = useCalendarStore().calendarViewStore;

    const {
      t,
      i18n: { language },
    } = useTranslation('calendar_event_modal');

    useEffect(() => {
      const toTranslate = [`${currentEvent?.title}`];

      msTranslate({
        toTranslate,
        language,
        setTranslation: setCalendarEventDetailTranslatables,
        useLS: false,
        storageKey: null,
      });
    }, [currentEvent?.title, language]);

    return (
      <Modal
        open={showEventDetailModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="div" className="instruction-modal-wrapper" sx={style}>
          <Box
            component="div"
            display={'flex'}
            justifyContent={'space-between'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            {currentEvent?.status === CalendarEventStatus.canceled ? (
              <Typography variant="h6" color={'red'}>
                {t('canceled')}
              </Typography>
            ) : (
              <Typography></Typography>
            )}

            <IconButton
              sx={{ borderRadius: 0, alignSelf: 'flex-end' }}
              onClick={() => setShowEventDetailModal(false)}
            >
              <CloseIcon />
            </IconButton>

            <Box component="div" sx={{ display: 'flex', marginTop: 4 }}>
              <Typography sx={{ marginBottom: '1em' }}>
                {calendarEventDetailTranslatables[0]}
              </Typography>
            </Box>
            <Divider />

            <Box component="div" sx={{ display: 'flex', flexDirection: 'row' }}>
              {/* <Button sx={{marginRight: '1em'}} variant="contained" startIcon={<GoogleIcon />} onClick={handleOnClick}>
                  Add to Calendar
                </Button> */}

              {/* <ICalendarLink event={icsEvent}>
                  Add to Calendar
                </ICalendarLink> */}
              <Box component="div">
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  variant="contained"
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Calendar Options
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <Chip
                      avatar={<Avatar alt="google" src={googleLogo} />}
                      label="Add to Google"
                      variant="outlined"
                      onClick={() => {
                        handleOnClick();
                        handleAddToCal();
                      }}
                      sx={{ p: '2vh' }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Chip
                      avatar={<Avatar alt="outlook" src={outLookLogo} />}
                      label="Add to Outlook"
                      variant="outlined"
                      sx={{ p: '2vh' }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Chip
                      avatar={<Avatar alt="yahoo" src={yahooLogo} />}
                      label="Add to Yahoo"
                      variant="outlined"
                      sx={{ p: '2vh' }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Chip
                      avatar={<Avatar alt="ical" src={icalLogo} />}
                      label="Add to iCal"
                      variant="outlined"
                      sx={{ p: '2vh' }}
                    />
                  </MenuItem>
                  <MenuItem>
                    <Button>
                      {/* TODO: fix calendar link issue
                     <ICalendarLink event={icsEvent}>
                      Download event
                    </ICalendarLink> */}
                    </Button>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            <Editor
              readOnly={true}
              showToolbar={false}
              detail={currentEvent?.detail || ''}
              namespace={'calendar-detail'}
            />
            {currentEvent?.isAllDay ? (
              <Typography>{t('all_day')}</Typography>
            ) : (
              <Box
                component="div"
                display="flex"
                sx={{
                  gap: 1,
                }}
              >
                {currentEvent && currentEvent.timeStart && (
                  <Typography>
                    {dayjs(currentEvent.timeStart).format('MM/DD/YYYY')}
                  </Typography>
                )}
                {currentEvent && currentEvent.timeStart && (
                  <Typography>
                    {dayjs(currentEvent.timeStart).format('hh:mm a')}
                  </Typography>
                )}
                {currentEvent && currentEvent.timeEnd && (
                  <>
                    <Typography>{`\u2022`}</Typography>
                    <Typography>
                      {dayjs(currentEvent.timeEnd).format('hh:mm a')}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    );
  }
);

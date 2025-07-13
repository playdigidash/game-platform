import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import outLookLogo from './calendar-assets/outlook.png';
import googleLogo from './calendar-assets/google.png';
import icalLogo from './calendar-assets/ical.png';
import yahooLogo from './calendar-assets/yahoo.png';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  CalendarEventModel,
  CalendarEventStatus,
  Editor,
  msTranslate,
} from '@lidvizion/commonlib';
import { useCalendarStore } from '../RootStore/RootStoreProvider';
import { CalendarViewStore } from './CalendarViewStore';

interface ICalendarEventDetailModal {
  showEventDetailModal: boolean;
  currentEvent: CalendarEventModel | null;
  setShowEventDetailModal: (bool: boolean) => void;
}

export const CalendarEventDetailModal: React.FC<ICalendarEventDetailModal> =
  observer(
    ({ showEventDetailModal, currentEvent, setShowEventDetailModal }) => {
      const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
      const open = Boolean(anchorEl);

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      // const handleOnClick = async () => await apiCalendar.handleAuthClick()

      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 350,
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

              <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'row' }}
              >
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

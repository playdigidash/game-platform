import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  useTheme,
  MenuItem,
  IconButton,
  alpha,
} from '@mui/material';
import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';

import { Dropzone, FileItem, FileValidated } from '@dropzone-ui/react';
import {
  defaultModalStyle,
  useMongoDB,
  useRealmApp,
} from '@lidvizion/commonlib';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { useTranslation } from 'react-i18next';

const dropDownOpts = [
  {
    value: 'Hero',
    label: 'Hero/Avatar',
  },
  {
    value: 'Points',
    label: 'Points',
  },
  {
    value: 'Questions/Answers',
    label: 'Questions/Answers',
  },
  {
    value: 'Leaderboard',
    label: 'Leaderboard',
  },
  {
    value: 'Settings',
    label: 'Settings',
  },
  {
    value: 'Other',
    label: 'Other',
  },
];

export const FeedbackModal: React.FC<{ show: boolean; onClose: () => void }> =
  observer(({ show, onClose }) => {
    const {
      setShowFeedbackModal,
      showFeedbackModal,
      setEmail,
      setDescription,
      email,
      description,
      topic,
      setTopic,
      submitFeedback,
      setFiles,
      files,
      setShowSuccessSnackbar,
      setMsg,
    } = useGameStore().feedbackModalViewStore;
    const { db } = useMongoDB();
    const { app } = useRealmApp();
    const updateFiles = (incommingFiles: FileValidated[]) => {
      setFiles(incommingFiles);
    };
    const webhookUrl =
      'https://hooks.slack.com/services/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';

    const navigate = useNavigate();
    const handleSubmitFeedback = async () => {
      setShowFeedbackModal(false);

      const feedbackData = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Email: *${email}*\n\n Topic: *${topic}*\n\n Description: *${description}*`,
            },
          },
          {
            type: 'divider',
          },
        ],
      };

      const res = await axios.post(webhookUrl, JSON.stringify(feedbackData), {
        withCredentials: false,
        transformRequest: [
          (feedbackData, headers) => {
            delete axios.defaults.headers.post['Content-Type'];
            return feedbackData;
          },
        ],
      });

      if (res.status === 200) {
        alert('Message sent');
      } else {
        alert('Error sending message. Please try again later!');
      }

      setMsg('Feedback Received!');
      setShowSuccessSnackbar(true);
    };

    const { t } = useTranslation('feedback_modal');
    const theme = useTheme();

    console.log('FeedbackModal rendered with show:', show);

    return (
      <Modal
        open={show}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={onClose}
      >
        <Box
          component="div"
          sx={{
            ...defaultModalStyle,
            padding: '2rem',
            width: {
              xs: '90vw', // 90% of viewport width on extra-small screens
              sm: '85vw', // 85% of viewport width on small screens
              md: '75vw', // 75% of viewport width on medium screens
              lg: '65vw', // 65% of viewport width on large screens
            },
            height: 'auto',
            maxHeight: '90vh',
            overflow: 'auto', // Allow scrolling if content overflows
            backgroundColor: 'rgba(255, 255, 255, 0)', // Fully transparent background
            backdropFilter: 'blur(10px)', // Add blur effect to the background
            borderRadius: '10px', // Rounded corners
            position: 'relative',
          }}
        >
          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              sx={{
                alignSelf: 'center',
                color: 'white', // Set label color
                fontSize: '1rem', // Set font size
              }}
            >
              {t('We Value Your Feedback!')}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: '#FFFFFF',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box component="div" sx={{ flex: '0 1 70%', mr: 3 }}>
              <TextField
                label={t('Email')}
                autoFocus
                placeholder={
                  t('name@email.com - if you want us to keep you updated') ||
                  'Enter your email'
                }
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputInput-input': {
                    color: 'white',
                  },
                }}
                onChange={(
                  evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  setEmail(evt.target.value);
                }}
                type={'email'}
                id={'email-for-feedback-modal'}
              />

              <TextField
                id="outlined-select-currency"
                select
                label={t('Feedback Type')}
                required
                defaultValue={t('find')}
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiSelect-select': {
                    color: 'white',
                  },
                }}
              >
                {dropDownOpts.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    onClick={() => setTopic(option.value)}
                    sx={{
                      '& .MuiMenuItem-root': {
                        color: 'white',
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: 'gray',
                      },
                      '& .MuiMenuItem-root:selected': {
                        backgroundColor: 'gray',
                      },
                    }}
                  >
                    {t(`${option.value}`)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                style={{ marginTop: '1vh' }}
                multiline
                variant="outlined"
                label="Description"
                placeholder={
                  'How can we improve? Feel free to upload a screenshot!'
                }
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  textarea: { color: 'white' }, // Ensure textarea text color is white

                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputInput-input': {
                    color: 'white',
                  },
                }}
                required
                onChange={(
                  evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  setDescription(evt.target.value);
                }}
                id={'description-for-feedback-modal'}
              />
            </Box>
            <Box component="div" sx={{ flex: 2, alignSelf: 'flex-center' }}>
              <Dropzone
                style={{
                  background: theme.palette.background.default,
                  fontSize: '0.7rem',
                  alignSelf: 'flex-end', // Align to bottom of row
                }}
                accept={'image file'}
                label={`${t('file_insert_label')}`}
                minHeight={'100px'}
                maxHeight={'100px'}
                onChange={updateFiles}
                value={files}
              >
                {files.map((file: FileValidated, idx: number) => (
                  <FileItem
                    key={`${file.file.name}-${idx}`}
                    {...file}
                    preview
                  />
                ))}
              </Dropzone>
            </Box>
          </Box>
          <Button
            variant="contained"
            disabled={!description}
            fullWidth
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              width: '100%',
              fontSize: '1em',
              padding: '1em',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.85),
                transform: 'scale(1.02)',
              },
              '&:disabled': {
                backgroundColor: theme.palette.grey[600],
                color: theme.palette.grey[400],
              },
            })}
            onClick={() => {
              if (db && app && app.currentUser) {
                handleSubmitFeedback();
              }
            }}
          >
            {t('Submit Feedback')}
          </Button>
        </Box>
      </Modal>
    );
  });

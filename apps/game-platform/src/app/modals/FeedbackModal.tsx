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
  Snackbar,
  Alert,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';

import { Dropzone, FileItem, FileValidated } from '@dropzone-ui/react';
import {
  defaultModalStyle,
  useMongoDB,
  useRealmApp,
  getUserProfile,
} from '@lidvizion/commonlib';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { useTranslation } from 'react-i18next';

export const FeedbackModal: React.FC<{ show: boolean; onClose: () => void }> =
  observer(({ show, onClose }) => {
    const {
      setEmail,
      setDescription,
      email,
      description,
      topic,
      setTopic,
      files,
      setFiles,
      handleSubmitFeedback,
      fetchCreatorEmail,
      showSuccessSnackbar,
      setShowSuccessSnackbar,
      msg
    } = useGameStore().feedbackModalViewStore;
    const { gameSession } = useGameStore().gameViewStore;
    const { db } = useMongoDB();
    const { app } = useRealmApp();
    const { t } = useTranslation('feedback_modal');
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { translatedGameData } = useGameStore().translateViewStore;
    const emailLabel = translatedGameData?.emailLabel || 'Email';
    const enterYourEmailLabel = translatedGameData?.enterYourEmailLabel || 'Enter your email';
    const feedbackTypeLabel = translatedGameData?.feedbackTypeLabel || 'Feedback Type';
    const feedbackPlaceholderLabel = translatedGameData?.feedbackPlaceholderLabel || 'How can we improve? Feel free to upload a screenshot!';
    const heroLabel = translatedGameData?.heroLabel || 'Hero';
    const pointsLabel = translatedGameData?.pointsLabel || 'Points';
    const questionsAnswersLabel = translatedGameData?.questionsAnswersLabel || 'Questions/Answers';
    const leaderboardLabel = translatedGameData?.leaderboardLabel || 'Leaderboard';
    const settingsLabel = translatedGameData?.settingsLabel || 'Settings';
    const otherLabel = translatedGameData?.otherLabel || 'Other';
    const descriptionLabel = translatedGameData?.descriptionLabel || 'Description';
    const submitFeedbackLabel = translatedGameData?.submitFeedbackLabel || 'Submit Feedback';
    const submittingLabel = translatedGameData?.submittingLabel || 'Submitting';

    const dropDownOpts = [
      {
        value: 'Hero',
        label: heroLabel,
      },
      {
        value: 'Points',
        label: pointsLabel,
      },
      {
        value: 'Questions/Answers',
        label: questionsAnswersLabel,
      },
      {
        value: 'Leaderboard',
        label: leaderboardLabel,
      },
      {
        value: 'Settings',
        label: settingsLabel,
      },
      {
        value: 'Other',
        label: otherLabel,
      },
    ];


    useEffect(() => {
      fetchCreatorEmail();
    }, [fetchCreatorEmail]);

    const handleSubmit = async () => {
      try {
        setIsSubmitting(true);
        if (!db || !app || !app.currentUser) {
          throw new Error('Not authenticated');
        }
        await handleSubmitFeedback();
      } catch (error) {
        console.error('Error submitting feedback:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const webhookUrl =
      'https://hooks.slack.com/services/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';

    const navigate = useNavigate();

    return (
      <Box
        component="div"
        sx={{
          padding: '2rem',
          width: {
            xs: '90vw',
            sm: '85vw',
            md: '75vw',
            lg: '65vw',
          },
          height: 'auto',
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          position: 'relative',
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box component="div" sx={{ flex: '0 1 70%', mr: 3 }}>
            <TextField
              label={emailLabel}
              autoFocus
              placeholder={enterYourEmailLabel}
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
              label={feedbackTypeLabel}
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
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              style={{ marginTop: '1vh' }}
              multiline
              variant="outlined"
              label={descriptionLabel}
              placeholder={feedbackPlaceholderLabel}
              fullWidth
              sx={{
                mb: 2,
                input: { color: 'white' },
                textarea: { color: 'white' },
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
                alignSelf: 'flex-end',
              }}
              accept={'image file'}
              label={`${t('file_insert_label')}`}
              minHeight={'100px'}
              maxHeight={'100px'}
              onChange={setFiles}
              value={files}
            >
              {files.map((file, idx: number) => (
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
          disabled={!description || isSubmitting}
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
          onClick={handleSubmit}
        >
          {isSubmitting ? `${submittingLabel}...` : submitFeedbackLabel}
        </Button>

        <Snackbar 
          open={showSuccessSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setShowSuccessSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={msg.includes('Error') ? 'error' : 'success'} 
            sx={{ width: '100%' }}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Box>
    );
  }); 
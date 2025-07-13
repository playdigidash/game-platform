import { makeAutoObservable, runInAction } from 'mobx';
import { FileValidated } from '@dropzone-ui/react';
import { RootStore } from '../RootStore/RootStore';
import axios from 'axios';
import { getUserProfile, environmentConfig } from '@lidvizion/commonlib';

export class FeedbackModalViewStore {
  email = '';
  description = '';
  topic = '';
  files: FileValidated[] = [];
  creatorEmail = '';
  showSuccessSnackbar = false;
  msg = '';
  
  // Use environment configuration
  private readonly webhookUrl = environmentConfig.getSlackConfig()?.webhookUrl ?? '';

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  setEmail = (email: string) => {
    this.email = email;
  };

  setDescription = (description: string) => {
    this.description = description;
  };

  setTopic = (topic: string) => {
    this.topic = topic;
  };

  setFiles = (files: FileValidated[]) => {
    this.files = files;
  };

  setShowSuccessSnackbar = (show: boolean) => {
    this.showSuccessSnackbar = show;
  };

  setMsg = (msg: string) => {
    this.msg = msg;
  };

  clearForm = () => {
    runInAction(() => {
      this.email = '';
      this.description = '';
      this.topic = '';
      this.files = [];
    });
  };

  fetchCreatorEmail = async () => {
    try {
      const { gameSession } = this.rootStore.gameViewStore;
      if (!this.rootStore.db || !gameSession?.gameCreatoruid) return;

      const userProfile = await getUserProfile(this.rootStore.db, gameSession.gameCreatoruid);
      if (userProfile?.email) {
        runInAction(() => {
          this.creatorEmail = userProfile.email;
        });
      }
    } catch (error) {
      console.error('Error fetching creator email:', error);
    }
  };

  handleSubmitFeedback = async () => {
    try {
      if (!this.webhookUrl) {
        throw new Error('Webhook URL not configured');
      }
      
      const { gameSession } = this.rootStore.gameViewStore;
      if (!this.rootStore.db || !gameSession) return;

      const feedbackData = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New Feedback Received*\nFrom: *${this.email}*\nGame ID: *${gameSession.gameId}*\nCreator Email: *${this.creatorEmail}*\nTopic: *${this.topic}*\n\nDescription: *${this.description}*`,
            },
          },
          {
            type: 'divider',
          },
        ],
      };

      const res = await axios.post(this.webhookUrl, JSON.stringify(feedbackData), {
        withCredentials: false,
        transformRequest: [
          (data, headers) => {
            delete axios.defaults.headers.post['Content-Type'];
            return data;
          },
        ],
      });

      if (res.status === 200) {
        runInAction(() => {
          this.msg = 'Thank you for your feedback!';
          this.showSuccessSnackbar = true;
          this.clearForm();
        });
      } else {
        throw new Error('Failed to send feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      runInAction(() => {
        this.msg = 'Error sending feedback. Please try again later.';
        this.showSuccessSnackbar = true;
      });
    }
  };
} 
import { FileValidated } from '@dropzone-ui/react'
import { RootStore } from '../RootStore/RootStore';
import { saveFeedback, saveUserData, getBase64, getUserProfile } from '@lidvizion/commonlib';
import { action, makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

export interface IFeedbackInfo {
    userid: string;
    description: string;
    imageStr: string;
    topic: string;
    email: string;
    _partition: string;
}

export class FeedbackModalViewStore{
    root:RootStore
    email = ''
    description = ''
    topic = ''
    showFeedbackModal = false
    isFeedbackValid = false
    files:FileValidated[] = []
    incommingFiles: FileValidated[] = []
    showSuccessSnackbar = false
    msg = ''
    creatorEmail = ''
    private readonly webhookUrl = 'https://hooks.slack.com/services/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'

    constructor(root:RootStore){
        this.root = root
        makeAutoObservable(this)
    }

    getB64 = action(async()=>{
        return new Promise<string>((resolve, reject) => {
            getBase64(this.files[0],(res)=>{
                resolve(res)
            })  
        })
    })
    setMsg = action((msg:string)=>{
        this.msg = msg
    })
  
    setShowSuccessSnackbar = action((bool:boolean)=>{
        this.showSuccessSnackbar = bool
    })

    setEmail = action((val:string) => {
        this.email = val
    })
    setDescription = action((val:string) => {
        this.description = val
    })
    setTopic = action((val:string) => {
        this.topic = val
    })
    setShowFeedbackModal = action((bool: boolean) => {
        this.showFeedbackModal = bool
    })
    setIsFeedbackValid = action((bool: boolean) => {
        this.isFeedbackValid = bool
    })
    setFiles = action((files:FileValidated[])=>{
        this.files = files
    })
    setCreatorEmail = action((email: string) => {
        this.creatorEmail = email;
    });

    submitFeedback = action(async (db:Realm.Services.MongoDBDatabase, userid:string, realmUser:Realm.User)=>{
        let imageStr = ''
        if(this.files.length > 0) {
            imageStr = await this.getB64() 
        }

        saveFeedback(db, 
            {
            userid,
            description: this.description,
            imageStr,
            email: this.email,
            _partition: 'feedback'
        })

        // if(this.root.userViewStore.currUser?.stats?.feedbackCount){
        //     this.root.userViewStore.currUser.stats.feedbackCount += 1
        //     saveUserData(db, this.root.userViewStore.currUser, realmUser)
        // } else {
        //     console.error('User not found')
        // }
    })

    fetchCreatorEmail = action(async () => {
        if (this.root.db && this.root.gameViewStore.gameSession?.gameCreatoruid) {
            try {
                const creatorProfile = await getUserProfile(
                    this.root.db,
                    this.root.gameViewStore.gameSession.gameCreatoruid
                );
                if (creatorProfile?.email) {
                    runInAction(() => {
                        this.creatorEmail = creatorProfile.email;
                    });
                }
            } catch (error) {
                console.error('Error fetching creator email:', error);
            }
        }
    });

    handleSubmitFeedback = action(async () => {
        if (!this.root.db) return;

        this.setShowFeedbackModal(false);

        // Since this feedback form is used before a game starts,
        // prioritize getting the gameId from activePreviewGame
        const activeGameId = this.root.gameLibraryViewStore.activePreviewGame?.moduleId;
        
        // Use activeGameId or fallback to N/A
        const gameId = activeGameId || 'N/A';

        const feedbackData = {
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Email: *${this.email}*\nTopic: *${this.topic}*\nGame ID: *${gameId}*\nGame Creator: *${this.creatorEmail || 'N/A'}*\n\nDescription: *${this.description}*`,
                    },
                },
                {
                    type: 'divider',
                },
            ],
        };

        try {
            const res = await axios.post(this.webhookUrl, JSON.stringify(feedbackData), {
                withCredentials: false,
                transformRequest: [
                    (data, headers) => {
                        delete headers['Content-Type'];
                        return data;
                    },
                ],
            });

            if (res.status === 200) {
                // Clear form fields
                runInAction(() => {
                    this.email = '';
                    this.description = '';
                    this.topic = '';
                    this.files = [];
                    this.creatorEmail = '';
                });

                // Show success message
                this.setMsg('Thank you for your feedback!');
                this.setShowSuccessSnackbar(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    runInAction(() => {
                        this.setShowSuccessSnackbar(false);
                    });
                }, 3000);
            } else {
                throw new Error('Failed to send feedback');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            alert('Error sending message. Please try again later!');
        }
    });
}
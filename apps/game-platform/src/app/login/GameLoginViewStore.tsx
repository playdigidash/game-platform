import {
  checkEmailExists,
  checkIsEmailOrPhone,
  getCurrUsrModProgress,
  IGameUserModel,
  IRealmContext,
  LoginLvl,
  LoginType,
  TokenVerifyMsg,
  updateGameSession,
  updateGameUser,
  waitForSpecifiedTime,
  getGameProfileByUid,
  updateUserProfile,
} from '@lidvizion/commonlib';
import { RootStore } from '../RootStore/RootStore';
import { action, makeAutoObservable, reaction, runInAction } from 'mobx';
import { checkIdentities } from '@lidvizion/login';
import { CurrentEndGameStep } from '../Common';
import moment from 'moment';
import { Filter } from 'bad-words';

export class GameLoginViewStore {
  root: RootStore;
  realmContext: IRealmContext;
  currUser: IGameUserModel | null = null;
  isLoading = false;
  showVerifyTokenModal = false;
  tokenVerifyMsg = TokenVerifyMsg.verifying;
  showLoginModal = false;

  // --- Display Name State (Moved from SettingsViewStore) ---
  @action displayNameInput = '';
  @action isUpdatingDisplayName = false;
  @action displayNameUpdateError: string | null = null;
  @action displayNameUpdateSuccess: string | null = null;
  // --- End Display Name State ---

  private filter = new Filter();

  constructor(root: RootStore, realmContext: IRealmContext) {
    this.root = root;
    this.realmContext = realmContext;
    makeAutoObservable(this);

    reaction(
      () => this.currUser,
      async () => {
        await this.root.gameViewStore.getCurrQuest();
      }
    );
  }

  get isAnonLogin() {
    const isAnonLogin =
      !this.currUser || this.currUser.providerType === LoginType.anonymous;
    return isAnonLogin;
  }

  get forceLogin() {
    let bool = false;
    // if (
    //   this.root.gamePlayViewStore.questionCounter > 0 &&
    //   this.root.gameViewStore.settings.gameLoginLvl > LoginLvl.low &&
    //   this.isAnonLogin
    // ) {
    //   bool = true;
    // } else
    if (this.showLoginModal) {
      bool = true;
    } else if (
      this.root.endGameViewStore.isEndGameModalOpen &&
      this.root.endGameViewStore.currentStep ===
        CurrentEndGameStep.leaderboard &&
      (this.root.gameViewStore.settings?.settings?.gameLoginLvl ??
        LoginLvl.none) > LoginLvl.none &&
      this.isAnonLogin
    ) {
      bool = true;
    } else if (
      this.root.endGameViewStore.currentStep ===
        CurrentEndGameStep.leaderboard &&
      this.root.endGameViewStore.wantsToTrackProgress &&
      this.isAnonLogin
    ) {
      bool = true;
    } else if (
      this.root.endGameViewStore.currentStep ===
        CurrentEndGameStep.scoreboard &&
      this.root.endGameViewStore.wantsToTrackProgress &&
      this.isAnonLogin
    ) {
      bool = true;
    }

    return bool;
  }

  setShowVerifyTokenModal = action((bool: boolean) => {
    this.showVerifyTokenModal = bool;
  });

  setShowLoginModal = action((bool: boolean) => {
    this.showLoginModal = bool;
  });

  setTokenVerifyMsg = action((str: TokenVerifyMsg) => {
    this.tokenVerifyMsg = str;
  });

  setCurrUser = action((user: IGameUserModel | null) => {
    this.currUser = user;
  });

  setIsLoading = action((bool: boolean) => {
    this.isLoading = bool;
  });

  updateCurrentUserDisplayName = (newName: string) => {
    action(() => {
      if (this.currUser) {
        console.log(
          `[GameLoginViewStore] Updating currUser displayName from "${this.currUser.displayName}" to "${newName}"`
        );
        this.currUser.displayName = newName;
        // Optionally trigger an update or reaction if needed elsewhere,
        // but MobX should handle reactivity for components observing currUser.
      }
    })();
  };

  handleAfterLogin = action(
    async (
      currentUser: Realm.User<
        Realm.DefaultFunctionsFactory,
        SimpleObject,
        Realm.DefaultUserProfileData
      >
    ) => {
      const now = moment().valueOf();
      const uid = currentUser.id; // Use Realm User ID as our consistent UID
      let gameUser: IGameUserModel | null = null;

      // 1. Fetch Existing Profile using UID
      try {
        const existingProfile = await getGameProfileByUid(this.root.db, uid);

        // 2. Determine Login Identifier (Email/Phone)
        // Attempt to get email, handle phone logic if necessary
        const loginIdentifier = currentUser.profile?.email; // May be null for phone
        let isEmail = false;
        let isPhone = false;
        let checkedVal = '';

        if (loginIdentifier) {
          const checkResult = checkIsEmailOrPhone(loginIdentifier);
          isEmail = checkResult.isEmail;
          isPhone = checkResult.isPhone;
          checkedVal = checkResult.checkedVal;
        } else {
          // Handle potential phone login - Realm might store phone differently.
          // For now, assume we might not have it readily available here if email is null.
          // We'll primarily rely on UID for linking.
          // We could potentially try to parse the uid or check identities if needed.
        }

        // 3. Construct/Merge gameUser object
        if (existingProfile) {
          gameUser = {
            ...existingProfile,
            // Ensure essential fields are present
            uid: existingProfile.uid || uid,
            email: existingProfile.email || '',
            phone: existingProfile.phone || '',
            displayName: existingProfile.displayName || '',
            metadata: {
              ...existingProfile.metadata,
              updatedAt: now,
              lastLogin: now,
            },
            providerType: currentUser.providerType, // Update provider type
            identities: existingProfile.identities || [], // Ensure identities array exists
            username: existingProfile.username || (isEmail ? checkedVal : uid), // Update username if needed
          };

          // Update email/phone if identifier was found and differs
          if (isEmail && checkedVal && gameUser.email !== checkedVal) {
            console.log(
              '[GameLoginViewStore] Updating email for existing user.'
            );
            gameUser.email = checkedVal;
          }
          // Add similar logic for phone if `isPhone` and `checkedVal` are populated
          if (isPhone && checkedVal && gameUser.phone !== checkedVal) {
            console.log(
              '[GameLoginViewStore] Updating phone for existing user.'
            );
            gameUser.phone = checkedVal;
          }

          // Ensure current identity is included
          const currentIdentity = {
            id: currentUser.id,
            providerType: currentUser.providerType,
          };
          if (
            !gameUser.identities?.some((id) => id.id === currentIdentity.id)
          ) {
            console.log(
              '[GameLoginViewStore] Adding current identity to existing user.'
            );
            gameUser.identities = [
              ...(gameUser.identities || []),
              currentIdentity,
            ];
          }
        } else {
          console.log(
            '[GameLoginViewStore] Creating new game profile for UID:',
            uid
          );
          gameUser = {
            uid: uid,
            email: isEmail ? checkedVal : '',
            phone: isPhone ? checkedVal : '', // Populate phone if identified
            displayName: '', // Will be generated later if empty
            metadata: {
              createdAt: now,
              updatedAt: now,
              lastLogin: now,
            },
            username: isEmail ? checkedVal : uid, // Use email or UID as default username
            providerType: currentUser.providerType,
            identities: [
              { id: currentUser.id, providerType: currentUser.providerType },
            ],
            playedQuestions: {}, // Initialize if needed
          };
        }

        // 4. Generate Display Name if missing
        if (!gameUser.displayName) {
          console.log('[GameLoginViewStore] Generating display name.');
          const genName = this.root.scoreViewStore.handleNameGenerate();
          gameUser.displayName = genName;
          // Also update score view store directly if needed
          this.root.scoreViewStore.setDisplayName(genName);
        } else {
          // Ensure score view store has the correct name
          this.root.scoreViewStore.setDisplayName(gameUser.displayName);
        }

        // 5. Update Database (Crucial Step - Moved outside conditional logic)
        await updateGameUser(this.root.db, uid, gameUser);

        // Optionally, still run checkIdentities if using email
        if (isEmail && checkedVal) {
          checkIdentities({
            db: this.root.db,
            currId: {
              id: currentUser.id,
              providerType: currentUser.providerType,
            },
            email: checkedVal,
          });
        }

        // 6. Update Store State
        this.setCurrUser(gameUser);
        // Initialize the input field with the current display name
        this.setDisplayNameInput(gameUser.displayName || '');

        // 7. Update Game Session
        this.root.gameViewStore.gameSession.uid = gameUser.uid;
        this.root.gameViewStore.gameSession.providerType =
          gameUser.providerType;

        const modProgress = await getCurrUsrModProgress({
          db: this.root.db,
          uid: gameUser.uid,
          moduleId: this.root.moduleViewStore.currentModule?.moduleId || '',
        });

        if (modProgress) {
          // this.root.gameViewStore.setQuestAttempt(
          //   modProgress.questData.questAttempt
          // );
        } else {
          await this.root.gameViewStore.updateUserModProgress(1);
        }

        await updateGameSession({
          db: this.root.db,
          sessionId: this.root.gameViewStore.gameSession.sessionId,
          keyValPair: {
            uid: gameUser.uid,
            displayName: gameUser.displayName, // Use the final displayName
            providerType: gameUser.providerType,
            gameId:
              this.root.gameViewStore.gameId ||
              this.root.moduleViewStore.currentModule?.moduleId ||
              '',
            gameEntryTime: moment().valueOf(),
          },
        });

        // 8. Handle Redirects (If applicable)
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        const tokenParam = urlParams.get('token');
        const callbackUrlParam = urlParams.get('callbackUrl');
        if (emailParam && tokenParam && callbackUrlParam) {
          // Consider if this redirect logic needs adjustment based on login type
          window.location.href = `${window.location.origin}/${callbackUrlParam}`;
        }

        this.setShowLoginModal(false);
      } catch (error) {
        console.error('[GameLoginViewStore] Error in handleAfterLogin:', error);
        // Handle errors appropriately - maybe show a message to the user
        this.handleAfterLoginFail(TokenVerifyMsg.generic); // Use generic for general errors
      }
    }
  );

  loadUser = action(async () => {
    try {
      const fetchedUser = await this.realmContext.fetchUser();
      if (fetchedUser?.profile) {
        await this.handleAfterLogin(fetchedUser);
      }
    } catch (error) {
      this.root.realmContext.signOut();
      return null;
    }

    this.setIsLoading(false);
    return null;
  });

  handleAfterLoginFail = action(
    async (msg: TokenVerifyMsg, showModal?: boolean) => {
      this.setTokenVerifyMsg(msg);
    }
  );

  // --- Display Name Actions (Moved from SettingsViewStore) ---
  @action setDisplayNameInput = (value: string) => {
    this.displayNameInput = value;
    // Clear status messages when user types
    this.displayNameUpdateError = null;
    this.displayNameUpdateSuccess = null;
  };

  @action setIsUpdatingDisplayName = (value: boolean) => {
    this.isUpdatingDisplayName = value;
  };

  @action setDisplayNameUpdateError = (message: string | null) => {
    this.displayNameUpdateError = message;
    if (message) this.displayNameUpdateSuccess = null; // Clear success if error occurs
  };

  @action setDisplayNameUpdateSuccess = (message: string | null) => {
    this.displayNameUpdateSuccess = message;
    if (message) this.displayNameUpdateError = null; // Clear error if success occurs
  };

  @action clearDisplayNameStatus = () => {
    this.isUpdatingDisplayName = false;
    this.displayNameUpdateError = null;
    this.displayNameUpdateSuccess = null;
  };

  // Updates display name in DB and then updates local state
  updateUserDisplayName = action(
    async (
      newName: string
    ): Promise<{ success: boolean; message?: string }> => {
      if (!this.currUser?.uid) {
        // Still throw for fundamental issues like user not logged in
        throw new Error('User not logged in.');
      }

      const trimmedName = newName.trim();
      if (!trimmedName) {
        // You could return failure here too, or throw as it might be considered a programmer error
        throw new Error('Display name cannot be empty.');
      }

      // --- CHANGE: Return failure instead of throwing ---
      if (this.filter.isProfane(trimmedName)) {
        return {
          success: false,
          message: 'Display name contains inappropriate language.',
        };
      }
      // --- END CHANGE ---

      try {
        const result = await updateGameUser(this.root.db, this.currUser.uid, {
          displayName: trimmedName,
        });

        // Check MongoDB update result (updateGameUser uses upsert: true by default)
        const updateResult = result as any;
        // Adjust check: updateGameUser upserts, so check modifiedCount OR upsertedId
        if (
          !updateResult ||
          (updateResult.modifiedCount === 0 && !updateResult.upsertedId)
        ) {
          // Throw specific error if update failed
          throw new Error(
            'Failed to update display name in game profile database.'
          );
        }

        // Update local MobX state
        runInAction(() => {
          if (this.currUser) {
            this.currUser.displayName = trimmedName;
          }
        });

        return { success: true }; // <<< Return success
      } catch (error) {
        // Re-throw database/unexpected errors
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(
            'An unknown error occurred during the database update.'
          );
        }
      }
    }
  );
  // --- End Display Name Actions ---
}

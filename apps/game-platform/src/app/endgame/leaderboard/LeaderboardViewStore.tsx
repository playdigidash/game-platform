import {
  action,
  makeAutoObservable,
  observable,
  computed,
  runInAction,
} from 'mobx';
import { RootStore } from '../../RootStore/RootStore';
import {
  getUserScores,
  getTop3UserScores,
  IDbQuestion,
  IGameProfile,
  ILeaderboardProfileType,
  nameGenerator,
  removeBadWords,
  updateGameSession,
  updateGameUser,
} from '@lidvizion/commonlib';
import { CurrentEndGameStep } from '../../Common';
import { reaction, autorun } from 'mobx';
import { isArray } from 'lodash';
import { ExtendedGameProfile, ExtendedPart } from './LeaderboardViewStoreProps';

interface PartData {
  part: number;
  score: number;
}

export class LeaderboardViewStore {
  root: RootStore;
  showLeaderboardModalValue = false;
  initialLoadComplete = false;
  selectedPartIndex = -1; // Local state to track selected part
  // todayProfiles: IGameProfile[] = [];
  allTimeProfiles: (IGameProfile & { parts?: PartData[] })[] = [];
  topProfiles: IGameProfile[] = [];
  isProfilesLoading = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);

    // // When currentQuestPart changes, update the local selected part
    // reaction(
    //   () => this.root.endGameViewStore.currentQuestPart,
    //   (currentQuestPart) => {
    //     if (currentQuestPart && this.showLeaderboardModalValue) {
    //       this.handlePartChange(currentQuestPart);
    //     }
    //   }
    // );
  }

  // Observable getters and setters
  get showLeaderboardModal(): boolean {
    return this.showLeaderboardModalValue;
  }

  // Computed property to get sorted profiles based on selected part
  get sortedProfiles(): (IGameProfile & { parts?: PartData[] })[] {
    if (this.selectedPartIndex > 0) {
      // Sort by the score of the specific part
      const sorted = [...this.allTimeProfiles].sort((a, b) => {
        const aPartData = a.parts?.find(
          (part) => part.part === this.selectedPartIndex
        );
        const bPartData = b.parts?.find(
          (part) => part.part === this.selectedPartIndex
        );

        // If scores are the same, fall back to total score
        const aScore = aPartData?.score || 0;
        const bScore = bPartData?.score || 0;

        if (bScore === aScore) {
          // Secondary sort by total score if part scores are equal
          return (b.score || 0) - (a.score || 0);
        }

        return bScore - aScore; // Descending order
      });

      return sorted;
    }

    // For overall leaderboard, the database query already sorts by total score
    // but we'll ensure it's sorted correctly here too just in case
    const sorted = [...this.allTimeProfiles].sort((a, b) => {
      const aScore = a.score || 0;
      const bScore = b.score || 0;
      return bScore - aScore; // Descending order
    });

    return sorted;
  }

  handleLeaderboardClick = action(async () => {
    this.setIsProfilesLoading(true);
    try {
      // Only fetch all time profiles, since we're removing today profiles
      const allTimeProfiles = await this.fetchAllTimeProfiles();

      // Handle user display names without changing the sort order
      for (const profile of allTimeProfiles) {
        if (profile.uid === this.root.gameLoginViewStore.currUser?.uid) {
          profile.displayName = await this.root.scoreViewStore.checkDisplayName(
            profile.displayName
          );
        } else if (!profile.displayName) {
          profile.displayName = nameGenerator();
        }
      }

      // Set profiles directly without additional sorting
      this.setAllTimeProfiles(allTimeProfiles);

      // Automatically set the selected part based on current game progress
      const { totalQuestPart } = this.root.endGameViewStore;

      // If the user completed all parts, show the quest tab (-1)
      // Otherwise, show the tab of the part they're currently on
      let partToSelect = -1;

      if (
        this.root.gameViewStore.gameSession.questPart < totalQuestPart.parts
      ) {
        // If not all parts completed, select the current part
        partToSelect = this.root.gameViewStore.gameSession.questPart;
      }

      // Set the selectedPartIndex directly, which will affect sortedProfiles computed property
      this.selectedPartIndex = partToSelect;

      // Also update endGameViewStore
      this.root.endGameViewStore.setSelectedLeaderboardPart(partToSelect);

      // Show the leaderboard modal
      this.showLeaderboardModalValue = true;
    } catch (error) {
      // Error handling without console.error
    } finally {
      this.setIsProfilesLoading(false);
    }
  });

  setAllTimeProfiles = action(
    (allTimeProfiles: (IGameProfile & { parts?: PartData[] })[]) => {
      // Trust the incoming sort order from the database - don't re-sort
      this.allTimeProfiles = allTimeProfiles;
    }
  );

  setTopProfiles = action((topProfiles: IGameProfile[]) => {
    // Make sure we're preserving all profile properties, especially displayName
    this.topProfiles = topProfiles.map((profile) => ({
      ...profile,
      // Ensure displayName is properly set
      displayName:
        profile.displayName || `Player ${String(profile.uid).substring(0, 6)}`,
    }));
  });

  // Computed properties
  get completedParts() {
    const { totalQuestPart } = this.root.endGameViewStore;
    return Array.from({ length: totalQuestPart.parts }, (_, idx) => {
      return idx < this.root.gameViewStore.gameSession.questPart;
    });
  }

  get allPartsCompleted() {
    return this.completedParts.every((completed) => completed);
  }

  get shouldShowTrophies() {
    // Use local selectedPartIndex instead of endGameViewStore
    return this.selectedPartIndex === -1 && this.allPartsCompleted;
  }

  // Computed getter for the currently selected part
  get selectedPart() {
    return this.selectedPartIndex;
  }

  // Instead of delegating to LEADERBOARDVIEWSTORE, let components use LEADERBOARDVIEWSTORE directly

  handlePartChange = action(async (partIndex: number) => {
    // Validate part selection
    if (partIndex === -1) {
      // For quest view, ensure all parts are completed
      if (!this.allPartsCompleted) {
        return;
      }
    } else if (partIndex > 0) {
      // For specific parts, ensure the part is completed or is the current part
      if (partIndex > this.root.gameViewStore.gameSession.questPart) {
        return;
      }
    }

    // First, make sure we have data - if not, fetch it first
    if (this.allTimeProfiles.length === 0) {
      try {
        await this.handleLeaderboardClick();
      } catch (error) {
        // Handle error silently
      }
    }

    // Update local state instead of calling LEADERBOARDVIEWSTORE method
    this.selectedPartIndex = partIndex;

    // Update endGameViewStore directly (assuming it has an action for this)
    this.root.endGameViewStore.setSelectedLeaderboardPart(partIndex);

    // Ensure the leaderboard modal is shown
    if (!this.showLeaderboardModalValue) {
      this.showLeaderboardModalValue = true;
    }
  });

  getProfileTooltip = (idx: number) => {
    if (!this.completedParts[idx]) {
      return 'Complete this part to view its leaderboard';
    }
    return '';
  };

  getQuestTooltip = () => {
    if (!this.allPartsCompleted) {
      return 'Complete all parts to unlock the quest leaderboard';
    }
    return '';
  };

  setIsProfilesLoading = action((bool: boolean) => {
    this.isProfilesLoading = bool;
  });

  fetchLeaderboard = action(async (gameId: string) => {
    this.isProfilesLoading = true;
    try {
      const scores = await getUserScores(this.root.db, gameId);
      runInAction(() => {
        this.allTimeProfiles = scores;
      });
    } catch (err) {
      // Handle error silently
    } finally {
      this.isProfilesLoading = false;
    }
  });

  // Add this new method to fetch top 3 profiles directly
  fetchTop3Profiles = action(async () => {
    if (!this.root.moduleViewStore.currentModule?.moduleId) {
      return [];
    }

    try {
      // Mark loading state
      this.setIsProfilesLoading(true);

      // Get top 3 profiles directly from the database
      const result = await getTop3UserScores(
        this.root.db,
        this.root.moduleViewStore.currentModule.moduleId
      );

      if (isArray(result)) {
        // Set the type to allTime
        result.forEach((r) => {
          r.type = ILeaderboardProfileType.allTime;
        });

        // Update topProfiles directly
        this.setTopProfiles(result);
        return result;
      } else {
        this.setTopProfiles([]);
        return [];
      }
    } catch (error) {
      // Set empty topProfiles on error to prevent UI errors
      this.setTopProfiles([]);
      return [];
    } finally {
      // Always mark loading as complete
      this.setIsProfilesLoading(false);
    }
  });

  fetchAllTimeProfiles = action(async () => {
    if (this.root.moduleViewStore.currentModule?.moduleId) {
      try {
        // Get profiles already sorted by the MongoDB aggregation pipeline
        const result = await getUserScores(
          this.root.db,
          this.root.moduleViewStore.currentModule?.moduleId
        );

        if (isArray(result)) {
          // Only set the type, preserve the sort order from the database
          result.forEach((r) => {
            r.type = ILeaderboardProfileType.allTime;

            // Ensure the parts array is properly structured
            if (r.parts) {
              // Sort parts by part number for consistency
              r.parts.sort((a, b) => (a.part || 0) - (b.part || 0));
            }
          });

          // Custom sorting for specific parts
          // First check if there's already a selected part in the UI
          const partToSortBy =
            this.selectedPartIndex > 0
              ? this.selectedPartIndex
              : this.root.gameViewStore.gameSession.questPart > 0
              ? this.root.gameViewStore.gameSession.questPart
              : null;

          if (partToSortBy) {
            // Sort by the specific part score in descending order
            result.sort((a, b) => {
              const aPartData = a.parts?.find(
                (part) => part.part === partToSortBy
              );
              const bPartData = b.parts?.find(
                (part) => part.part === partToSortBy
              );

              const aScore = aPartData?.score || 0;
              const bScore = bPartData?.score || 0;

              // If scores are equal, use total score as tiebreaker
              if (bScore === aScore) {
                return (b.score || 0) - (a.score || 0);
              }

              return bScore - aScore; // Descending order
            });
          }
        }

        return isArray(result) ? result : [];
      } catch (error) {
        // Error handling without console.error
        return [];
      }
    }

    return [];
  });

  // Add a public method to show leaderboard that can be directly called from other components
  showLeaderboard = action(() => {
    this.handleLeaderboardClick();
  });
}

import {
  action,
  makeAutoObservable,
  reaction,
  observable,
  makeObservable,
} from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import gsap from 'gsap';
import { defaultThemeData } from '../Constants';
import React from 'react';
import {
  getCurrUsrModProgress,
  getCustomAvs,
  getGameSessionByQs,
  getImgbyId,
  getModItms,
  getModuleById,
  getThemeData,
  IGlb,
  IDBPlayedQuestion,
  IDbQuestion,
  IGameSession,
  IGameSessionQuestions,
  IPlayedQuestionMap,
  IQuestData,
  LoginLvl,
  splitIndexes,
  updateGameSession,
  updateUserModuleProgress,
  ICustomModule,
  ICurrentUserModel,
  IGameUserModel,
  fetchLibraryGames,
  fetchFilteredLibraryGames,
  getChildCategories,
  searchLibraryGames,
  // IOrganizationModel,
  GLBType,
  DefaultOrCustom,
} from '@lidvizion/commonlib';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons';
import { CurrentEndGameStep } from '../Common';
import { isArray, filter } from 'lodash';
import { SUBCATEGORY_TO_CATEGORY, SAMPLE_TAGS } from './GameLibraryProps';

export interface IRecentGameSession extends IGameSession {
  imageUrl?: string;
  gameTitle?: string;
}

interface BSONNumberLong {
  $numberLong: string;
}

function isBSONNumberLong(value: unknown): value is BSONNumberLong {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$numberLong' in value &&
    typeof (value as { $numberLong: unknown }).$numberLong === 'string'
  );
}

interface IGameCat {
  CategoryID?: string;
  Category?: string;
  SubcategoryID?: string;
  Subcategory?: string;
  TopicId?: string;
  Topic?: string;
  SubtopicId?: string;
  Subtopic?: string;
}

interface IGameMetadata {
  moduleId: string;
  settings?: {
    gTitle?: string;
    url?: string;
  };
  imgId?: string;
}

interface MongoAggregationStage {
  [key: string]: unknown;
  $match?: {
    uid: string;
    $or: Array<{
      endTime?: { $exists: boolean; $ne: null };
      gameEntryTime?: { $exists: boolean };
    }>;
  };
  $addFields?: {
    sortDate: { $ifNull: [string, string] };
  };
  $sort?: {
    [key: string]: 1 | -1;
  };
  $limit?: number;
}

interface ICategoryRelationship {
  CategoryID: string;
  SubcategoryID: string;
  Category: string;
  Subcategory: string;
}

// Add new interface for processed items
export interface IProcessedFeatureItem extends IGlb {
  loading?: boolean;
  processed?: boolean;
}

export class GameLibraryViewStore {
  root: RootStore;
  games: ICustomModule[] = [];
  filteredGames: ICustomModule[] = [];
  loading = true;
  error: string | null = null;
  pageSize = 25;
  currentPage = 0;
  hasMoreGames = true;
  hasMoreFilteredGames = true;
  gameImages: { [key: string]: string } = {};
  selectedCategory: string | null = null;
  showFilterDropdown = false;
  searchQuery = '';
  categoryMappings: Record<string, string> = {};
  categoryRelationships: ICategoryRelationship[] = [];

  activePreviewGame: ICustomModule | null = null;
  showPreviewPanel = false;
  previewPanelExpanded = false;

  // Preview panel UI state
  showActionMenu = false;
  // isFavorite = false; // Commented out as requested
  showReportDialog = false;
  reportReason = '';
  showSnackbar = false;
  snackbarMessage = '';
  orgName = '';
  currUser: ICurrentUserModel | IGameUserModel | null = null;
  recentGames: IRecentGameSession[] = [];
  loadingRecentGames = false;

  categories: IGameCat[] = [];
  loadingCategories = false;

  // Add properties for feature items
  featureItemsMap: Record<string, IProcessedFeatureItem[]> = {};
  processingFeatures = false;

  // Add tag cache
  gameTags: { [key: string]: string } = {};
  loadingTags = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      root: false,
    });
  }

  // Filter methods
  setGames = (games: ICustomModule[]) => {
    action(() => {
      this.games = games;
    })();
  };

  setGameTags = (tags: { [key: string]: string }) => {
    action(() => {
      this.gameTags = tags;
    })();
  };

  setFilteredGames = (games: ICustomModule[]) => {
    action(() => {
      this.filteredGames = games;
    })();
  };

  toggleFilterDropdown = () => {
    action(() => {
      this.showFilterDropdown = !this.showFilterDropdown;
    })();
  };

  closeFilterDropdown = () => {
    action(() => {
      this.showFilterDropdown = false;
    })();
  };

  openFilterDropdown = () => {
    action(() => {
      this.showFilterDropdown = true;
    })();
  };

  setSelectedCategory = (categoryId: string | null) => {
    action(() => {
      if (this.selectedCategory === categoryId) {
        this.selectedCategory = null;
        this.currentPage = 0;
        this.hasMoreGames = true;
        this.fetchGames(0); // Reset and reload default games
      } else {
        this.selectedCategory = categoryId;
        this.currentPage = 0;
        this.hasMoreFilteredGames = true;
        if (categoryId) {
          this.fetchFilteredGames(categoryId, 0); // Fetch filtered games from DB
        }
      }
    })();
  };

  setSearchQuery = (query: string) => {
    action(() => {
      this.searchQuery = query;
      this.fetchSearchResults(query);
    })();
  };

  // New method to fetch search results
  fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      this.setSelectedCategory(null); // Reset to default games view
      return;
    }

    try {
      if (!this.root.db) {
        return;
      }

      this.setLoading(true);

      // Use searchLibraryGames from commonlib
      const games = (await searchLibraryGames(
        this.root.db,
        query,
        this.pageSize
      )) as ICustomModule[];

      // Fetch images for search results
      await Promise.all(
        games.map(async (game: ICustomModule) => {
          if (game.imgId) {
            await this.fetchGameImage(game.moduleId, game.imgId);
          }
        })
      );

      // Fetch tags for search results
      await this.fetchTagsForGames(games);

      this.setFilteredGames(games);
      this.setLoading(false);
    } catch (error) {
      this.setError('Error searching games');
      this.setLoading(false);
    }
  };

  // Fetch unfiltered games with pagination
  fetchGames = async (page = 0) => {
    try {
      if (!this.root.db) {
        action(() => {
          this.error = 'Database not available';
          this.loading = false;
        })();
        return;
      }

      action(() => {
        this.loading = true;
      })();

      // Use fetchLibraryGames from commonlib
      const games = (await fetchLibraryGames(
        this.root.db,
        page,
        this.pageSize
      )) as ICustomModule[];

      // We're moving filtering to server-side, but keeping this as a secondary check
      const validGames = games.filter(
        (game) =>
          game.settings?.gTitle && game.moduleId && game.isDeleted !== true
      );

      // Only set hasMoreGames to false if we received fewer games than the page size
      // This should be based on raw DB results, not filtered results
      action(() => {
        if (games.length < this.pageSize) {
          this.hasMoreGames = false;
        } else {
          this.hasMoreGames = true;
        }
      })();

      // Fetch images for new games
      const imagePromises = validGames.map(async (game: ICustomModule) => {
        if (game.imgId) {
          try {
            return await this.fetchGameImage(game.moduleId, game.imgId);
          } catch (error) {
            return null;
          }
        }
        return null;
      });

      // Wait for all image fetches to complete
      await Promise.all(imagePromises);

      // Fetch tags for all games
      await this.fetchTagsForGames(validGames);

      action(() => {
        this.games = page === 0 ? validGames : [...this.games, ...validGames];
        this.loading = false;
      })();
    } catch (error) {
      action(() => {
        this.error = 'Error fetching games';
        this.loading = false;
      })();
    }
  };

  // Helper method to get all game categories
  private getAllGameCategories = async (): Promise<IGameCat[]> => {
    if (!this.root.db) {
      return [];
    }

    try {
      // This would ideally be a function in MongoQueries, but we'll implement it here
      // In a real implementation, you would create a proper query function in MongoQueries

      // For now, we'll use a simple approach that works with the existing code
      const catCollection = this.root.db.collection('game_cats');

      // MongoDB in this environment returns the results directly, not a cursor with toArray()
      return (await catCollection.find({})) as unknown as IGameCat[];
    } catch (error) {
      return [];
    }
  };

  // Use updated fetchFilteredGames method from commonlib
  fetchFilteredGames = async (categoryId: string, page = 0) => {
    if (!this.root.db) {
      action(() => {
        this.error = 'Database not available';
        this.loading = false;
      })();
      return;
    }

    if (!categoryId) {
      this.fetchGames(page);
      return;
    }

    this.setLoading(true);

    try {
      // Verify category exists in our categories array
      const categoryExists = this.categories.some(
        (cat) => cat.CategoryID === categoryId
      );

      if (categoryExists) {
        const matchingCategory = this.categories.find(
          (cat) => cat.CategoryID === categoryId
        );
      }

      // Use fetchFilteredLibraryGames from commonlib
      const games = (await fetchFilteredLibraryGames(
        this.root.db,
        categoryId,
        page,
        this.pageSize
      )) as ICustomModule[];

      // Filter out any games without a title or with isDeleted=true
      // This is a secondary check as we're moving filters to server side
      const validGames = games.filter(
        (game) =>
          game.settings?.gTitle && game.moduleId && game.isDeleted !== true
      );

      // Handle hasMoreFilteredGames inside action
      // Only set to false if we received fewer games than the page size from DB
      action(() => {
        if (games.length < this.pageSize) {
          this.hasMoreFilteredGames = false;
        } else {
          this.hasMoreFilteredGames = true;
        }
      })();

      // Fetch images for filtered games
      const imagePromises = validGames.map(async (game: ICustomModule) => {
        if (game.imgId) {
          try {
            return await this.fetchGameImage(game.moduleId, game.imgId);
          } catch (error) {
            return null;
          }
        }
        return null;
      });

      // Wait for all image fetches to complete
      await Promise.all(imagePromises);

      // Fetch tags for filtered games
      await this.fetchTagsForGames(validGames);

      action(() => {
        this.filteredGames =
          page === 0 ? validGames : [...this.filteredGames, ...validGames];
        this.loading = false;
      })();
    } catch (error) {
      action(() => {
        this.error = 'Error fetching filtered games';
        this.loading = false;
      })();
    }
  };

  // Image methods
  setGameImage = (moduleId: string, imageUrl: string) => {
    action(() => {
      this.gameImages[moduleId] = imageUrl;
    })();
  };

  getGameImage = (moduleId: string) => {
    return this.gameImages[moduleId];
  };

  fetchGameImage = async (
    moduleId: string,
    imgId: string
  ): Promise<string | null> => {
    if (!this.root.db || !imgId) return null;

    try {
      const imgData = await getImgbyId(this.root.db, imgId);
      if (imgData?.s3Url) {
        this.setGameImage(moduleId, imgData.s3Url);
        return imgData.s3Url;
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  };

  // State management methods
  setLoading = (loading: boolean) => {
    action(() => {
      this.loading = loading;
    })();
  };

  setError = (error: string | null) => {
    action(() => {
      this.error = error;
    })();
  };

  resetPagination = () => {
    action(() => {
      this.currentPage = 0;
      this.hasMoreGames = true;
      this.hasMoreFilteredGames = true;
    })();
  };

  // Updated to use the new fetch method
  fetchAllGames = async (): Promise<ICustomModule[]> => {
    this.resetPagination();
    await this.fetchGames(0);
    return this.games;
  };

  handleGameSelect = (game: ICustomModule): void => {
    action(() => {
      this.setActivePreviewGame(game);
      this.setShowPreviewPanel(true);
      this.setPreviewPanelExpanded(false);
    })();
  };

  setActivePreviewGame = (game: ICustomModule | null) => {
    action(() => {
      this.activePreviewGame = game;
    })();
  };

  setShowPreviewPanel = (show: boolean) => {
    action(() => {
      this.showPreviewPanel = show;
    })();
  };

  setPreviewPanelExpanded = (expanded: boolean) => {
    action(() => {
      this.previewPanelExpanded = expanded;
    })();
  };

  togglePreviewPanelExpanded = () => {
    action(() => {
      this.previewPanelExpanded = !this.previewPanelExpanded;
    })();
  };

  closePreviewPanel = () => {
    action(() => {
      this.showPreviewPanel = false;
      this.previewPanelExpanded = false;
    })();
  };

  playSelectedGame = (): void => {
    action(() => {
      if (!this.activePreviewGame) return;

      const gameUrl = `/${
        this.activePreviewGame.settings?.url || this.activePreviewGame.moduleId
      }`;
      window.open(gameUrl, '_blank', 'noopener,noreferrer');
    })();
  };

  toggleFavoriteGame = (gameId: string): void => {
    action(() => {
      // Commented out as requested
    })();
  };

  shareGame = (gameId: string): void => {
    action(() => {
      if (!this.activePreviewGame) return;

      const gameTitle = this.activePreviewGame.settings?.gTitle || 'Cool Game';
      const gameUrl = `${window.location.origin}/${
        this.activePreviewGame.settings?.url || this.activePreviewGame.moduleId
      }`;

      try {
        if (navigator.share) {
          navigator
            .share({
              title: gameTitle,
              text: `Check out this awesome game: ${gameTitle}! Play it now and let me know your score!`,
              url: gameUrl,
            })
            .then(() => {
              // Success - show notification
              this.setSnackbarMessage('Game shared successfully!');
              this.setShowSnackbar(true);
            })
            .catch((error) => {
              // Fallback for when share is rejected
              this.fallbackShare(gameTitle, gameUrl);
            });
        } else {
          // Fallback for browsers that don't support the Web Share API
          this.fallbackShare(gameTitle, gameUrl);
        }
      } catch (error) {
        this.fallbackShare(gameTitle, gameUrl);
      }
    })();
  };

  // Helper method for sharing when Web Share API is not available
  private fallbackShare = (gameTitle: string, gameUrl: string): void => {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);

    // Set its value to the URL
    tempInput.value = gameUrl;

    // Select the text
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy to clipboard
    document.execCommand('copy');

    // Remove the temporary element
    document.body.removeChild(tempInput);

    // Notify user
    this.setSnackbarMessage(
      'Game URL copied to clipboard! Share it with your friends.'
    );
    this.setShowSnackbar(true);
  };

  reportGame = (gameId: string, reportReason: string): void => {
    action(() => {
      // No logging needed here
    })();
  };

  fetchOrganizationName = async (orgId: string): Promise<void> => {
    if (!orgId || !this.root.db) {
      action(() => {
        this.orgName = 'Unknown Organization';
      })();
      return;
    }

    try {
      const organizationCollection = this.root.db.collection('organization');
      const organization = await organizationCollection.findOne({ id: orgId });

      if (
        organization?.Organization &&
        typeof organization.Organization === 'string'
      ) {
        action(() => {
          this.orgName = organization.Organization;
        })();
      } else {
        action(() => {
          this.orgName = 'Unknown Organization';
        })();
      }
    } catch (error) {
      action(() => {
        this.orgName = 'Unknown Organization';
      })();
    }
  };

  setCurrUser = (user: ICurrentUserModel | IGameUserModel | null) => {
    action(() => {
      this.currUser = user;
    })();
  };

  private async getUserGameSessions(limit?: number): Promise<IGameSession[]> {
    if (!this.root.db || !this.currUser?.uid) {
      return [];
    }

    try {
      // This would ideally be a function in MongoQueries
      // For now, we'll implement a safer version of the existing code
      const sessionCollection = this.root.db.collection('game_session');
      const query = {
        uid: this.currUser.uid,
        $or: [
          { endTime: { $exists: true, $ne: null } },
          { gameEntryTime: { $exists: true } },
        ],
      };

      // MongoDB in this environment returns the results directly, not a cursor with toArray()
      const sessions = (await sessionCollection.find(
        query
      )) as unknown as IGameSession[];

      // Sort them by endTime or gameEntryTime
      const sortedSessions = sessions.sort((a, b) => {
        const aTime = a.endTime || a.gameEntryTime || 0;
        const bTime = b.endTime || b.gameEntryTime || 0;
        return bTime - aTime; // Sort in descending order (newest first)
      });

      // Apply limit if provided
      return limit ? sortedSessions.slice(0, limit) : sortedSessions;
    } catch (error) {
      return [];
    }
  }

  private async getGameMetadata(gameIds: string[]): Promise<IGameMetadata[]> {
    if (!this.root.db || gameIds.length === 0) {
      return [];
    }

    try {
      // This would ideally be a function in MongoQueries
      // For now, we'll implement a safer version of the existing code
      const moduleCollection = this.root.db.collection('default_modules');
      const query = { moduleId: { $in: gameIds } };

      // MongoDB in this environment returns the results directly, not a cursor with toArray()
      return (await moduleCollection.find(query)) as unknown as IGameMetadata[];
    } catch (error) {
      return [];
    }
  }

  private async convertToRecentGame(
    session: IGameSession,
    metadata: IGameMetadata | undefined
  ): Promise<IRecentGameSession> {
    const endTime = this.extractTimestamp(session.endTime);
    const gameEntryTime = this.extractTimestamp(session.gameEntryTime);

    const recentGame: IRecentGameSession = {
      ...session,
      endTime: endTime ?? null,
      gameEntryTime: gameEntryTime,
      isCompleted: !!endTime,
      gameTitle:
        metadata?.settings?.gTitle ||
        this.formatGameUrlToTitle(session.gameUrl || ''),
      score: session.score || 0,
      gameUrl: metadata?.settings?.url || session.gameUrl || 'unknown-game',
    };

    if (metadata?.imgId) {
      const imageUrl = await this.fetchGameImage(
        metadata.moduleId,
        metadata.imgId
      );
      if (imageUrl) {
        recentGame.imageUrl = imageUrl;
      }
    }

    return recentGame;
  }

  fetchRecentGames = async (limit?: number) => {
    if (!this.currUser || !this.root.db) {
      action(() => {
        this.recentGames = [];
      })();
      return;
    }

    action(() => {
      this.loadingRecentGames = true;
    })();

    try {
      const userGames = await this.getUserGameSessions(limit);

      if (!userGames || userGames.length === 0) {
        action(() => {
          this.recentGames = [];
        })();
        return;
      }

      const uniqueGameIds = Array.from(
        new Set(
          userGames
            .filter((session: IGameSession) => session.gameId)
            .map((session: IGameSession) => session.gameId)
        )
      );

      if (uniqueGameIds.length === 0) {
        action(() => {
          this.recentGames = [];
        })();
        return;
      }

      const gameMetadata = await this.getGameMetadata(uniqueGameIds);
      const metadataMap = new Map(
        gameMetadata.map((game: IGameMetadata) => [game.moduleId, game])
      );

      const recentGames = await Promise.all(
        userGames.map((session: IGameSession) =>
          this.convertToRecentGame(session, metadataMap.get(session.gameId))
        )
      );

      action(() => {
        this.recentGames = recentGames;
      })();
    } catch (error) {
      action(() => {
        this.recentGames = [];
      })();
    } finally {
      action(() => {
        this.loadingRecentGames = false;
      })();
    }
  };

  private formatGameUrlToTitle = (gameUrl: string): string => {
    if (!gameUrl) return 'Unknown Game';

    const gameName = gameUrl.split('/').pop() || gameUrl;

    return gameName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  private extractTimestamp = (timestamp: unknown): number | undefined => {
    if (typeof timestamp === 'number') {
      return timestamp;
    } else if (isBSONNumberLong(timestamp)) {
      return Number(timestamp.$numberLong);
    }
    return undefined;
  };

  get uniqueGamesWithHighestScores(): IRecentGameSession[] {
    const gameMap = new Map<string, IRecentGameSession>();

    this.recentGames.forEach((game) => {
      if (!game.gameId) return;

      const existingGame = gameMap.get(game.gameId);
      const currentScore = game.score || 0;

      if (!existingGame || (existingGame.score || 0) < currentScore) {
        gameMap.set(game.gameId, game);
      }
    });

    return Array.from(gameMap.values()).sort(
      (a, b) => (b.score || 0) - (a.score || 0)
    );
  }

  // Game Feature Section methods
  getFeatureThumbnailUrl = async (
    item: IGlb,
    defaultImage: string
  ): Promise<{
    thumbnailUrl: string;
    title?: string;
    description?: string;
  }> => {
    try {
      // First try to get the thumbnail from MongoDB
      if (item.type === DefaultOrCustom.custom) {
        // For custom items, use the database query which returns thumbnailUrl
        const customThumbnail = await this.getGamePreviewCustom(item.objId);

        if (customThumbnail) {
          // TypeScript safe version
          return {
            title: customThumbnail.title,
            description: customThumbnail.description,
            thumbnailUrl: customThumbnail.thumbnailUrl || defaultImage,
          };
        }
      } else {
        // For default items, get the proper asset path from thumbnail ID
        const defaultThumbnail = await this.getGamePreviewDefault(item.objId);

        if (defaultThumbnail) {
          // TypeScript safe version
          return {
            title: defaultThumbnail.title,
            description: defaultThumbnail.description,
            thumbnailUrl: defaultThumbnail.thumbnailUrl || defaultImage,
          };
        }
      }

      // Fallbacks if MongoDB lookup fails
      if (item.type === DefaultOrCustom.custom && item.thumbnailUrl) {
        return {
          thumbnailUrl: item.thumbnailUrl,
          title: item.title,
          description: item.description,
        };
      } else if (item.type === DefaultOrCustom.default && item.thumbnail) {
        // For default items, construct the URL from thumbnail
        const url = `/assets/thumbnails/${item.thumbnail}.png`;
        return {
          thumbnailUrl: url,
          title: item.title,
          description: item.description,
        };
      }
    } catch (error) {
      // Silent fail
    }

    return {
      thumbnailUrl: defaultImage,
      title: item.title,
      description: item.description,
    };
  };

  // New function to fetch default item thumbnail from MongoDB
  getGamePreviewDefault = async (
    itemId: string
  ): Promise<{
    thumbnailUrl: string | null;
    title?: string;
    description?: string;
  }> => {
    if (!this.root.db || !itemId) {
      return { thumbnailUrl: null };
    }

    try {
      const library = this.root.db.collection('3d_library');
      const item = await library.findOne({ objId: itemId, type: 'default' });

      if (item) {
        // Extract metadata
        const metadata = {
          title: item.title,
          description: item.description,
        };

        // For default items, always use the thumbnail ID to construct the path to the asset
        if (item.thumbnail) {
          const url = `/assets/thumbnails/${item.thumbnail}.png`;
          return {
            thumbnailUrl: url,
            ...metadata,
          };
        } else if (item.thumbnailUrl) {
          // Fallback to thumbnailUrl if somehow thumbnail is missing
          return {
            thumbnailUrl: item.thumbnailUrl,
            ...metadata,
          };
        }
      }

      return { thumbnailUrl: null };
    } catch (error) {
      return { thumbnailUrl: null };
    }
  };

  // New function to fetch custom item thumbnail from MongoDB
  getGamePreviewCustom = async (
    itemId: string
  ): Promise<{
    thumbnailUrl: string | null;
    title?: string;
    description?: string;
  }> => {
    if (!this.root.db || !itemId) {
      return { thumbnailUrl: null };
    }

    try {
      const library = this.root.db.collection('3d_library');
      const item = await library.findOne({ objId: itemId, type: 'custom' });

      if (item && item.thumbnailUrl) {
        return {
          thumbnailUrl: item.thumbnailUrl,
          title: item.title,
          description: item.description,
        };
      }

      return { thumbnailUrl: null };
    } catch (error) {
      return { thumbnailUrl: null };
    }
  };

  getFeatureItemName = (
    item: IGlb | IProcessedFeatureItem,
    index: number,
    prefix: string
  ): string => {
    const displayName =
      (item as IProcessedFeatureItem).title ||
      item.title ||
      `${prefix} ${index + 1}`;
    return displayName;
  };

  logFeatureItems = (items: IGlb[], sectionTitle: string) => {
    // This method was just for logging, we can leave it empty or remove entire method
    // Keeping it empty for now in case it's referenced elsewhere
  };

  // Add this method after the other UI-related methods
  navigateBack = (): void => {
    action(() => {
      window.history.back();
    })();
  };

  setCategories = (categories: IGameCat[]) => {
    action(() => {
      // Filter out categories with missing required fields
      this.categories = categories.filter(
        (cat) => cat.CategoryID && cat.Category
      );
    })();
  };

  fetchCategoryMappings = async () => {
    if (!this.root.db) {
      return;
    }

    try {
      // Get all game categories
      const allCategories = await this.getAllGameCategories();

      const mappings: Record<string, string> = {};
      const relationships: ICategoryRelationship[] = [];

      allCategories.forEach((cat: IGameCat) => {
        if (cat.SubcategoryID && cat.CategoryID) {
          mappings[cat.SubcategoryID] = cat.CategoryID;
          relationships.push({
            CategoryID: cat.CategoryID,
            SubcategoryID: cat.SubcategoryID,
            Category: cat.Category || '',
            Subcategory: cat.Subcategory || '',
          });
        }
      });

      action(() => {
        this.categoryMappings = mappings;
        this.categoryRelationships = relationships;
      })();
    } catch (error) {
      // Silent fail
    }
  };

  // Additional helper function for backward compatibility
  private getParentCategorySync = (categoryId: string): string | null => {
    // If it's a subcategory, return its parent
    if (categoryId.startsWith('SC')) {
      return this.categoryMappings[categoryId] || null;
    }
    // If it's a main category, return null as it has no parent
    return null;
  };

  private async getAllRelatedCategories(categoryId: string): Promise<string[]> {
    const related: string[] = [categoryId];

    // Add parent if exists
    const parent = this.getParentCategorySync(categoryId);
    if (parent) {
      related.push(parent);
    }

    // Add children if exist - need to await the Promise
    const children = await getChildCategories(this.root.db, categoryId);
    related.push(...children);

    return related;
  }

  fetchCategories = async () => {
    if (!this.root.db) {
      return;
    }

    action(() => {
      this.loadingCategories = true;
    })();

    try {
      await this.fetchCategoryMappings();

      // Get all game categories directly from the database
      const categoryCollection = this.root.db.collection('game_cats');

      // Use aggregation to get unique categories
      const pipeline = [
        {
          $group: {
            _id: '$CategoryID',
            Category: { $first: '$Category' },
          },
        },
        {
          $project: {
            _id: 0,
            CategoryID: '$_id',
            Category: 1,
          },
        },
      ];

      // MongoDB in this environment returns the results directly
      const categories = (await categoryCollection.aggregate(
        pipeline
      )) as unknown as IGameCat[];

      // If no categories are found or there's an error, use fallback categories
      if (!categories || categories.length === 0) {
        const fallbackCategories = [
          { CategoryID: 'C001', Category: 'Arts & Entertainment' },
          { CategoryID: 'C002', Category: 'Science & Technology' },
          { CategoryID: 'C003', Category: 'Humanities & Social Sciences' },
          { CategoryID: 'C004', Category: 'Health & Wellness' },
          { CategoryID: 'C005', Category: 'Business & Economics' },
        ];

        action(() => {
          this.setCategories(fallbackCategories);
          this.loadingCategories = false;
        })();
        return;
      }

      action(() => {
        this.setCategories(categories);
        this.loadingCategories = false;
      })();
    } catch (error) {
      // Use fallback categories in case of error
      const fallbackCategories = [
        { CategoryID: 'C001', Category: 'Arts & Entertainment' },
        { CategoryID: 'C002', Category: 'Science & Technology' },
        { CategoryID: 'C003', Category: 'Humanities & Social Sciences' },
        { CategoryID: 'C004', Category: 'Health & Wellness' },
        { CategoryID: 'C005', Category: 'Business & Economics' },
      ];

      action(() => {
        this.setCategories(fallbackCategories);
        this.loadingCategories = false;
      })();
    }
  };

  // Action methods for preview panel UI state
  setShowActionMenu = (show: boolean) => {
    action(() => {
      this.showActionMenu = show;
    })();
  };

  toggleActionMenu = () => {
    action(() => {
      this.showActionMenu = !this.showActionMenu;
    })();
  };

  /* Commented out as requested
  setIsFavorite = (isFavorite: boolean) => {
    action(() => {
      this.isFavorite = isFavorite;
    })();
  };
  */

  setShowReportDialog = (show: boolean) => {
    action(() => {
      this.showReportDialog = show;
    })();
  };

  setReportReason = (reason: string) => {
    action(() => {
      this.reportReason = reason;
    })();
  };

  setShowSnackbar = (show: boolean) => {
    action(() => {
      this.showSnackbar = show;
    })();
  };

  setSnackbarMessage = (message: string) => {
    action(() => {
      this.snackbarMessage = message;
    })();
  };

  setOrgName = (name: string) => {
    action(() => {
      this.orgName = name;
    })();
  };

  // Process feature items and fetch their thumbnails
  processFeatureItems = async (
    items: IGlb[],
    featureType: 'avatar' | 'jump' | 'duck' | 'dodge',
    defaultImage: string
  ): Promise<IProcessedFeatureItem[]> => {
    if (!items || items.length === 0) return [];

    const cacheKey = `${featureType}-${items.map((i) => i.objId).join('-')}`;

    // Check if we already have processed these items
    if (this.featureItemsMap[cacheKey]?.length > 0) {
      const cachedItems = this.featureItemsMap[cacheKey];
      if (cachedItems.every((item) => item.processed)) {
        return cachedItems;
      }
    }

    action(() => {
      this.processingFeatures = true;
    })();

    try {
      // Initialize items with type and glbType
      const glbTypeMap = {
        avatar: GLBType.avatar,
        jump: GLBType.jump,
        duck: GLBType.duck,
        dodge: GLBType.dodge,
      };

      const initialProcessed = items.map((item) => {
        return {
          ...item,
          type: item.type || DefaultOrCustom.default,
          glbType: item.glbType || glbTypeMap[featureType],
          loading: true,
          processed: false,
        };
      });

      // Store the initial items in the cache
      action(() => {
        this.featureItemsMap[cacheKey] = initialProcessed;
      })();

      // Process each item to get its thumbnail
      const processedItems = await Promise.all(
        initialProcessed.map(async (item, index) => {
          try {
            const thumbnailData = await this.getFeatureThumbnailUrl(
              item,
              defaultImage
            );

            return {
              ...item,
              thumbnailUrl: thumbnailData.thumbnailUrl,
              title:
                thumbnailData.title ||
                item.title ||
                `${
                  featureType.charAt(0).toUpperCase() + featureType.slice(1)
                } ${index + 1}`,
              description: thumbnailData.description || item.description || '',
              loading: false,
              processed: true,
            };
          } catch (error) {
            return {
              ...item,
              thumbnailUrl: defaultImage,
              title:
                item.title ||
                `${
                  featureType.charAt(0).toUpperCase() + featureType.slice(1)
                } ${index + 1}`,
              description: item.description || '',
              loading: false,
              processed: true,
            };
          }
        })
      );

      // Store the processed items in the cache
      action(() => {
        this.featureItemsMap[cacheKey] = processedItems;
        this.processingFeatures = false;
      })();

      return processedItems;
    } catch (error) {
      action(() => {
        this.processingFeatures = false;
      })();
      return [];
    }
  };

  getFeatureItems = (
    featureType: 'avatar' | 'jump' | 'duck' | 'dodge',
    items: IGlb[]
  ): IProcessedFeatureItem[] => {
    if (!items || items.length === 0) return [];

    const cacheKey = `${featureType}-${items.map((i) => i.objId).join('-')}`;
    return this.featureItemsMap[cacheKey] || [];
  };

  // Tag methods
  getTag = (tagId: string): string => {
    const tagName = this.gameTags[tagId] || 'tag';
    return tagName;
  };

  fetchTagById = async (tagId: string): Promise<string> => {
    if (!this.root.db || !tagId) return 'tag';

    try {
      // Check if we already have this tag cached
      if (this.gameTags[tagId]) {
        return this.gameTags[tagId];
      }

      const tagsCollection = this.root.db.collection('tags');
      const tagDoc = await tagsCollection.findOne({ tagId });

      if (tagDoc && tagDoc.tag) {
        // Cache the tag name
        action(() => {
          this.gameTags[tagId] = tagDoc.tag;
        })();
        return tagDoc.tag;
      } else {
        return 'tag';
      }
    } catch (error) {
      return 'tag';
    }
  };

  fetchTagsForGame = async (game: ICustomModule): Promise<void> => {
    if (!game.tags || game.tags.length === 0) return;

    try {
      // Process all tags for this game
      await Promise.all(game.tags.map((tagId) => this.fetchTagById(tagId)));
    } catch (error) {
      // Silent fail
    }
  };

  // Fetch tags for multiple games
  fetchTagsForGames = async (games: ICustomModule[]): Promise<void> => {
    if (!games || games.length === 0) return;

    // Extract all unique tag IDs from the games
    const allTagIds = Array.from(
      new Set(games.flatMap((game) => game.tags || []))
    );

    if (allTagIds.length === 0) return;

    try {
      action(() => {
        this.loadingTags = true;
      })();

      await Promise.all(allTagIds.map((tagId) => this.fetchTagById(tagId)));
    } catch (error) {
      // Silent fail
    } finally {
      action(() => {
        this.loadingTags = false;
      })();
    }
  };

  // After fetchTagsForGames method

  // Debug method to log tag cache contents
  logTagCache = () => {
    // This method was just for logging, we can leave it empty or remove
    // Keeping it empty for now in case it's referenced elsewhere
  };

  // Process feature items from objId strings (new schema)
  processFeatureItemsFromIds = async (
    objIds: string[],
    featureType: 'avatar' | 'jump' | 'duck' | 'dodge',
    defaultImage: string
  ): Promise<IProcessedFeatureItem[]> => {
    if (!objIds || objIds.length === 0) return [];

    const cacheKey = `${featureType}-${objIds.join('-')}`;

    // Check if we already have processed these items
    if (this.featureItemsMap[cacheKey]?.length > 0) {
      const cachedItems = this.featureItemsMap[cacheKey];
      if (cachedItems.every((item) => item.processed)) {
        return cachedItems;
      }
    }

    action(() => {
      this.processingFeatures = true;
    })();

    try {
      // Query the database to get object metadata for each objId
      const library = this.root.db.collection('3d_library');
      const objectPromises = objIds.map(async (objId, index) => {
        try {
          const objData = await library.findOne({ objId: objId });
          if (!objData) {
            console.warn(`Object not found for objId: ${objId}`);
            return null;
          }

          // Create IGlb-like object from database data
          const glbTypeMap = {
            avatar: GLBType.avatar,
            jump: GLBType.jump,
            duck: GLBType.duck,
            dodge: GLBType.dodge,
          };

          return {
            objId: objId,
            type: objData.type || DefaultOrCustom.default,
            glbType: objData.glbType || glbTypeMap[featureType],
            title: objData.title || `${featureType.charAt(0).toUpperCase() + featureType.slice(1)} ${index + 1}`,
            description: objData.description || '',
            uid: objData.uid || '',
            name: objData.name || objData.title || '',
            uploadedAt: objData.uploadedAt || '',
            lstMod: objData.lstMod || '',
            thumbnail: objData.thumbnail,
            thumbnailUrl: objData.thumbnailUrl,
            loading: true,
            processed: false,
          } as IProcessedFeatureItem;
        } catch (error) {
          console.error(`Error fetching object data for ${objId}:`, error);
          return null;
        }
      });

      const resolvedObjects = await Promise.all(objectPromises);
      const validObjects = resolvedObjects.filter((obj): obj is IProcessedFeatureItem => obj !== null);

      // Store the initial items in the cache
      action(() => {
        this.featureItemsMap[cacheKey] = validObjects;
      })();

      // Process each item to get its thumbnail
      const processedItems = await Promise.all(
        validObjects.map(async (item, index) => {
          try {
            const thumbnailData = await this.getFeatureThumbnailUrl(
              item,
              defaultImage
            );

            return {
              ...item,
              thumbnailUrl: thumbnailData.thumbnailUrl,
              title: thumbnailData.title || item.title,
              description: thumbnailData.description || item.description,
              loading: false,
              processed: true,
            };
          } catch (error) {
            return {
              ...item,
              thumbnailUrl: defaultImage,
              loading: false,
              processed: true,
            };
          }
        })
      );

      // Store the processed items in the cache
      action(() => {
        this.featureItemsMap[cacheKey] = processedItems;
        this.processingFeatures = false;
      })();

      return processedItems;
    } catch (error) {
      action(() => {
        this.processingFeatures = false;
      })();
      return [];
    }
  };

  // Get feature items from objId strings (new schema)
  getFeatureItemsFromIds = (
    featureType: 'avatar' | 'jump' | 'duck' | 'dodge',
    objIds: string[]
  ): IProcessedFeatureItem[] => {
    if (!objIds || objIds.length === 0) return [];

    const cacheKey = `${featureType}-${objIds.join('-')}`;
    return this.featureItemsMap[cacheKey] || [];
  };
}

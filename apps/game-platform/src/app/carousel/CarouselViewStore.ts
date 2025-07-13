import { makeAutoObservable, makeObservable, observable, action, computed } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { getGamesForCarousel, ICustomModule, getImgbyId, ICurrentUserModel, IGameSession, IGameUserModel } from '@lidvizion/commonlib';
import { SUBCATEGORY_TO_CATEGORY, SAMPLE_TAGS } from '../gamelibrary/GameLibraryProps';

// Extend IGameSession with additional properties we need
export interface IRecentGameSession extends IGameSession {
  imageUrl?: string;
  gameTitle?: string;
}

// Define the BSON NumberLong type structure
interface BSONNumberLong {
  $numberLong: string;
}

// Type guard to check if a value is a BSON NumberLong
function isBSONNumberLong(value: unknown): value is BSONNumberLong {
  return (
    typeof value === 'object' && 
    value !== null && 
    '$numberLong' in value && 
    typeof (value as { $numberLong: unknown }).$numberLong === 'string'
  );
}

// Add this type guard at the top of the file, after the other interfaces
interface MongoDBCursor {
  toArray: () => Promise<any[]>;
}

// Type guard to check if an object has a toArray method
function hasToArray(obj: any): obj is MongoDBCursor {
  return obj && typeof obj.toArray === 'function';
}

// Add these interfaces near the top of the file, after existing interfaces
interface IGameMetadata {
  moduleId: string;
  settings?: {
    gTitle?: string;
    url?: string;
  };
  imgId?: string;
}

// Replace the MongoAggregationStage interface with this more specific one
interface MongoAggregationStage {
  [key: string]: any;  // Index signature for MongoDB stage operators
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

export class CarouselViewStore {
  root: RootStore;
  games: ICustomModule[] = [];
  loading = true;
  error: string | null = null;
  currentIndex = 0;
  autoScrollEnabled = true;
  autoScrollInterval = 3000;
  showDescription: { [key: string]: boolean } = {};
  pageSize = 10;
  currentPage = 0;
  hasMoreGames = true;
  isMuted = true;
  gameImages: { [key: string]: string } = {};
  selectedCategory: string | null = null;
  showFilterDropdown = false;
  @observable searchQuery = ''; // Make searchQuery observable
  
  // Game preview panel state
  activePreviewGame: ICustomModule | null = null;
  showPreviewPanel = false;
  previewPanelExpanded = false;

  // Recently played games
  currUser: ICurrentUserModel | IGameUserModel | null = null;
  recentGames: IRecentGameSession[] = [];
  loadingRecentGames = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      root: false,
      searchQuery: observable,
      // setSearchQuery: action,
      activePreviewGame: observable,
      showPreviewPanel: observable,
      previewPanelExpanded: observable,
    });
  }

  setGameImage = action((moduleId: string, imageUrl: string) => {
    this.gameImages[moduleId] = imageUrl;
  });

  getGameImage = (moduleId: string) => {
    return this.gameImages[moduleId];
  };

  setGames = action((games: ICustomModule[]) => {
    this.games = games;
  });

  fetchGameImage = async (moduleId: string, imgId: string): Promise<string | null> => {
    if (!this.root.db || !imgId) return null;

    try {
      const imgData = await getImgbyId(this.root.db, imgId);
      if (imgData?.s3Url) {
        this.setGameImage(moduleId, imgData.s3Url);
        return imgData.s3Url;
      }
    } catch (error) {
      console.error('Error fetching game image:', error);
    }
    return null;
  };

  setLoading = action((loading: boolean) => {
    this.loading = loading;
  });

  setError = action((error: string | null) => {
    this.error = error;
  });

  setCurrentIndex = action((index: number) => {
    this.currentIndex = index;
  });

  nextSlide = action(() => {
    this.currentIndex = (this.currentIndex + 1) % this.games.length;
  });

  previousSlide = action(() => {
    this.currentIndex = (this.currentIndex - 1 + this.games.length) % this.games.length;
  });

  toggleAutoScroll = action(() => {
    this.autoScrollEnabled = !this.autoScrollEnabled;
  });

  setAutoScrollInterval = action((interval: number) => {
    this.autoScrollInterval = interval;
  });

  setShowDescription = action((moduleId: string, show: boolean) => {
    this.showDescription[moduleId] = show;
  });

  setMuted = action((muted: boolean) => {
    this.isMuted = muted;
  });

  resetPagination = action(() => {
    this.currentPage = 0;
    this.hasMoreGames = true;
  });

  loadNextPage = action(async () => {
    if (!this.hasMoreGames || this.loading) return;
    
    this.currentPage++;
    await this.fetchGamesForCarousel(true); // append = true
  });

  fetchGamesForCarousel = action(async (append = false): Promise<ICustomModule[]> => {
    try {
      if (!this.root.db) {
        return [];
      }

      if (!append) {
        this.setLoading(true);
      }

      const filter = { public: true, verified: true, isDeleted: { $ne: true } };
      
      const options = {
        skip: this.currentPage * this.pageSize,
        limit: this.pageSize,
      };

      try {
        const modules = await getGamesForCarousel(this.root.db, filter, options) as ICustomModule[];
        
        if (modules && modules.length > 0) {
          // Fetch images for all modules
          await Promise.all(
            modules.map(async (module) => {
              if (module.imgId) {
                await this.fetchGameImage(module.moduleId, module.imgId);
              }
            })
          );
          
          if (append) {
            this.setGames([...this.games, ...modules]);
          } else {
            this.setGames(modules);
          }
          
          this.hasMoreGames = modules.length === this.pageSize;
          
          return modules;
        } else {
          this.hasMoreGames = false;
          return [];
        }
      } catch (error) {
        this.setError('Error fetching games');
        return [];
      } finally {
        this.setLoading(false);
      }
    } catch (error) {
      this.setError('Error fetching games');
      this.setLoading(false);
      return [];
    }
  });

  /**
   * Handles selection of a game from the carousel
   */
  handleGameSelect = action((game: ICustomModule): void => {
    // Open the game in a new tab
    const gameUrl = `/${game.settings?.url || game.moduleId}`;
    window.open(gameUrl, '_blank', 'noopener,noreferrer');
    
    // Also show the preview panel
    this.setActivePreviewGame(game);
    this.setShowPreviewPanel(true);
    this.setPreviewPanelExpanded(false);
  });

  // Game preview panel actions
  setActivePreviewGame = action((game: ICustomModule | null) => {
    this.activePreviewGame = game;
  });

  setShowPreviewPanel = action((show: boolean) => {
    this.showPreviewPanel = show;
  });

  setPreviewPanelExpanded = action((expanded: boolean) => {
    this.previewPanelExpanded = expanded;
  });

  togglePreviewPanelExpanded = action(() => {
    this.previewPanelExpanded = !this.previewPanelExpanded;
  });

  closePreviewPanel = action(() => {
    this.showPreviewPanel = false;
    this.previewPanelExpanded = false;
  });

  // Method to actually play/launch the game
  playSelectedGame = action((): void => {
    if (!this.activePreviewGame) return;
    
    const gameUrl = `/${this.activePreviewGame.settings?.url || this.activePreviewGame.moduleId}`;
    window.open(gameUrl, '_blank', 'noopener,noreferrer');
  });

  // Add to favorites (placeholder for now)
  toggleFavoriteGame = action((gameId: string): void => {
    console.log('Toggle favorite for game:', gameId);
    // Implementation will be added when backend is ready
  });

  // Share game (placeholder for now)
  shareGame = action((gameId: string): void => {
    console.log('Share game:', gameId);
    // Implementation will be added when backend is ready
  });

  // Report game (placeholder for now)
  reportGame = action((gameId: string, reportReason: string): void => {
    console.log('Report game:', gameId, 'Reason:', reportReason);
    // Implementation will be added when backend is ready
  });

  // Add a method to fetch creator information
  fetchGameCreatorInfo = action(async (creatorId: string): Promise<string> => {
    if (!creatorId || !this.root.db) return 'Unknown Creator';
    
    try {
      // This would be replaced with an actual DB query to get creator info
      return 'Game Studio'; // Placeholder
    } catch (error) {
      console.error('Error fetching creator info:', error);
      return 'Unknown Creator';
    }
  });

  // Method to set current user
  setCurrUser = action((user: ICurrentUserModel | IGameUserModel | null) => {
    this.currUser = user;
  });

  // Helper method to get user's recent game sessions - no limit by default to get all games
  private async getUserGameSessions(limit?: number): Promise<IGameSession[]> {
    console.log('Starting getUserGameSessions with limit:', limit);
    console.log('Current user:', this.currUser?.uid);

    if (!this.root.db || !this.currUser?.uid) {
      console.log('No database connection or user ID available');
      return [];
    }

    const collection = this.root.db.collection('game_session');
    const query = { 
      uid: this.currUser.uid,
      $or: [
        { endTime: { $exists: true, $ne: null } },
        { gameEntryTime: { $exists: true } }
      ]
    };

    console.log('Query for game sessions:', JSON.stringify(query));

    const pipeline: MongoAggregationStage[] = [
      { $match: query },
      { $addFields: {
          sortDate: { $ifNull: ["$endTime", "$gameEntryTime"] }
        }
      },
      { $sort: { sortDate: -1 } }
    ];

    if (limit) {
      pipeline.push({ $limit: limit });
    }

    console.log('Aggregation pipeline:', JSON.stringify(pipeline));

    const sessions = await collection.aggregate(pipeline);
    const results = hasToArray(sessions) ? await sessions.toArray() : sessions;
    console.log(`Found ${results.length} game sessions`);
    console.log('Sample session:', results[0]);

    return results;
  }

  // Helper method to get game metadata from database
  private async getGameMetadata(gameIds: string[]): Promise<IGameMetadata[]> {
    console.log('Starting getGameMetadata for gameIds:', gameIds);

    if (!this.root.db || gameIds.length === 0) {
      console.log('No database connection or game IDs provided');
      return [];
    }

    const moduleCollection = this.root.db.collection('default_modules');
    const query = { moduleId: { $in: gameIds } };
    console.log('Metadata query:', JSON.stringify(query));

    const result = await moduleCollection.find(query);
    const metadata = hasToArray(result) ? await result.toArray() : result;
    console.log(`Found metadata for ${metadata.length} games`);
    console.log('Sample metadata:', metadata[0]);

    return metadata;
  }

  // Helper method to convert a game session to a recent game with metadata
  private async convertToRecentGame(
    session: IGameSession, 
    metadata: IGameMetadata | undefined
  ): Promise<IRecentGameSession> {
    console.log('Converting session to recent game:', {
      sessionId: session.sessionId,
      gameId: session.gameId,
      hasMetadata: !!metadata
    });

    const endTime = this.extractTimestamp(session.endTime);
    const gameEntryTime = this.extractTimestamp(session.gameEntryTime);

    const recentGame: IRecentGameSession = {
      ...session,
      endTime: endTime ?? null,
      gameEntryTime: gameEntryTime,
      isCompleted: !!endTime,
      gameTitle: metadata?.settings?.gTitle || this.formatGameUrlToTitle(session.gameUrl || ''),
      score: session.score || 0,
      gameUrl: metadata?.settings?.url || session.gameUrl || 'unknown-game'
    };

    if (metadata?.imgId) {
      console.log('Fetching image for game:', metadata.moduleId);
      const imageUrl = await this.fetchGameImage(metadata.moduleId, metadata.imgId);
      if (imageUrl) {
        recentGame.imageUrl = imageUrl;
        console.log('Successfully fetched image URL');
      } else {
        console.log('No image URL found');
      }
    }

    console.log('Converted recent game:', {
      sessionId: recentGame.sessionId,
      gameTitle: recentGame.gameTitle,
      gameUrl: recentGame.gameUrl,
      hasImage: !!recentGame.imageUrl
    });

    return recentGame;
  }

  // Method to fetch recent games - now independent of fetchAllGames
  fetchRecentGames = action(async (limit?: number) => {
    console.log('----------------------------------------------------');
    console.log('Starting fetchRecentGames process');
    console.log('Current user:', this.currUser?.uid);
    console.log('Requested limit:', limit);
    console.log('----------------------------------------------------');
    
    if (!this.currUser || !this.root.db) {
      console.log('No current user or database connection available');
      this.recentGames = [];
      return;
    }

    this.loadingRecentGames = true;
    
    try {
      // 1. Get ALL user's game sessions (or up to limit if specified)
      console.log('Step 1: Fetching user game sessions...');
      const userGames = await this.getUserGameSessions(limit);
      console.log(`Found ${userGames.length} user game sessions`);
      
      if (!userGames || userGames.length === 0) {
        console.log('No recent game sessions found for this user');
        this.recentGames = [];
        return;
      }

      // 2. Get unique gameIds from ALL sessions
      console.log('Step 2: Extracting unique game IDs...');
      const uniqueGameIds = Array.from(new Set(
        userGames
          .filter((session: IGameSession) => session.gameId)
          .map((session: IGameSession) => session.gameId)
      ));
      console.log(`Found ${uniqueGameIds.length} unique game IDs:`, uniqueGameIds);

      if (uniqueGameIds.length === 0) {
        console.log('No valid game IDs found in sessions');
        this.recentGames = [];
        return;
      }

      // 3. Fetch metadata for ALL unique games
      console.log('Step 3: Fetching game metadata...');
      const gameMetadata = await this.getGameMetadata(uniqueGameIds);
      console.log(`Retrieved metadata for ${gameMetadata.length} games`);
      const metadataMap = new Map(
        gameMetadata.map((game: IGameMetadata) => [game.moduleId, game])
      );
      console.log('Metadata map created with keys:', Array.from(metadataMap.keys()));

      // 4. Convert ALL sessions to recent games with metadata
      console.log('Step 4: Converting sessions to recent games...');
      const recentGames = await Promise.all(
        userGames.map((session: IGameSession) => 
          this.convertToRecentGame(session, metadataMap.get(session.gameId))
        )
      );
      
      // 5. Set recent games - now includes ALL games
      console.log('Step 5: Setting recent games...');
      this.recentGames = recentGames;
      
      console.log('----------------------------------------------------');
      console.log(`Successfully processed ${recentGames.length} recent games for user ${this.currUser.uid}`);
      console.log('Sample recent game:', recentGames[0]);
      console.log('----------------------------------------------------');
      
    } catch (error) {
      console.error('Error fetching recent games:', error);
      this.recentGames = [];
    } finally {
      this.loadingRecentGames = false;
    }
  });

  // Helper method to format game URL to a readable title
  private formatGameUrlToTitle = (gameUrl: string): string => {
    if (!gameUrl) return 'Unknown Game';
    
    // Remove any path prefix
    const gameName = gameUrl.split('/').pop() || gameUrl;
    
    // Convert dash-case to Title Case
    return gameName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper method to extract timestamp from various formats
  private extractTimestamp = (timestamp: unknown): number | undefined => {
    if (typeof timestamp === 'number') {
      return timestamp;
    } else if (isBSONNumberLong(timestamp)) {
      return Number(timestamp.$numberLong);
    }
    return undefined;
  };

  // Add this computed property after other class properties
  get uniqueGamesWithHighestScores(): IRecentGameSession[] {
    const gameMap = new Map<string, IRecentGameSession>();
    
    this.recentGames.forEach(game => {
      if (!game.gameId) return;
      
      const existingGame = gameMap.get(game.gameId);
      const currentScore = game.score || 0;
      
      if (!existingGame || (existingGame.score || 0) < currentScore) {
        gameMap.set(game.gameId, game);
      }
    });
    
    return Array.from(gameMap.values())
      .sort((a, b) => ((b.score || 0) - (a.score || 0)));
  }
} 
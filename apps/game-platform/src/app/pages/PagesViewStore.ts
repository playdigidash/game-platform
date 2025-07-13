import { makeAutoObservable, runInAction, action } from 'mobx';
// import { page } from '../pages/constants';
import { getImgbyId,
  IPageModel,
  ICustomModule,
  ISocialLink,
  IGlb, ICurrQType, IHint, IAnswer, getPreSignedUrl,
  getPageByHandle,
  getPageById } from '@lidvizion/commonlib';
import { RootStore } from '../RootStore/RootStore';



export class PagesViewStore {
  root: RootStore;
  page: IPageModel | null = null;
  games: ICustomModule[] = [];
  isLoading = false;
  error: string | null = null;
  searchQuery = '';
  sortBy: 'recent' | 'popular' = 'recent';
  pageImages: Record<string, string> = {}; // Store for page images
  pageBio = ''; // Store the page bio separately
  socialLinks: ISocialLink[] = []; // Store social links

  // Image loading states
  bannerLoading = true;
  bannerError = false;
  profileLoading = true;
  profileError = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  setSortBy = (sort: 'recent' | 'popular') => {
    this.sortBy = sort;
  };

  get filteredGames() {
    if (!this.searchQuery) return this.sortedGames;

    return this.sortedGames.filter(game =>
      (game.name?.toLowerCase() || '').includes(this.searchQuery.toLowerCase()) ||
      (game.settings?.gDesc?.toLowerCase() || '').includes(this.searchQuery.toLowerCase())
    );
  }

  get sortedGames() {
    if (this.sortBy === 'recent') {
      // Sort by creation date, newest first using createdOn timestamp
      return [...this.games].sort((a, b) => {
        // Check if we have createdOn property
        if (a.createdOn && b.createdOn) {
          return b.createdOn - a.createdOn;
        }

        // If not available, use updatedOn as fallback
        if (a.updatedOn && b.updatedOn) {
          return b.updatedOn - a.updatedOn;
        }

        return 0; // No sortable dates available
      });
    } else {
      // For 'popular' sorting, we could use play count or another metric
      // For now, just return the games as is or implement a placeholder sorting
      return this.games;
    }
  }

  get featuredGames() {
    if (!this.page || !this.page.featuredModuleIds || !this.games || this.games.length === 0) {
      return [];
    }

    const featuredIds = this.page.featuredModuleIds;

    // Filter the games array to include only those whose moduleId is in featuredIds
    const filteredGames = this.games.filter(game => {
      const included = featuredIds.includes(game.moduleId);
      return included;
    });

    // Sort the filtered games according to the order in featuredIds
    const sortedAndFiltered = filteredGames.sort((a, b) => {
      return featuredIds.indexOf(a.moduleId) - featuredIds.indexOf(b.moduleId);
    });
    return sortedAndFiltered;
  }

  fetchpageByHandle = async (handle: string) => {
    this.isLoading = true;
    this.error = null;
    try {
      const data = await getPageByHandle(this.root.db, handle);
      if (!data) {
        throw new Error('page not found');
      }
      await this.setpageById(data.pageId);
    } catch (err) {
      console.error('[PagesViewStore] fetchpageByHandle error:', err);
      runInAction(() => {
        this.error = 'Failed to fetch page data';
        this.isLoading = false;
      });
    }
  };

  setPageImage = (imageType: string, imageUrl: string) => {
    action(() => {
      this.pageImages[imageType] = imageUrl;
    })();
  };

  resetImageLoadingStates = action(() => {
    this.bannerLoading = true;
    this.bannerError = false;
    this.profileLoading = true;
    this.profileError = false;
  });

  setBannerLoadingState = action((loading: boolean, error = false) => {
    this.bannerLoading = loading;
    this.bannerError = error;
  });

  setProfileLoadingState = action((loading: boolean, error = false) => {
    this.profileLoading = loading;
    this.profileError = error;
  });

  getPageImage = (imageType: string) => {
    return this.pageImages[imageType];
  };

  fetchPageImage = async (imageType: string, imgId: string): Promise<string | null> => {
    if (!this.root.db || !imgId) {
      return null;
    }

    // Set loading state based on image type
    if (imageType === 'banner') {
      this.bannerLoading = true;
      this.bannerError = false;
    } else if (imageType === 'mainPic' || imageType === 'smallPic') {
      this.profileLoading = true;
      this.profileError = false;
    }

    try {
      // Use getImgbyId to fetch the image metadata
      const imgMeta = await getImgbyId(this.root.db, imgId);

      if (imgMeta && imgMeta.id && imgMeta.ext && imgMeta.uid) {
        // Construct S3 file key using {uid}/{id}.{ext}
        const s3FileKey = `${imgMeta.uid}/${imgMeta.id}.${imgMeta.ext}`;

        // Get pre-signed URL for display
        const getUrlResponse = await getPreSignedUrl(s3FileKey);
        if (getUrlResponse?.body) {
          const finalS3Url = getUrlResponse.body.replace(/^"|"$/g, '');
          this.setPageImage(imageType, finalS3Url);

          // Set success state
          if (imageType === 'banner') {
            this.bannerLoading = false;
            this.bannerError = false;
          } else if (imageType === 'mainPic' || imageType === 'smallPic') {
            this.profileLoading = false;
            this.profileError = false;
          }

          return finalS3Url;
        } else {
          console.warn('[fetchPageImage] No pre-signed URL returned for', imageType, 'with imgId', imgId);
          this.setPageImage(imageType, ''); // Clear if failed

          // Set error state
          if (imageType === 'banner') {
            this.bannerLoading = false;
            this.bannerError = true;
          } else if (imageType === 'mainPic' || imageType === 'smallPic') {
            this.profileLoading = false;
            this.profileError = true;
          }

          return null;
        }
      } else {
        console.warn('[fetchPageImage] Incomplete image metadata for', imageType, 'with imgId', imgId, imgMeta);
        this.setPageImage(imageType, ''); // Clear if failed

        // Set error state
        if (imageType === 'banner') {
          this.bannerLoading = false;
          this.bannerError = true;
        } else if (imageType === 'mainPic' || imageType === 'smallPic') {
          this.profileLoading = false;
          this.profileError = true;
        }

        return null;
      }
    } catch (error) {
      console.error('[fetchPageImage] Error fetching', imageType, 'with imgId', imgId, error);
      this.setPageImage(imageType, ''); // Clear on error

      // Set error state
      if (imageType === 'banner') {
        this.bannerLoading = false;
        this.bannerError = true;
      } else if (imageType === 'mainPic' || imageType === 'smallPic') {
        this.profileLoading = false;
        this.profileError = true;
      }

      return null;
    }
  };

  setpageById = async (pageId: string) => {
    this.error = null;
    // Reset image loading states when loading a new page
    this.resetImageLoadingStates();

    try {
      const data = await getPageById(this.root.db, pageId);
      if (!data) {
        throw new Error('page not found');
      }
      // Store the bio in a separate property in the store
      if (data.bio) {
        if (this.page) this.page.bio = data.bio;
      } else {
        if (this.page) this.page.bio = '';
      }
      // Process social links
      this.socialLinks = [];
      if (data.socialLinks && Array.isArray(data.socialLinks)) {
        data.socialLinks.forEach(link => {
          if (link.url && link.type) {
            this.socialLinks.push({
              title: link.title || link.type,
              url: link.url,
              type: link.type
            });
          }
        });
      }
      // Store the page data
      runInAction(() => {
        this.page = data;
        this.isLoading = false;
      });
      // Fetch page images if available, using the stored IDs
      if (data.pageImg) {
        await this.fetchPageImage('mainPic', data.pageImg);
        await this.fetchPageImage('smallPic', data.pageImg);
      }
      if (data.bannerImg) {
        await this.fetchPageImage('banner', data.bannerImg);
      }
      // After setting the page, fetch the games
      await this.fetchGames();
    } catch (err) {
      console.error('[PagesViewStore] setpageById error:', err);
      runInAction(() => {
        this.error = 'Failed to fetch page data';
        this.isLoading = false;
      });
    }
  };

  fetchGames = async () => {
    if (!this.page?.pageId) {
      runInAction(() => {
        this.games = [];
      });
      return;
    }

    // Use `this.page.modules` to get the array of module IDs
    // Using `as any` temporarily as IPageModel.modules type will change to string[]
    const pageModuleIds = (this.page?.modules) as string[] | undefined;
    if (!pageModuleIds || pageModuleIds.length === 0) {
      runInAction(() => {
        this.games = [];
      });
      return;
    }

    try {
      const collection = this.root.db.collection('default_modules');
      // Query using the module IDs from the page.modules array
      const query = {
        moduleId: { $in: pageModuleIds },
        isDeleted: false,
        // public: true // Still optional, consider if needed
      };

      const data = await collection.find(query) as ICustomModule[];

      if (!data || data.length === 0) {
        runInAction(() => {
          this.games = [];
        });
        return;
      }

      runInAction(() => {
        this.games = data;
        // Sort games according to the order in pageModuleIds if needed
        const moduleIdOrder = pageModuleIds || []; // orgModuleIds is guaranteed to be an array here
        this.games.sort((a, b) => moduleIdOrder.indexOf(a.moduleId) - moduleIdOrder.indexOf(b.moduleId));
      });
    } catch (err) {
      runInAction(() => {
        this.games = []; // Ensure games is empty on error
      });
    }
  };


  ////WTF IS THIS...

  // Helper methods for UI components
  get links() {
    // Use the processed socialLinks directly
    return this.socialLinks;
  }

  get bannerImage() {
    const url = this.pageImages['banner'] || '';
    return url;
  }

  get profileImage() {
    const url = this.pageImages['mainPic'] || '';
    return url;
  }

  get smallProfileImage() {
    return this.pageImages['smallPic'] || '';
  }

  // Helper method to get page with extended properties
  get extendedpage(): IPageModel | null {
    if (!this.page) return null;

    return {
      ...this.page,
      socialLinks: this.socialLinks,
    };
  }
}



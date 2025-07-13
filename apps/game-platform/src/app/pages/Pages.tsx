import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Link,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Theme,
  SxProps,
  IconButtonProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useMongoDB,
  ICustomModule,
  IPageModel,
  ISocialLink,
  getSocialIcon,
} from '@lidvizion/commonlib';
import TwitterIcon from '@mui/icons-material/Twitter';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import { PagesViewStore } from './PagesViewStore';
import GameLibraryCard from '../gamelibrary/GameLibraryCard';
// import { Link as LinkType, page } from '../pages/constants';
import { useGameStore } from '../RootStore/RootStoreProvider';
import {
  PagesHeaderProps,
  GamesSectionProps,
  FeaturedGamesProps,
  AboutSectionProps,
} from './PagesProps';

const MainContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  bgcolor: theme.palette.background.default,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100vw',
  },
}));

// Styled components for OrgHeader
const HeaderBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '30vh',
  paddingTop: '8vh',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    height: '20vh',
  },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: 'clamp(-4rem, -6vh, -3rem)',
  paddingBottom: 'clamp(0.5rem, 1vh, 1rem)',
  paddingLeft: 'clamp(1.5rem, 4vw, 3rem)',
  paddingRight: 'clamp(1.5rem, 4vw, 3rem)',
  maxWidth: '75rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    maxWidth: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 'clamp(10rem, 15vw, 12rem)',
  height: 'clamp(10rem, 15vw, 12rem)',
  border: 'clamp(0.125rem, 0.5vw, 0.25rem) solid white',
  boxShadow: theme.shadows[3],
  marginRight: 'clamp(1rem, 3vw, 2rem)',
  [theme.breakpoints.down('sm')]: {
    width: '5rem',
    height: '5rem',
    marginRight: '1rem',
    marginBottom: 0,
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 'clamp(10rem, 15vw, 12rem)',
  height: 'clamp(10rem, 15vw, 12rem)',
  [theme.breakpoints.down('sm')]: {
    width: '5rem',
    height: '5rem',
  },
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  marginBottom: '1rem',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const SocialLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '0.5rem',
  justifyContent: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'flex-start',
  },
}));

// Styled components for Page Content
const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
  maxWidth: '75rem',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: '0 1rem 2rem',
    maxWidth: '100%',
  },
}));

// Styled components for FeaturedGames and AboutSection
const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: '2rem',
  width: '100%',
}));

const AboutContainer = styled(Box)(({ theme }) => ({
  marginBottom: '3rem',
  width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '1.5rem',
  fontWeight: 'bold',
}));

interface SocialIconButtonProps extends IconButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  component?: React.ElementType;
}

const SocialIconButton = styled(IconButton)<SocialIconButtonProps>(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    padding: 'clamp(0.5rem, 1vw, 1rem)',
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    minWidth: '2.8rem',
    minHeight: '2.8rem',
    [theme.breakpoints.down('sm')]: {
      padding: '0.5rem',
      fontSize: '1.5rem',
      minWidth: '2.5rem',
      minHeight: '2.5rem',
    },
  })
);

const SocialUrlLink = styled(Link)(({ theme }) => ({
  color: '#42a5f5', // Lighter blue color for better visibility
  textDecoration: 'none',
  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '&:hover': {
    textDecoration: 'underline',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

const ErrorStack = styled(Stack)(({ theme }) => ({
  padding: '2rem',
}));

const LoadingStack = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

// New styled component for the main content section
const MainContentSection = styled(Box)(({ theme }) => ({
  padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 4vw, 3rem)',
  maxWidth: '75rem',
  margin: '0 auto 0 auto',
  marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'left',
    padding: '1rem 1rem',
    maxWidth: '100%',
    margin: '0',
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
  },
}));

const DescriptionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  padding: 'clamp(1rem, 2vw, 2rem)',
  borderRadius: '1rem',
  marginBottom: '1.5rem',
  marginTop: '1rem',
}));

// Banner container styled component
const BannerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    padding: '0',
    margin: '0',
  },
}));

const BannerContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '75rem', // 1200px equivalent
  height: 'clamp(12rem, 22vh, 20rem)',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
    height: 'clamp(10rem, 20vh, 15rem)',
    maxWidth: '100vw',
    width: '100vw',
  },
}));

// Modified Header Component - removed social links
const PagesHeader = observer(({ page, theme }: PagesHeaderProps) => {
  const {
    bannerImage,
    profileImage,
    bannerLoading,
    bannerError,
    profileLoading,
    profileError,
    setBannerLoadingState,
    setProfileLoadingState,
  } = useGameStore().pagesViewStore;

  const defaultBanner =
    'https://via.placeholder.com/1200x300/5722C9/ffffff?text=page+Banner';
  const defaultProfilePic =
    'https://via.placeholder.com/100/5722C9/ffffff?text=Profile';
  const bannerUrl = bannerImage || defaultBanner;
  const profilePicUrl = profileImage || defaultProfilePic;

  // Use loading states from viewstore
  const bannerToShow = bannerError ? defaultBanner : bannerUrl;
  const profileToShow = profileError ? defaultProfilePic : profilePicUrl;

  return (
    <>
      <BannerContainer>
        <BannerContent>
          {bannerLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
            >
              <CircularProgress size="clamp(2rem, 5vw, 3rem)" />
            </div>
          )}
          <img
            src={bannerToShow}
            alt="Page Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: bannerLoading ? 0 : 1,
              transition: 'opacity 0.3s',
              display: 'block',
            }}
            onLoad={() => {
              setBannerLoadingState(false, false);
            }}
            onError={() => {
              setBannerLoadingState(false, true);
            }}
            draggable={false}
          />
        </BannerContent>
      </BannerContainer>
      <ProfileSection>
        <AvatarContainer>
          {profileLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
            >
              <CircularProgress size="clamp(1.5rem, 4vw, 2rem)" />
            </div>
          )}
          <img
            src={profileToShow}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              opacity: profileLoading ? 0 : 1,
              transition: 'opacity 0.3s',
              display: 'block',
            }}
            onLoad={() => {
              setProfileLoadingState(false, false);
            }}
            onError={() => {
              setProfileLoadingState(false, true);
            }}
            draggable={false}
          />
        </AvatarContainer>
      </ProfileSection>
    </>
  );
});

// Styled components for GamesSection
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
  },
}));

const SearchControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '0.5rem',
  flex: '0 0 auto',
  maxWidth: '30rem',
  alignItems: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: '100%',
    gap: '0.25rem',
  },
}));

const GamesSectionContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

const SearchIconWrapper = styled(SearchIcon)(({ theme }) => ({
  marginRight: '0.5rem',
  opacity: 0.5,
}));

// Utility function to truncate URLs
const truncateUrl = (url: string, maxLength = 45): string => {
  // Remove protocol and www if present
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');

  if (cleanUrl.length <= maxLength) {
    return cleanUrl;
  }

  // Truncate and add ellipsis
  return cleanUrl.substring(0, maxLength - 3) + '...';
};

// New component for main content with title, description, and social links
const MainContent = observer(({ page }: { page: IPageModel }) => {
  const { pagesViewStore } = useGameStore();
  const { links } = pagesViewStore;
  const bio = pagesViewStore.page?.bio;

  // Only show the first link (like Instagram)
  const primaryLink = links.length > 0 ? links[0] : null;

  return (
    <MainContentSection>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          lineHeight: 1.2,
          marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)',
        }}
      >
        {page.pageTitle}
      </Typography>

      <Typography
        variant="body1"
        color="text.primary"
        sx={{
          fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
          lineHeight: 1.6,
          marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
        }}
      >
        {bio ? bio : (
          <Typography color="text.secondary" fontStyle="italic">
            This page has no description yet.
          </Typography>
        )}
      </Typography>

      <SocialLinks>
        {primaryLink && (
          <SocialUrlLink
            href={primaryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            title={primaryLink.title}
          >
            <LinkIcon sx={{
              fontSize: '1.2rem',
              transform: 'rotate(-45deg)',
            }} />
            {truncateUrl(primaryLink.url)}
          </SocialUrlLink>
        )}
      </SocialLinks>
    </MainContentSection>
  );
});

// Styled components for carousel
const CarouselContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  gap: '1.5rem',
  paddingBottom: '1rem',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[800],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[600],
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '1rem',
    paddingRight: '1rem',
    marginRight: '-1rem',
  },
}));

const CarouselCard = styled(Box)(({ theme }) => ({
  minWidth: '17.5rem',
  maxWidth: '20rem',
  flex: '1 1 17.5rem',
  [theme.breakpoints.down('sm')]: {
    minWidth: 'calc(45vw - 1rem)',
    maxWidth: 'calc(45vw - 0.5rem)',
    flex: '1 1 calc(45vw - 1rem)',
  },
}));

const AllGamesCard = styled(Box)(({ theme }) => ({
  width: '20rem',
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    width: '18rem',
  },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(50vw - 2rem)',
    maxWidth: 'calc(50vw - 2rem)',
  },
}));

// Featured Games Component
const FeaturedGamesSection = observer(() => {
  const { featuredGames } = useGameStore().pagesViewStore;
  const navigate = useNavigate();

  const handleGameClick = (game: ICustomModule) => {
    navigate(`/${game.settings.url}`);
  };

  return (
    <SectionContainer>
            <Box component="div" sx={{
        minWidth: { xs: '100%', sm: '24vw' },
        marginBottom: '1rem',
        width: { xs: '100%', sm: 'auto' }
      }}>
        <SectionTitle variant="h5">
          Featured Interactive Resources
        </SectionTitle>
      </Box>
      <CarouselContainer>
        {featuredGames.length > 0 ? (
          featuredGames.map((game: ICustomModule) => (
            <CarouselCard key={game.moduleId}>
              <GameLibraryCard
                game={game}
                onClick={() => handleGameClick(game)}
              />
            </CarouselCard>
          ))
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            No featured games available yet.
          </Typography>
        )}
      </CarouselContainer>
    </SectionContainer>
  );
});

// All Games Component
const AllGamesSection = observer(() => {
  const {
    games,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredGames,
    featuredGames,
  } = useGameStore().pagesViewStore;
  const navigate = useNavigate();

  const handleGameClick = (game: ICustomModule) => {
    navigate(`/${game.settings.url}`);
  };

    // Use filtered games if there's a search query, otherwise show all games
  const gamesToShow = searchQuery.trim() ? filteredGames : games;

  return (
    <GamesSectionContainer>
      <SearchContainer>
                <Box component="div" sx={{
          minWidth: { xs: '100%', sm: '245px' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Typography variant="h5" fontWeight="bold">
            All Interactive Resources
          </Typography>
        </Box>
        <SearchControls>
          <TextField
            sx={{ maxWidth: '200px' }}
            size="small"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIconWrapper />,
            }}
          />
          <Select
            size="small"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'recent' | 'popular')
            }
          >
            <MenuItem value="recent">Recently Added</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
          </Select>
        </SearchControls>
      </SearchContainer>

                        <CarouselContainer sx={{
        flexWrap: 'wrap',
        overflowX: 'visible',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        gap: { xs: '1rem', sm: '1.5rem' },
      }}>
        {gamesToShow.length > 0 ? (
          gamesToShow.map((game: ICustomModule) => (
            <AllGamesCard key={game.moduleId}>
              <GameLibraryCard
                game={game}
                onClick={() => handleGameClick(game)}
              />
            </AllGamesCard>
          ))
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            No games available yet.
          </Typography>
        )}
      </CarouselContainer>
    </GamesSectionContainer>
  );
});

export const Pages: React.FC = observer(() => {
  const { pageHandle } = useParams<{ pageHandle: string }>();
  const theme = useTheme();
  const {
    page,
    isLoading,
    error,
    fetchpageByHandle,
    fetchGames,
  } = useGameStore().pagesViewStore;

  useEffect(() => {
    if (pageHandle) {
      fetchpageByHandle(pageHandle);
    }
  }, [pageHandle, fetchpageByHandle]);

  useEffect(() => {
    if (page) {
      fetchGames();
    }
  }, [page, fetchGames]);

  if (isLoading) {
    return (
      <LoadingStack>
        <CircularProgress />
      </LoadingStack>
    );
  }

  if (error || !page) {
    return (
      <ErrorStack spacing={2}>
        <Alert severity="error">{error || 'page not found'}</Alert>
      </ErrorStack>
    );
  }

  return (
    <MainContainer>
      <PagesHeader page={page} theme={theme} />
      <PageContent>
        <MainContent page={page} />
        <FeaturedGamesSection />
        <AllGamesSection />
      </PageContent>
    </MainContainer>
  );
});

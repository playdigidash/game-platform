import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { IGlb } from '@lidvizion/commonlib';
import { useGameStore } from '../../../RootStore/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import { IProcessedFeatureItem } from '../../../gamelibrary/GameLibraryViewStore';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: theme.palette.common.white,
  marginBottom: '1rem',
  marginTop: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

const ObjectsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
  gap: '1rem',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(6rem, 1fr))',
  },
}));

const ObjectThumbnail = styled(Box)(({ theme }) => ({
  borderRadius: '0.5rem',
  overflow: 'hidden',
  position: 'relative',
  paddingTop: '75%', // 4:3 Aspect ratio
  backgroundColor: alpha(theme.palette.common.black, 0.2), // Light background to make empty space visible
  boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}`,
  minHeight: '100px',
  border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
}));

const ObjectName = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.common.white,
  marginTop: '0.5rem',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const ObjectImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  backgroundColor: alpha(theme.palette.common.black, 0.3),
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  display: 'block',
  minHeight: '120px',
}));

const ObjectItemWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

// Add a loading indicator wrapper
const LoadingWrapper = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Add description overlay
const DescriptionOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: alpha(theme.palette.common.black, 0.7),
  color: theme.palette.common.white,
  padding: '0.5rem',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  // overflow: 'hidden',
  fontSize: '0.75rem',
  '&:hover': {
    opacity: 1
  }
}));

// Customize the ThumbnailContainer to support hover effect
const ThumbnailContainer = styled('div')({

  display: 'block',

});

interface GameFeatureSectionProps {
  title: React.ReactNode;
  items: IGlb[] | string[];
  defaultImage: string;
  itemNamePrefix: string;
  featureType: 'avatar' | 'jump' | 'duck' | 'dodge';
}

export const GameFeatureSection: React.FC<GameFeatureSectionProps> = observer(({
  title,
  items,
  defaultImage,
  itemNamePrefix,
  featureType
}) => {
  const { gameLibraryViewStore } = useGameStore();

  // Call the store's processFeatureItems method when component mounts or items change
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    // Check if items are strings (new schema) or IGlb objects (old schema)
    const isStringArray = items.length > 0 && typeof items[0] === 'string';
    
    if (isStringArray) {
      // New schema: process string array (objIds)
      gameLibraryViewStore.processFeatureItemsFromIds(items as string[], featureType, defaultImage);
    } else {
      // Old schema: process IGlb array
      gameLibraryViewStore.processFeatureItems(items as IGlb[], featureType, defaultImage);
    }
  }, [items, featureType, gameLibraryViewStore, defaultImage]);

  if (!items || items.length === 0) return null;

  // Get processed items from the store
  const isStringArray = items.length > 0 && typeof items[0] === 'string';
  const processedItems = isStringArray 
    ? gameLibraryViewStore.getFeatureItemsFromIds(featureType, items as string[])
    : gameLibraryViewStore.getFeatureItems(featureType, items as IGlb[]);

  return (
    <>
      <SectionTitle>
        {title}
      </SectionTitle>
      <ObjectsGrid>
        {processedItems.map((item, index) => {
          const itemName = gameLibraryViewStore.getFeatureItemName(item, index, itemNamePrefix);
          
          // Ensure thumbnail URL is properly formed
          let thumbnailUrl = item.thumbnailUrl || defaultImage;
          
          // Check if the URL is a relative path that might need adjustment
          if (thumbnailUrl && thumbnailUrl.startsWith('/assets/')) {
            // Ensure the path doesn't have any double slashes or malformations
            thumbnailUrl = thumbnailUrl.replace(/\/+/g, '/');
          }


          return (
            <ObjectItemWrapper key={item.objId || `${itemNamePrefix}-${index}`}>
              <ObjectThumbnail>
                {item.loading ? (
                  <LoadingWrapper>
                    <CircularProgress size={24} />
                  </LoadingWrapper>
                ) : (
                  <ThumbnailContainer>
                    <ObjectImage 
                      src={thumbnailUrl}
                      alt={itemName}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {

                        // Try to append a timestamp to prevent caching issues
                        const newSrc = defaultImage + '?t=' + new Date().getTime();
                        e.currentTarget.src = newSrc;
                      }}
                    />
                    {item.description && (
                      <DescriptionOverlay>
                        {item.description}
                      </DescriptionOverlay>
                    )}
                  </ThumbnailContainer>
                )}
              </ObjectThumbnail>
              <ObjectName title={itemName}>{itemName}</ObjectName>
            </ObjectItemWrapper>
          );
        })}
      </ObjectsGrid>
    </>
  );
}); 
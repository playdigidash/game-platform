import LoadingOverlay from 'react-loading-overlay-ts';
import styled from '@emotion/styled';

{
  /* <StyledLoader
active={herosData.length === 0}
spinner
text="Loading heroes..."
classNamePrefix="MyLoader_"
> */
}

export const StyledLoader = styled(LoadingOverlay)`
  &.MyLoader_wrapper {
    width: 100%;
    height: 100%;
    overflow: visible;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2000;
  }

  &.MyLoader_overlay {
    background: rgba(0, 0, 0, 0.6);
  }

  &.MyLoader_content {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .MyLoader_spinner {
    width: 60px;
    height: 60px;
  }
`;

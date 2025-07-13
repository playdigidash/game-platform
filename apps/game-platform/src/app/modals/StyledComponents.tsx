import styled from 'styled-components';

// Styled components for the Achievement popup
export const AchievementContainer = styled.div`
  position: fixed;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  z-index: 1400;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  max-width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(0); /* Initial position for animation */
  
  &.hero {
    max-width: 300px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.7);
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.3rem;
  
  .hero & {
    transform: scale(1.5);
    margin-bottom: 0.6rem;
  }
`;

export const PointsText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
`;

export const MessageText = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-family: 'Orbitron', sans-serif;
  white-space: pre-line;
  text-align: center;
  width: 100%;
  
  &.hero {
    font-size: 1.2rem;
    letter-spacing: 0.05em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }
`; 
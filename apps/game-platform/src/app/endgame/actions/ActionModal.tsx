import React, { useEffect, useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { PrizeCodeDisplay } from './PrizeCodeDisplay';
import { RedirectAction } from './RedirectAction';
import { IGameSession, IActions } from '@lidvizion/commonlib';
import { updateGameSession } from '@lidvizion/commonlib';
import { RedirectActionType } from '../stores/ActionViewStore';
import { Canvas } from '@react-three/fiber';
import ExplosionConfetti from '../../FiberComponents/Helper/ExplosionConfetti';

const CenteredBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 200
});

const CenteredContentBox: React.FC<{children: React.ReactNode}> = ({children}) => (
  <CenteredBox>
    {children}
  </CenteredBox>
);

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    alignItems: 'flex-end',
    paddingBottom: '2rem', // Space from bottom of screen
  },
  '& .MuiDialog-paper': {
    width: 'clamp(18rem, 85vw, 32rem)',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    background: 'rgba(40,40,40,.95)',
    boxShadow: '0 0.75rem 1.5rem rgba(0,0,0,.45)',
    margin: '1rem', // Consistent margin on sides
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(0.25rem) brightness(0.6)',
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  margin: 0,
  paddingBlock: '1.75rem',
  paddingInline: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  borderBottom: 'none',
  '& .MuiTypography-root': {
    fontSize: '1.5rem',
    lineHeight: '1.75rem',
    marginBottom: '1rem',
  }
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: '0.25rem',
  top: '1.25rem',
  color: '#FFFFFF80',
  padding: '0.5rem',
  '& svg': {
    fontSize: '1.5rem',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingBlock: '0 1.75rem',
  paddingInline: '2rem',
  gap: '1rem',
  display: 'flex',
  flexDirection: 'column',
  '&.MuiDialogContent-root': {
    borderTop: 'none',
  },
  '& .MuiTypography-body1': {
    fontSize: '1rem',
    lineHeight: '1.25rem',
    maxWidth: '28rem',
    marginBlock: '1rem 1.25rem',
  }
}));

export interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  actionId: string | null;
}

export const ActionModal: React.FC<ActionModalProps> = observer(({
  open,
  onClose,
  actionId,
}) => {
  const { actionViewStore, scoreViewStore, gameViewStore } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClose = useCallback(() => {
    actionViewStore.setIsModalOpen(false);
    onClose();
  }, [actionViewStore, onClose]);

  // Effect for handling modal state changes
  useEffect(() => {
    if (open && actionId) {
      actionViewStore.setActionId(actionId);
      actionViewStore.setIsModalOpen(true);
    }
  }, [open, actionId, actionViewStore]);

  // Modified cleanup effect - only run on unmount
  useEffect(() => {
    // No immediate cleanup on mount
    return () => {
      // Only cleanup if the modal is actually closing
      if (!open) {
        actionViewStore.cleanup(actionId || '');
        actionViewStore.setIsModalOpen(false);
        actionViewStore.setActionId(null);
        actionViewStore.setCurrentAction(null);
      }
    };
  }, [actionViewStore, actionId, open]); // Added open to dependencies

  const handleComplete = useCallback(async () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      handleClose();
    }, 3000);
  }, [handleClose]);

  // Callbacks for child components
  const handlePrizeRedeemed = async (pointsEarned: number) => {
    try {
      // Add points to score
      scoreViewStore.addScore(pointsEarned);

      // Get current game session
      const currentSession = gameViewStore.gameSession;
      if (!currentSession?.sessionId || !actionId || !actionViewStore.root.db) {
        return;
      }

      // Create new action record
      const newAction = {
        actionId,
        completed: true,
        completedAt: new Date(),
        pointsEarned,
        type: actionViewStore.currentAction?.type
      };

      // Create updated session with new action
      const updatedSession = {
        ...currentSession,
        actions: [...(currentSession.actions || []), newAction]
      };

      // Update the game session using the updateGameSession function
      await updateGameSession({
        db: actionViewStore.root.db,
        sessionId: currentSession.sessionId,
        gameSession: updatedSession
      });

      // Update local state
      gameViewStore.setGameSession(updatedSession);

      // Increment the action completion metric
      await actionViewStore.root.db.collection('actions').updateOne(
        { actionId: actionId },
        { 
          $inc: { 'metrics.completions': 1 },
          $set: { 'metrics.lastUsedAt': new Date() }
        }
      );
    } catch (error) {
      console.error('Error updating after prize redemption:', error);
    }

    handleComplete();
  };

  const handleRedirectVerified = async (pointsToAward: number, verified: boolean) => {
    if (verified) {
      try {
        scoreViewStore.addScore(pointsToAward);

        const currentSession = gameViewStore.gameSession;
        if (!currentSession?.sessionId || !actionId || !actionViewStore.root.db) {
          return;
        }

        const newAction = {
          actionId,
          completed: true,
          completedAt: new Date(),
          pointsEarned: pointsToAward,
          type: actionViewStore.currentAction?.type
        };

        const updatedSession = {
          ...currentSession,
          actions: [...(currentSession.actions || []), newAction]
        };

        await updateGameSession({
          db: actionViewStore.root.db,
          sessionId: currentSession.sessionId,
          gameSession: updatedSession
        });

        gameViewStore.setGameSession(updatedSession);

        await actionViewStore.root.db.collection('actions').updateOne(
          { actionId: actionId },
          { 
            $inc: { 'metrics.completions': 1 },
            $set: { 'metrics.lastUsedAt': new Date() }
          }
        );
      } catch (error) {
        console.error('Error updating after redirect verification:', error);
      }
    }
    handleComplete();
  };

  const handleStartAction = () => {
    // Intentionally empty - placeholder for future implementation
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      {showConfetti && (
        <Canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          <ExplosionConfetti radius={20} />
        </Canvas>
      )}
      <StyledDialogTitle>
        <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {actionViewStore.currentAction?.name || 'Action'}
        </Typography>
        <CloseButton
          aria-label="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </CloseButton>
      </StyledDialogTitle>
      <StyledDialogContent>
        {actionViewStore.currentAction && actionId && (
          <RedirectAction 
            actionId={actionId}
            name={actionViewStore.currentAction.name}
            redirectUrl={(actionViewStore.currentAction as RedirectActionType).redirectUrl}
            points={actionViewStore.currentAction.points || 0}
            description={(actionViewStore.currentAction as RedirectActionType).description}
            onComplete={handleComplete}
          />
        )}
      </StyledDialogContent>
    </StyledDialog>
  );
}); 
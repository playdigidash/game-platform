/*
import { Dialog, DialogTitle, Typography, DialogContent, TextField, DialogActions, Button, useTheme, Box } from "@mui/material";
import { observer } from "mobx-react";
import { useState } from "react";
import { useGameStore } from "../../RootStore/RootStoreProvider";

interface IPrizeCodeModalProps {
    open: boolean;
    onClose: () => void;
  }
  
  export const PrizeCodeModal: React.FC<IPrizeCodeModalProps> = observer(
    ({ open, onClose }) => {
      const [code, setCode] = useState('');
      const [error, setError] = useState('');
      const { currUser } = useGameStore().gameLoginViewStore
      
      const { prizeCode, redeemPrizeCode } = useGameStore().gameViewStore;
      const { addScore } = useGameStore().scoreViewStore;
      const theme = useTheme();
  
      const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCode(value);
        setError('');
      };
  
      const handleRedeem = () => {
        if (!prizeCode) {
          setError('Invalid code. Please try again.');
          return;
        }
  
        if (prizeCode.isRedeemed) {
          setError('This code has already been redeemed!');
          return;
        }
  
        if (code === prizeCode.code) {
          // Mark as redeemed
          redeemPrizeCode();
  
          // Add score
          addScore(Number(prizeCode.points));
  
          // Create success effect
          const successEffect = document.createElement('div');
          successEffect.style.position = 'fixed';
          successEffect.style.top = '0';
          successEffect.style.left = '0';
          successEffect.style.width = '100vw';
          successEffect.style.height = '100vh';
          successEffect.style.pointerEvents = 'none';
          successEffect.style.zIndex = '9999';
  
          // Add success message
          const message = document.createElement('div');
          message.style.position = 'absolute';
          message.style.left = '50%';
          message.style.top = '50%';
          message.style.transform = 'translate(-50%, -50%)';
          message.style.fontSize = '2rem';
          message.style.fontWeight = 'bold';
          message.style.color = theme.palette.primary.main;
          message.style.textAlign = 'center';
          message.style.opacity = '0';
          message.textContent = `+${prizeCode.points} POINTS!`;
  
          // Animate message
          message.animate(
            [
              { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 },
              {
                transform: 'translate(-50%, -50%) scale(1.2)',
                opacity: 1,
                offset: 0.6,
              },
              { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
            ],
            {
              duration: 2000,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              fill: 'forwards',
            }
          );
  
          successEffect.appendChild(message);
  
          // Add particles
          for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = theme.palette.primary.main;
            particle.style.left = '50%';
            particle.style.top = '50%';
  
            // Random animation
            const angle = (Math.random() * 360 * Math.PI) / 180;
            const distance = 30 + Math.random() * 50;
  
            particle.animate(
              [
                {
                  transform: 'translate(-50%, -50%) scale(1)',
                  opacity: 1,
                },
                {
                  transform: `translate(
                    calc(-50% + ${Math.cos(angle) * distance}vw), 
                    calc(-50% + ${Math.sin(angle) * distance}vh)
                  ) scale(0)`,
                  opacity: 0,
                },
              ],
              {
                duration: 2000 + Math.random() * 500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards',
              }
            );
  
            successEffect.appendChild(particle);
          }
  
          document.body.appendChild(successEffect);
  
          // Clean up effects
          setTimeout(() => {
            document.body.removeChild(successEffect);
          }, 2000);
  
          onClose();
        } else {
          setError('Invalid code. Please try again.');
        }
      };
  
      return (
        <Dialog
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              background: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              minWidth: '50vw',
            },
          }}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Redeem Prize Code
            </Typography>
          </DialogTitle>
  
          <DialogContent>
            <Box 
            component="div" 
            sx={{ p: 2, textAlign: 'center' }}
            >
              {prizeCode?.isRedeemed ? (
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: theme.palette.error.main }}
                >
                  This prize code has already been redeemed!
                </Typography>
              ) : (
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Enter your prize code to claim bonus points!
                </Typography>
              )}
              <TextField
                fullWidth
                variant="outlined"
                value={code}
                onChange={handleCodeChange}
                error={!!error}
                helperText={error}
                disabled={prizeCode?.isRedeemed}
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: 'center',
                    fontSize: '2rem',
                    letterSpacing: '0.5em',
                    fontWeight: 'bold',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '1rem',
                    padding: '2rem',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.dark,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: '1rem',
                px: 3,
              }}
            >
              {prizeCode?.isRedeemed ? 'Close' : 'Cancel'}
            </Button>
            {!prizeCode?.isRedeemed && (
              <Button
                onClick={handleRedeem}
                variant="contained"
                disabled={code.length < 1}
                sx={{
                  borderRadius: '20px',
                  px: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                }}
              >
                Redeem
              </Button>
            )}
          </DialogActions>
        </Dialog>
      );
    }
  );
*/
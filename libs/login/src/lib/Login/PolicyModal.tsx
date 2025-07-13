import React from 'react'
import { Dialog, IconButton,Toolbar, CardMedia } from '@mui/material';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { useLoginStore } from '../RootStore/RootStoreProvider';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PolicyModal: React.FC = observer(() => {
  // const theme = useTheme();
  const { 
    showPolicyModal,
    setShowPolicyModal
  } = useLoginStore().loginViewStore

  return (
            <Dialog
              fullScreen
              open={showPolicyModal}
              TransitionComponent={Transition}
            >
              <>
                <Toolbar>
                  <IconButton
                    style={{
                      marginLeft: '95%'
                    }}
                    color="inherit"
                    onClick={setShowPolicyModal.bind(this, false)}
                    aria-label="close"
                  >
                    <CloseIcon style={{fontSize: 43}}/>
                  </IconButton>
                </Toolbar>
                {'https://www.lidvizion.com/privacy-policy-app/' && (
                  <CardMedia
                    sx={{ height: '100%' }}
                    component="iframe"
                    src={'https://www.lidvizion.com/privacy-policy-app/'}
                  />
                )}
              </>
            </Dialog>
  );
});

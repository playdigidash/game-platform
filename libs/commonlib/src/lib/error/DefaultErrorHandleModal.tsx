import { observer } from "mobx-react";
import { defaultModalStyle } from '@lidvizion/commonlib';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import DigiDashLogo from './assets/Logos/Digi-Dash.IOLogo.svg';

interface IDefaultErrorHandleModal {
    showSpinner?:boolean
    content:ReactNode
}

export const DefaultErrorHandleModal:React.FC<IDefaultErrorHandleModal> = observer(({
    showSpinner = false,
    content
})=>{
    return (
        <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <LoadingOverlay
          active={true}
          spinner={showSpinner}
          text={
            content
          }
        >
          <Box
            component="div"
            className="instruction-modal-wrapper"
            sx={{
              ...defaultModalStyle,
              width: '100vw',
              alignItems: 'center',
              height: '100vh',
            }}
          />
        </LoadingOverlay>
      </Modal>
    )   
})
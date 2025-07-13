import * as React from 'react';
import { Avatar, useTheme } from '@mui/material';

interface IRecycleAvatar {
    imgPath: string
}

export const RecycleAvatar = ({imgPath}:IRecycleAvatar) =>{
  const theme = useTheme()
  return (
    <Avatar 
      sx={{
        height:60, 
        width:60
      }} 
      src={imgPath}
    />
  )
}
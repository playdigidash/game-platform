import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import { HistoryModel } from './stores/AwardViewStore';
import { useStore } from './stores/Store';
import Moment from 'react-moment';

export const History: React.FC = observer(() => {
  // const {
  //     history
  // } = useStore().awardsViewStore
  const theme = useTheme();

  return (
    // <Box component="div"
    //     flexDirection={'column'}
    //     display={'flex'}
    //     gap={5}
    // >
    //     {   history.length > 0
    //         && history.map((h:IHistoryModel)=>{
    //             return (
    //                 <Card
    //                     sx={{
    //                         background: theme.palette.background.paper
    //                     }}
    //                 >
    //                     {/* <CardContent
    //                         sx={{
    //                             display: 'flex',
    //                             justifyContent: 'space-between'
    //                         }}
    //                     >
    //                         <Box component="div" >
    //                             <Typography
    //                                 variant='h6'
    //                                 color={theme.palette.text.primary}
    //                             >
    //                                 {h.title}
    //                             </Typography>
    //                             <Typography  color={theme.palette.text.disabled}>
    //                                 <Moment format="YYYY/MM/DD">
    //                                     {h.date?.toDateString()}
    //                                 </Moment>
    //                             </Typography>
    //                         </Box>
    //                         <Box component="div"
    //                             display={'flex'}
    //                             alignItems={'center'}
    //                         >
    //                             <Typography  color={theme.palette.text.primary}>{`+${h.points}`}</Typography>
    //                         </Box>
    //                     </CardContent> */}
    //                 </Card>
    //             )
    //         })
    //     }
    //     {
    //         history.length < 1
    //         && <Typography>Make Some History!</Typography>
    //     }
    // </Box>
    null
  );
});

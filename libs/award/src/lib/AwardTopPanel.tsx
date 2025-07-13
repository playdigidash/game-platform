import mainbadgeicon from './assets/mainbadgeicon.svg';
import mainpointsicon from './assets/mainpointsicon.svg';
import maindataicon from './assets/maindataicon.svg';

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Typography,
  useTheme,
} from '@mui/material';
import { ICurrentUserModel } from '@lidvizion/commonlib';
import { useStore } from './stores/Store';
import { BottomPanels } from './stores/AwardViewStore';
import { observer } from 'mobx-react-lite';
import { AccountTopOverview } from './AccountTopOverview';

interface IAwardTopPanel {
  user: ICurrentUserModel;
}

export const AwardTopPanel: React.FC<IAwardTopPanel> = observer(({ user }) => {
  const theme = useTheme();
  return null;
  // const { currentActiveBottomPanel, setCurrentActiveBottomPanel } =
  //   useStore().awardsViewStore;

  // const getBgColor = (panel: BottomPanels) => {
  //   return currentActiveBottomPanel === panel
  //     ? theme.palette.primary.main
  //     : 'white';
  // };

  // const cardActionAreaStyle = {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   margin: 1,
  // };

  // const textStyle = {
  //   color: 'black',
  // };

  // return (
  //   <Box component="div"
  //     style={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'stretch',
  //       flex: 1,
  //     }}
  //   >
  //     <AccountTopOverview user={user} />
  //     <Box component="div"
  //       display={'flex'}
  //       justifyContent={'space-evenly'}
  //       flex={1}
  //       margin={2}
  //       gap={2}
  //     >
  //       <Card
  //         sx={{ background: getBgColor(BottomPanels.badges) }}
  //         className="badge-with-text-container"
  //       >
  //         <CardActionArea
  //           sx={cardActionAreaStyle}
  //           onClick={setCurrentActiveBottomPanel.bind(
  //             this,
  //             BottomPanels.badges
  //           )}
  //         >
  //           <img height={45} alt={'main badge icon'} src={mainbadgeicon}></img>
  //           <Typography sx={textStyle}>{`badges`}</Typography>
  //         </CardActionArea>
  //       </Card>
  //       <Card
  //         sx={{ background: getBgColor(BottomPanels.points) }}
  //         className={'badge-with-text-container'}
  //       >
  //         <CardActionArea
  //           sx={cardActionAreaStyle}
  //           onClick={setCurrentActiveBottomPanel.bind(
  //             this,
  //             BottomPanels.points
  //           )}
  //         >
  //           <img height={45} alt={'points icon'} src={mainpointsicon}></img>
  //           <Typography sx={textStyle}>{`points`}</Typography>
  //         </CardActionArea>
  //       </Card>
  //       <Card
  //         sx={{ background: getBgColor(BottomPanels.stats) }}
  //         className="badge-with-text-container"
  //       >
  //         <CardActionArea
  //           sx={cardActionAreaStyle}
  //           onClick={setCurrentActiveBottomPanel.bind(this, BottomPanels.stats)}
  //         >
  //           <img height={45} alt={'stats icon'} src={maindataicon}></img>
  //           <Typography sx={textStyle}>{`stats`}</Typography>
  //         </CardActionArea>
  //       </Card>
  //     </Box>
  //   </Box>
  // );
});

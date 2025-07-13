// import { defaultModalStyle } from '@lidvizion/commonlib';
// import { Box, Modal, Typography, useTheme, alpha, Tooltip } from '@mui/material';
// import AddRoadIcon from '@mui/icons-material/AddRoad';
// import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
// import { useGameStore } from '../RootStore/RootStoreProvider';
// import { observer } from 'mobx-react';
// import { LaneType } from '../RootStore/GamePlayViewStore';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import InfoIcon from '@mui/icons-material/Info';
// import { MouseEvent } from 'react';
// import { action } from 'mobx';

// export const LaneSelectModal: React.FC = observer(() => {
//   const theme = useTheme();
//   const { setLaneSelection, isMobile, showLaneSelectionMessage } =
//     useGameStore().gamePlayViewStore;

//   const handleLaneSelection = (lane: laneType) => {
//     showLaneSelectionMessage();
//     setLaneSelection(lane);
//   };

//   return (
//     <Modal
//       open={true}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//       BackdropProps={{
//         style: {
//           backgroundColor: 'rgba(0, 0, 0, .5)',
//           backdropFilter: 'blur(0.125rem) contrast(.9)',
//         },
//       }}
//     >
//       <Box
//         component="div"
//         sx={{
//           ...defaultModalStyle,
//           // CHANGED FROM '2rem' TO '1rem'
//           padding: '1rem',
//           width: '90vw',
//           height: 'auto',
//           // minHeight: '70vh',
//           maxHeight: '90vh',
//           margin: 'auto',
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           // CHANGED FROM '1rem' TO '0.75rem'
//           borderRadius: '0.75rem',
//           backdropFilter: 'blur(0.625rem)',
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           overflow: 'auto',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           // CHANGED FROM '2rem' TO '1rem'
//           gap: '1rem',
//         }}
//       >
//         <Typography
//           // CHANGED FROM 'h3' TO 'h4'
//           variant="h4"
//           sx={{
//             color: 'white',
//             textAlign: 'center',
//             // CHANGED FONT SIZE FROM '2rem' TO '1.5rem'
//             fontSize: '1.5rem',
//           }}
//         >
//           Pick Your Style
//         </Typography>

//         <Box
//           component="div"
//           sx={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             justifyContent: 'center',
//             alignItems: 'stretch',
//             flex: 1,
//             width: '100%',
//             // CHANGED FROM '2rem' TO '1rem'
//             gap: '1rem',
//           }}
//         >
//           {/* Three Lane Option */}
//           <Box
//             component="div"
//             sx={(theme) => ({
//               flex: '1 1 20rem',
//               minWidth: '2rem',
//               maxWidth: '28rem',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//               position: 'relative',
//               '&:hover': {
//                 transform: 'scale(1.02)',
//                 '& .option-container': {
//                   borderColor: alpha(theme.palette.primary.main, 0.85),
//                   backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                 },
//               },
//             })}
//           >
//             <Box
//               className="option-container"
//               component="div"
//               onClick={() => handleLaneSelection('Three Lane')}
//               sx={{
//                 // CHANGED FROM '2rem' TO '1rem'
//                 padding: '.5rem',
//                 border: `0.125rem solid ${theme.palette.primary.main}`,
//                 borderRadius: '0.75rem',
//                 transition: 'all 0.3s ease',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 // CHANGED FROM '1rem' TO '0.5rem'
//                 gap: '0.5rem',
//                 height: '100%',
//               }}
//             >
//               {/* 1) BIG ICON & DOT ON SAME ROW */}
//               <Box
//                 component="div"
//                 sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
//             >
//               <AddRoadIcon
//                 sx={{
//                   fontSize: '6rem',
//                   color: theme.palette.primary.main,
//                 }}
//               />
//                 <FiberManualRecordIcon
//                   sx={{ color: '#4CAF50', fontSize: '1rem' }}
//                 />
//               </Box>

//               {/* 2) TEXT & TOOLTIP NEXT TO EACH OTHER */}
//               <Box
//                 component="div"
//                 sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
//               >
//                 <Typography variant="h5" sx={{ color: 'white' }}>
//                   Three Lane (Easy)
//                 </Typography>
//                 <Box
//                   component="div"
//                   onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
//                   sx={{
//                     padding: '0.25rem',
//                     // marginLeft: '0.1rem',
//                     cursor: 'help',
//                   }}
//                 >
//                   <Tooltip
//                     title="Simple left/right movement between three fixed lanes"
//                     placement="top"
//                     arrow
//                     enterTouchDelay={0}
//                     leaveTouchDelay={3000}
//                   >
//                     <InfoIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.5rem' }} />
//                   </Tooltip>
//                 </Box>
//               </Box>
//             </Box>
//           </Box>

//           {/* Free Movement Option */}
//           <Box
//             component="div"
//             sx={(theme) => ({
//               flex: '1 1 20rem',
//               minWidth: '2rem',
//               maxWidth: '28rem',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//               position: 'relative',
//               '&:hover': {
//                 transform: 'scale(1.02)',
//                 '& .option-container': {
//                   borderColor: alpha(theme.palette.primary.main, 0.85),
//                   backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                 },
//               },
//             })}
//           >
//             <Box
//               className="option-container"
//               component="div"
//               onClick={() => handleLaneSelection('Free movement')}
//               sx={{
//                 padding: '1rem',
//                 border: `0.125rem solid ${theme.palette.primary.main}`,
//                 borderRadius: '0.75rem',
//                 transition: 'all 0.3s ease',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 // CHANGED FROM '1rem' TO '0.5rem'
//                 gap: '0.5rem',
//                 height: '100%',
//               }}
//             >
//               {/* 1) BIG ICON & DOT ON SAME ROW */}
//               <Box
//                 component="div"
//                 sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
//             >
//               <AllInclusiveIcon
//                 sx={{
//                   fontSize: '6rem',
//                   color: theme.palette.primary.main,
//                 }}
//               />
//                 <FiberManualRecordIcon sx={{ color: '#f44336', fontSize: '1rem' }} />
//               </Box>

//               {/* 2) TEXT & TOOLTIP NEXT TO EACH OTHER */}
//               <Box
//                 component="div"
//                 sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
//               >
//                 <Typography variant="h5" sx={{ color: 'white' }}>
//                   Free Movement (Hard)
//                 </Typography>
//                 <Box
//                   component="div"
//                   onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
//                   sx={{
//                     padding: '0.25rem',
//                     // marginLeft: '0.1rem',
//                     cursor: 'help',
//                   }}
//                 >
//                   <Tooltip
//                     title="Full control with unrestricted movement across the track"
//                     placement="top"
//                     arrow
//                     enterTouchDelay={0}
//                     leaveTouchDelay={3000}
//                   >
//                     <InfoIcon
//                       sx={{
//                         color: 'rgba(255, 255, 255, 0.5)',
//                         fontSize: '1.5rem',
//                       }}
//                     />
//                   </Tooltip>
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// });

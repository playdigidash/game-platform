// import {
//   Box,
//   Card,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Tab,
//   Tabs,
//   Tooltip,
//   Typography,
//   useTheme,
// } from '@mui/material';
// import { observer } from 'mobx-react';
// import { CurrentTimeTab } from './stores/AwardViewStore';
// import { useStore } from './stores/Store';
// import { TimeTabs } from './TimeTabs';
// import { PieChart } from 'react-minimal-pie-chart';

// import { LabelRenderProps } from 'react-minimal-pie-chart/types/Label';
// import { Legend } from './Legend';
// import { ICurrentUserModel } from '@lidvizion/commonlib';
// import { useEffect, useState } from 'react';
// interface IStatistics {
//   user: ICurrentUserModel;
// }

// enum MaterialScanColor {
//   cardboard = '#6046FC',
//   metal = '#6AE473',
//   paper = '#F7516F',
//   plastic = '#FF8324',
//   biohazardMedWaste = 'pink',
//   electronic = 'yellow',
// }

// enum MaterialResColor {
//   Recycle = '#F4ED2F',
//   Trash = 'white',
//   Dropoff = '#40D3CB',
// }

// export const Statistics: React.FC<IStatistics> = observer(({ user }) => {
//   const theme = useTheme();
//   const [materialScanned, setMaterialScanned] = useState([]);
//   const [materialResonses, setMaterialResponses] = useState([]);

//   const cardStyle = {
//     display: 'flex',
//     gap: 3,
//     minWidth: 600,
//     minHeight: 260,
//   };

//   const getMaterialScanned = () => {
//     const matsScanned: any[] = [];
//     if (user && user.stats && user.stats.scannedMaterials) {
//       for (const mat in user.stats.scannedMaterials) {
//         matsScanned.push({
//           title: mat,
//           //@ts-ignore
//           color: MaterialScanColor[mat] || 'white',
//           //@ts-ignore
//           value: user.stats.scannedMaterials[mat]?.count || 0,
//         });
//       }

//       setMaterialScanned(matsScanned);
//     }
//   };

//   const getMaterialResponses = () => {
//     let trashRollup = 0;
//     let recycleRollup = 0;
//     let dropoffRollup = 0;

//     if (user && user.stats && user.stats.scannedMaterials) {
//       for (const mat in user.stats.scannedMaterials) {
//         //@ts-ignore
//         const resType = user.stats.scannedMaterials[mat]?.responseType;

//         if (resType && resType.trash && resType.trash.count) {
//           trashRollup += resType.trash.count;
//         }

//         if (resType && resType.recycle && resType.recycle.count) {
//           recycleRollup += resType.recycle.count;
//         }

//         if (resType && resType.dropoff && resType.dropoff.count) {
//           dropoffRollup += resType.dropoff.count;
//         }
//       }

//       setMaterialResponses([
//         {
//           title: 'Recycle',
//           color: MaterialResColor.Recycle,
//           value: recycleRollup,
//         },
//         {
//           title: 'Trash',
//           color: MaterialResColor.Trash,
//           value: trashRollup,
//         },
//         {
//           title: 'Drop-Off',
//           color: MaterialResColor.Dropoff,
//           value: dropoffRollup,
//         },
//       ]);
//     }
//   };

//   useEffect(() => {
//     getMaterialResponses();
//     getMaterialScanned();
//   }, []);

//   return (
//     <Box component="div"
//       display={'flex'}
//       flexDirection={'column'}
//       alignItems={'center'}
//       alignSelf={'stretch'}
//       marginBottom={10}
//       gap={3}
//     >
//       <Typography variant="h5">Statistics</Typography>
//       <TimeTabs />
//       <Card sx={cardStyle}>
//         <Box component="div"
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             margin: 2,
//             gap: 4,
//             alignItems: 'center',
//           }}
//         >
//           <Typography variant="h5">Materials Scanned</Typography>
//           {materialScanned.length < 1 ? (
//             <Typography sx={{ color: theme.palette.text.disabled }}>
//               No Scans
//             </Typography>
//           ) : (
//             <PieChart data={materialScanned} lineWidth={50} />
//           )}
//         </Box>
//         <Legend
//           opts={[
//             { text: 'Cardboard', color: MaterialScanColor.cardboard },
//             { text: 'Metal', color: MaterialScanColor.metal },
//             { text: 'Paper', color: MaterialScanColor.paper },
//             { text: 'Plastic', color: MaterialScanColor.plastic },
//             {
//               text: 'Biohazard/Med Waste',
//               color: MaterialScanColor.biohazardMedWaste,
//             },
//             { text: 'Electronic', color: MaterialScanColor.electronic },
//           ]}
//         />
//       </Card>
//       <Card sx={cardStyle}>
//         <Box component="div"
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             margin: 2,
//             gap: 4,
//             alignItems: 'center',
//           }}
//         >
//           <Typography variant="h5">Material Responses</Typography>
//           {materialResonses.length < 1 ? (
//             <Typography sx={{ color: theme.palette.text.disabled }}>
//               No Responses
//             </Typography>
//           ) : (
//             <PieChart data={materialResonses} lineWidth={50} />
//           )}
//         </Box>
//         <Legend
//           opts={[
//             { text: 'Recycle', color: MaterialResColor.Recycle },
//             { text: 'Trash', color: MaterialResColor.Trash },
//             { text: 'Drop-off', color: MaterialResColor.Dropoff },
//           ]}
//         />
//       </Card>
//     </Box>
//   );
// });

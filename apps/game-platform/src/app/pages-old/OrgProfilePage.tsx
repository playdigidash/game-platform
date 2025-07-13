// import {
//   Avatar,
//   Box,
//   Button,
//   Collapse,
//   Grid,
//   IconButton,
//   Link,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   TextField,
//   Tooltip,
//   Typography,
//   useTheme,
// } from '@mui/material';
// import DDLogo from '../../../../../libs/commonlib/src/lib/commonmodels/assets/digidashlogos/Digi-Dash.IOLogo.svg';
// import Verified from '../../assets/thumbnails/verified.png';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ALL_ORGS_DATA from './_orgsDummyData.json';
// import ALL_GAMES_DATA from './_gamesDummyData.json';
// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { Game, Organization } from './constants';
// import {getOrgById} from '@lidvizion/commonlib';
// import { useMongoDB } from '@lidvizion/commonlib';

// export default function OrgProfilePage() {
//   const {org} = useParams();
//     const [gamesData, setGames] = useState<Game[]>([]);
//     const [orgData, setOrgData] = useState<IOrganizationModel>();
//   const {db} = useMongoDB()

//   useEffect(() => {
//     if (!orgData) return;
//     const fetchGames = async (id: string) => {
//       try {
//         const data: Game[] = ALL_GAMES_DATA;
//         setGames(data);
//       } catch (error) {
//         console.error('Error fetching game data:', error);
//       }
//     };

//     fetchGames(orgData.id);
//   }, [orgData]);

//   // useEffect(() => {
//   //   const fetchOrganization = async () => {
//   //     try {
//   //       const data: Organization[] = ALL_ORGS_DATA;
//   //       const matchingOrg = data.find((orgD) => orgD.id === org);
//   //       if (matchingOrg) {
//   //         setOrgData(matchingOrg);
//   //       } else {
//   //         console.error('Organization not found');
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching organization data:', error);
//   //     }
//   //   };
//   //
//   //   fetchOrganization();
//   // }, [org]);

//   useEffect(() => {
//     const fetchOrganization = async () => {
//       if(org) {
//         try {
//           const data = await getOrgById(db, org)
//           console.log(data);
//           setOrgData(data)
//         } catch (err){
//           console.error('Error fetching organization data', err);
//         }
//       } else console.error('Invalid org id')
//     }

//     fetchOrganization();
//   }, [org]);

//   return (
//     <>
//       <Navbar />
//       <Box
//         component="div"
//         sx={{
//           backgroundColor: '#fff',
//           minHeight: '100vh',
//           color: '#000',
//         }}
//       >
//         {orgData && (
//           <>
//             <Header
//               username={orgData.email || ''}
//               displayName={orgData.displayName}
//               profileImage={orgData.assets?.mainPic || ''}
//               bannerImage={orgData.assets?.banner || ''}
//               gameCount={orgData.gameIds?.length || 0}
//               playCount={120372}
//             />
//             <Box
//               component="div"
//               sx={{
//                 px: '5vw',
//               }}
//             >
//               <Featured
//                 games={gamesData
//                   .filter((item) => item.featured === true)
//                   .slice(0, 3)}
//               />
//               <AboutSection
//                 title={'About Us'}
//                 description={orgData.about}
//                 links={orgData.links}
//               />
//               <ResourceSection
//                 categories={[
//                   'Brainstorming',
//                   'Legal',
//                   'Funding',
//                   'Startup',
//                   'UM Resources',
//                 ]}
//                 games={gamesData}
//               />
//             </Box>
//             <Box component="div" sx={{ pb: '8rem' }} />
//           </>
//         )}
//       </Box>
//     </>
//   );
// }

// type HeaderProps = {
//   bannerImage: string;
//   profileImage: string;
//   displayName: string;
//   username: string;
//   gameCount: number;
//   playCount: number;
// };

// const Header = ({
//   bannerImage,
//   displayName,
//   profileImage,
//   username,
//   gameCount,
//   playCount,
// }: HeaderProps) => {
//   const theme = useTheme();

//   return (
//     <Box component="div" sx={{ position: 'relative', width: '100%' }}>
//       {/* Banner Image */}
//       <Box
//         component="div"
//         sx={{
//           backgroundImage: `url(${bannerImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '250px',
//           width: '100%',
//           position: 'relative',
//         }}
//       >
//         {/* Profile Picture */}
//         <Avatar
//           src={profileImage}
//           variant="rounded"
//           alt="Profile Picture"
//           sx={{
//             position: 'absolute',
//             bottom: '-2rem',
//             left: '5vw',
//             backgroundColor: '#fff',
//             width: '8rem',
//             height: '8rem',
//             boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
//             border: '2px solid white',
//             [theme.breakpoints.down('md')]: {
//               left: '50%',
//               transform: 'translateX(-50%)',
//             },
//           }}
//         />
//       </Box>

//       {/* Content Section */}
//       <Box
//         component="div"
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           mt: '2.5rem',
//           [theme.breakpoints.down('md')]: {
//             flexDirection: 'column',
//           },
//         }}
//       >
//         <Box
//           component="div"
//           sx={{
//             pl: '5vw',
//           }}
//         >
//           <Box
//             component="div"
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '1rem',
//             }}
//           >
//             <Typography variant="h3">{displayName}</Typography>
//             <img
//               style={{ width: '2rem', height: '2rem' }}
//               src={Verified}
//               alt=""
//             />
//           </Box>
//           <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//             {username}
//           </Typography>

//           {/* Follow Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             size="large"
//             sx={{
//               padding: '0.75rem 2rem',
//               borderRadius: '1rem',
//               mt: '1rem',
//               textTransform: 'none',
//               fontWeight: '600',
//               boxShadow: 2,
//               '&:hover': {
//                 backgroundColor: 'primary.dark',
//               },
//             }}
//           >
//             Follow
//           </Button>
//         </Box>

//         <Box
//           component="div"
//           sx={{
//             display: 'flex',
//             flexDirection: { md: 'row' }, // Stack vertically on mobile, horizontally on desktop
//             alignItems: 'flex-start',
//             justifyContent: 'center',
//             px: '5vw',
//             mr: '5vw',
//             gap: '2rem',
//             textAlign: 'center',
//             borderRadius: '1rem',
//             padding: '1rem',
//           }}
//         >
//           {/* Dashes Section */}
//           <Box
//             component="div"
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: '0.5rem',
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 'bold', color: 'primary.main' }}
//             >
//               Dashes
//             </Typography>
//             <Typography fontWeight="600" variant="h5">
//               {gameCount}
//             </Typography>
//           </Box>

//           {/* Plays Section */}
//           <Box
//             component="div"
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: '0.5rem',
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 'bold', color: 'primary.main' }}
//             >
//               Plays
//             </Typography>
//             <Typography fontWeight="600" variant="h5">
//               {playCount}
//             </Typography>
//           </Box>

//           {/* Followers Section */}
//           <Box
//             component="div"
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: '0.5rem',
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 'bold', color: 'primary.main' }}
//             >
//               Followers
//             </Typography>
//             <Typography fontWeight="600" variant="h5">
//               {Math.floor(playCount * 0.27)}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// const Navbar = () => {
//   return (
//     <Box
//       component="div"
//       sx={{
//         backgroundColor: '#F3F8FF',
//         color: '#1A1A19',
//         p: '0.5rem',
//       }}
//     >
//       <Box
//         component="div"
//         sx={{ display: 'flex', alignItems: 'center', gap: '1rem', px: '1rem' }}
//       >
//         <img src={DDLogo} alt="" style={{ width: '3rem' }} />
//         <Typography fontWeight="700" fontSize="1.5rem">
//           Digi Dash
//         </Typography>
//       </Box>
//     </Box>
//   );
// };
// interface AboutProps {
//   title: string;
//   description: string[];
//   links: { title: string; url: string }[];
// }

// const AboutSection = ({ title, description, links }: AboutProps) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const theme = useTheme();

//   const toggleExpanded = () => setIsExpanded(!isExpanded);

//   return (
//     <Box
//       component="div"
//       sx={{
//         mt: '4rem',
//         borderRadius: '1rem',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 2,
//       }}
//     >
//       {/* Header with Expandable Icon (Mobile) */}
//       <Box
//         component="div"
//         sx={{
//           display: { xs: 'flex', md: 'none' },
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           cursor: 'pointer',
//         }}
//         onClick={toggleExpanded}
//       >
//         <Typography
//           variant="h5"
//           sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}
//         >
//           {title}
//         </Typography>
//         <IconButton size="small">
//           <ExpandMoreIcon
//             sx={{
//               transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
//               transition: 'transform 0.3s',
//               color: theme.palette.primary.dark,
//             }}
//           />
//         </IconButton>
//       </Box>

//       {/* Main Content */}
//       <Collapse
//         sx={{ width: '100%' }}
//         in={isExpanded || window.innerWidth >= 768}
//         timeout="auto"
//         unmountOnExit
//       >
//         <Box
//           component="div"
//           sx={{
//             display: 'flex',
//             flexDirection: { xs: 'column', md: 'row' },
//             gap: 4,
//           }}
//         >
//           {/* Left Side: Title and Description */}
//           <Box component="div" sx={{ flex: 1 }}>
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: 'bold',
//                 mb: 2,
//                 color: theme.palette.primary.dark,
//                 display: { xs: 'none', md: 'block' },
//               }}
//             >
//               {title}
//             </Typography>
//             {description && description.map((desc, index) => (
//               <Typography
//                 key={index}
//                 variant="body2"
//                 sx={{
//                   mb: 1,
//                 }}
//               >
//                 {desc}
//               </Typography>
//             ))}
//           </Box>

//           {/* Right Side: Links */}
//           <Box
//             component="div"
//             sx={{
//               flex: 1,
//               maxWidth: { md: '300px' },
//               p: 2,
//               borderRadius: '0.5rem',
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 mb: 2,
//                 color: theme.palette.primary.dark,
//                 borderBottom: `2px solid ${theme.palette.primary.dark}`,
//                 pb: 1,
//               }}
//             >
//               Links
//             </Typography>
//             <List>
//               {links?.map((link, index) => (
//                 <ListItem key={index} disablePadding>
//                   <Tooltip
//                     title={link.url}
//                     arrow
//                     placement="top"
//                     componentsProps={{
//                       tooltip: {
//                         sx: {
//                           fontSize: '0.875rem',
//                           backgroundColor: theme.palette.grey[700],
//                         },
//                       },
//                     }}
//                   >
//                     <Link
//                       href={link?.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       underline="hover"
//                       sx={{
//                         color: theme.palette.primary.dark,
//                         fontWeight: 500,
//                       }}
//                     >
//                       <ListItemText
//                         primary={link?.title}
//                         color={theme.palette.primary.main}
//                       />
//                     </Link>
//                   </Tooltip>
//                 </ListItem>
//               ))}
//             </List>
//           </Box>
//         </Box>
//       </Collapse>
//     </Box>
//   );
// };

// const Featured = ({ games }: { games: Game[] }) => {
//   const theme = useTheme();
//   return (
//     <Box
//       component="div"
//       sx={{
//         display: 'flex',
//         mt: '2rem',
//         backgroundColor: theme.palette.primary.dark,
//         boxShadow: theme.shadows[1],
//         p: '2rem',
//         color: theme.palette.common.white,
//         borderRadius: '1rem',
//         flexDirection: { xs: 'column', md: 'row' },
//         gap: { xs: 2, md: 4 },
//         alignItems: 'center',
//       }}
//     >
//       <Box
//         component="div"
//         sx={{
//           flex: { md: '1 1 40%' },
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
//           Featured Games
//         </Typography>
//         <Typography variant="body1">
//           Discover some of the most exciting dashes we have to offer. From law
//           to business, explore them all here.
//         </Typography>
//       </Box>

//       {/* Featured Game Tiles */}
//       <Grid
//         container
//         spacing={2}
//         sx={{
//           flex: { md: '1 1 70%' },
//         }}
//       >
//         {games?.map((game, index) => (
//           <Grid item xs={6} md={4} key={index}>
//             <GameTile
//               title={game?.title || ''}
//               description={game?.description || ''}
//               questionsCount={game?.numOfQuestions || 0}
//               bgColor={game?.color || ''}
//               imageUrl={game?.imgUrl || ''}
//               playUrl={game?.playUrl || ''}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// interface GameTileProps {
//   title: string;
//   description: string;
//   questionsCount: number;
//   imageUrl: string;
//   playUrl: string;
//   creator?: string;
//   bgColor?: string;
// }

// const GameTile = ({
//   title,
//   description,
//   questionsCount,
//   imageUrl,
//   playUrl,
//   creator,
//   bgColor = 'primary.main',
// }: GameTileProps) => {
//   const { org } = useParams();

//   const handlePlayClick = () => {
//     window.open(playUrl, '_blank');
//   };

//   return (
//     <Box
//       component="div"
//       sx={{
//         bgcolor: bgColor,
//         borderRadius: '1rem',
//         maxHeight: '20rem',
//         color: '#fff',
//         boxShadow: 2,
//         transition: 'transform 0.3s ease-in-out',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         position: 'relative',
//         '&:hover': {
//           transform: 'scale(1.05)',
//         },
//         cursor: 'pointer',
//       }}
//       onClick={handlePlayClick}
//     >
//       {/* Play Now Overlay (Visible on Hover) */}
//       <Box
//         component="div"
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 99,
//           bgcolor: 'rgba(128, 0, 128, 0.6)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           opacity: 0,
//           transform: 'scale(0.8)',
//           transition: 'opacity 0.3s ease, transform 0.3s ease',
//           borderRadius: '0.5rem',
//           '&:hover': {
//             opacity: 1,
//             transform: 'scale(1)',
//           },
//         }}
//       >
//         <Box component="div" sx={{ textAlign: 'center' }}>
//           <Typography
//             variant="h6"
//             sx={{
//               color: '#fff',
//               fontWeight: 'bold',
//               textTransform: 'uppercase',
//               mb: 1,
//             }}
//           >
//             Play Now
//           </Typography>
//         </Box>
//       </Box>
//       {/* Image Section */}
//       <Box component="div" sx={{ position: 'relative', height: '10rem' }}>
//         <img
//           style={{
//             width: '100%',
//             height: '10rem',
//             objectFit: 'cover',
//             borderRadius: '0.5rem',
//           }}
//           src={imageUrl}
//           alt={title}
//         />

//         <Box
//           component="div"
//           sx={{
//             position: 'absolute',
//             bottom: '0.5rem',
//             right: '0.5rem',
//             backgroundColor: '#000',
//             borderRadius: '0.3rem',
//             px: '0.3rem',
//             fontSize: '0.65rem',
//             opacity: 0.8,
//           }}
//         >
//           {questionsCount} Questions
//         </Box>
//       </Box>

//       {/* Content Section */}
//       <Box component="div" sx={{ px: '0.5rem', pt: '0.3rem', flexGrow: 1 }}>
//         <Typography
//           variant="h6"
//           sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 1 }}
//         >
//           {title}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{
//             opacity: 0.8,
//             fontSize: '0.8rem',
//             mb: 2,
//             display: '-webkit-box',
//             WebkitBoxOrient: 'vertical',
//             overflow: 'hidden',
//             WebkitLineClamp: 2,
//             textOverflow: 'ellipsis',
//           }}
//         >
//           {description}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{ opacity: 0.6, fontSize: '0.7rem', mb: 2 }}
//         >
//           @{creator ? creator : org}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// interface ResourceSectionProps {
//   categories: string[];
//   games: Game[];
// }

// const ResourceSection: React.FC<ResourceSectionProps> = ({
//   categories,
//   games,
// }) => {
//   const [selectedCategory, setSelectedCategory] = useState<string>(
//     categories[0]
//   );
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const theme = useTheme();

//   const filteredGames = games.filter(
//     (game) =>
//       game.category === selectedCategory &&
//       game.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box
//       component="div"
//       sx={{
//         display: 'flex',
//         flexDirection: { xs: 'column', md: 'row' },
//         gap: 4,
//         mt: '4rem',
//       }}
//     >
//       {/* Sidebar */}
//       <Box
//         component="div"
//         sx={{
//           width: { xs: '100%', md: '20%' },
//           borderRight: { md: '1px solid rgba(0, 0, 0, 0.1)' },
//           pr: { md: 2 },
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           More Resources
//         </Typography>
//         <List>
//           {categories.map((category) => (
//             <ListItemButton
//               key={category}
//               selected={category === selectedCategory}
//               onClick={() => setSelectedCategory(category)}
//               sx={{
//                 mb: 1,
//                 borderRadius: '0.5rem',
//               }}
//             >
//               {category}
//             </ListItemButton>
//           ))}
//         </List>
//       </Box>

//       {/* Main Content */}
//       <Box component="div" sx={{ flex: 1 }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Search Here..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           sx={{
//             mb: 3,
//             input: {
//               color: theme.palette.common.black,
//               backgroundColor: '#ffffff',
//             },
//             '& .MuiInputBase-input::placeholder': {
//               color: 'text.secondary',
//               opacity: 1,
//             },
//             '& .MuiOutlinedInput-root': {
//               backgroundColor: theme.palette.common.white,
//               '& fieldset': {
//                 borderColor: 'primary.main',
//               },
//               '&:hover fieldset': {
//                 borderColor: 'primary.dark',
//               },
//               '&.Mui-focused fieldset': {
//                 borderColor: 'secondary.main',
//               },
//             },
//           }}
//         />

//         <Grid container spacing={2}>
//           {filteredGames.map((game) => (
//             <Grid item xs={6} md={3} key={game.id}>
//               <GameTile
//                 title={game.title}
//                 description={game.description}
//                 questionsCount={game.numOfQuestions}
//                 imageUrl={game.imgUrl}
//                 bgColor={game.color}
//                 playUrl={game.playUrl}
//               />
//             </Grid>
//           ))}
//         </Grid>

//         {/* No Results */}
//         {filteredGames.length === 0 && (
//           <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
//             No dashes found for this resource.
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

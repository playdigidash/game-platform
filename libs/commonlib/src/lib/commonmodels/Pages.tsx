import { FaGlobe, FaInstagram, FaFacebook, FaYoutube, FaTiktok,
     FaLink } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    DeleteOutline,
    AddCircleOutline,
    Language as LanguageIcon,
    LinkedIn as LinkedInIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
    X as XIcon,
    Edit as EditIcon,
    Link as LinkIcon,
  } from '@mui/icons-material';
  import YouTubeIcon from '@mui/icons-material/YouTube';


export const getSocialIcon = (type: string) => {
    switch (type) {
      case 'instagram': return <InstagramIcon />;
      case 'facebook': return <FacebookIcon />;
      case 'linkedin': return <LinkedInIcon />;
      case 'youtube': return <YouTubeIcon />;
      case 'tiktok': return SiTiktok({ style: { fontSize: 24 } });
      case 'x': return <XIcon />; // Modern X icon
      case 'website': return FaGlobe({ style: { fontSize: 24 } });
      default: return <LinkIcon />;
    }
  };

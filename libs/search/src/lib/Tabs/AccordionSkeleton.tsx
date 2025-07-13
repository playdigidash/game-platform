import { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react';

import {
  IImgType,
  getDbImage,
  IMaterialType,
  ICurrentMaterial,
  IStreamTypeItems,
  getCustomerTypeImg,
  getCustomerItemImage,
} from '@lidvizion/commonlib';

import { RecycleAvatar } from '../view/RecycleAvatar';
import { CustomDivider } from '../view/CustomDivider';
import { useSearchStore } from '../RootStore/RootStoreProvider';
import defaultItemIcon from '../assets/login-logo.png';

interface IAccordionSkeleton {
  recyclableTypes?: IMaterialType[];
  recyclables?: any[];
  onChildClickHandler: (item: any) => void;
  tabName: string;
}

interface ITypeAccordionProps {
  typeName: string;
  typeId: string;
  cusTypeImgId: string;
  expanded: boolean;
  onChange: (panel: string) => void;
  children?: React.ReactNode;
}

interface IAccordionItemProps {
  item: any;
  onChildClickHandler: (item: any) => void;
}

export const AccordionSkeleton: React.FC<IAccordionSkeleton> = observer(
  ({ recyclableTypes, onChildClickHandler }) => {
    const [expandedType, setExpandedType] = useState<string | false>('');
    const [itemsToShow, setItemsToShow] = useState(10);

    const handleChange = (typeName: string) => {
      setExpandedType(typeName === expandedType ? '' : typeName);
    };
    const loadMoreItems = () => {
      setItemsToShow(itemsToShow + 10);
    };

    return (
      <Box component="div">
        {recyclableTypes?.map((type: any) => {
          const typeName = type.typeCusName || '';
          const cusTypeImgId = type.typeCusSvgId;

          return (
            <TypeAccordion
              key={type.cusTypeId}
              typeId={type.cusTypeId}
              typeName={typeName}
              cusTypeImgId={cusTypeImgId}
              expanded={expandedType === typeName}
              onChange={handleChange}
            >
              {type?.mappedItems?.slice(0, itemsToShow)?.map((item: any) => {
                return (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    onChildClickHandler={onChildClickHandler}
                  />
                );
              })}
              {type?.mappedItems?.length > itemsToShow && (
                <button
                  style={{
                    padding: '1em',
                    borderRadius: 25,
                    backgroundColor: 'white',
                  }}
                  onClick={loadMoreItems}
                >
                  Load more
                </button>
              )}
            </TypeAccordion>
          );
        })}
      </Box>
    );
  }
);

function TypeAccordion({
  typeName,
  cusTypeImgId,
  typeId,
  expanded,
  onChange,
  children,
}: ITypeAccordionProps) {
  const theme = useTheme();
  const [typeB64, setTypeB64] = useState(defaultItemIcon);

  useEffect(() => {
    if (cusTypeImgId && typeId) {
      const getTypeB64 = async () => {
        const b64 = await getCustomerTypeImg(cusTypeImgId, typeId);
        setTypeB64(b64);
      };

      getTypeB64();
    }
  }, [cusTypeImgId, getCustomerTypeImg, typeId]);
  return (
    <Accordion
      expanded={expanded}
      onChange={() => onChange(typeName)}
      style={{
        marginBottom: expanded ? 70 : 10,
        background: theme.palette.background.paper,
      }}
      sx={{
        '&:hover .MuiAccordionSummary-expandIconWrapper': {
          outline: `4px solid ${theme.palette.primary.main}`,
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
          transition: 'none',
          borderRadius: '999px',
          '&.Mui-expanded': {
            transform: 'none',
            outline: `4px solid ${theme.palette.primary.main}`,
          },
        },
      }}
    >
      <AccordionSummary
        style={{
          minHeight: '100px',
        }}
        expandIcon={<RecycleAvatar imgPath={typeB64} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box
          component="div"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexGrow: 'inherit',
            flexWrap: 'wrap',
          }}
        >
          <Card
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              marginRight: 15,
              minWidth: '250px',
              alignItems: 'center',
              marginBottom: 7,
              background: theme.palette.primary.main,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.background.default,
                }}
              >
                {typeName}
              </Typography>
            </CardContent>
          </Card>
          <Box
            component="div"
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          ></Box>
          <Box component="div" style={{ flex: 0.1 }}></Box>
        </Box>
      </AccordionSummary>
      <CustomDivider />
      <AccordionDetails
        style={{
          flex: 1,
          display: 'flex',
          padding: '0px 20px',
          paddingBottom: '20px',
        }}
      >
        <Box
          component="div"
          sx={{
            padding: '5px',
            justifyContent: 'center',
            display: 'flex',
            flex: 1,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

const AccordionItem = ({ item, onChildClickHandler }: IAccordionItemProps) => {
  const theme = useTheme();
  const btnStrikethroughStyle = () => {
    let style = {};

    if (!item.isAccepted) {
      style = {
        background: `linear-gradient(to top left,
          rgba(250,0,0,0) 0%,
          rgba(250,0,0,0) calc(50% - 2px),
          rgba(250,0,0,1) 50%,
          rgba(250,0,0,0) calc(50% + 2px),
          rgba(250,0,0,0) 100%),
          linear-gradient(to top right,
            rgba(250,0,0,0) 0%,
            rgba(250,0,0,0) calc(50% - 2px),
            rgba(250,0,0,1) 50%,
            rgba(250,0,0,0) calc(50% + 2px),
            rgba(250,0,0,0) 100%)
          `,
        border: 3,
        borderColor: 'red',
        backgroundColor: theme.palette.primary.main,
      };
    } else {
      style = {
        background: theme.palette.primary.main,
      };
    }

    return style;
  };

  const [img, setImg] = useState(defaultItemIcon);

  useEffect(() => {
    if (item && getCustomerItemImage) {
      const getImg = async () => {
        const dbImg = await getCustomerItemImage(item);
        setImg(dbImg);
      };

      getImg();
    }
  }, [getCustomerItemImage, item]);
  return (
    <Chip
      sx={{
        height: '2.95rem',
        borderRadius: '999px',
        ...btnStrikethroughStyle(),
      }}
      onClick={() => {
        onChildClickHandler(item);
      }}
      label={
        <Typography
          sx={{
            color: theme.palette.background.default,
            fontSize: '1.25rem',
          }}
          variant="subtitle1"
        >
          {_.truncate(item.item || '')}
        </Typography>
      }
      avatar={
        <Avatar
          alt={'recyclable item'}
          src={img}
          style={{ width: '40px', height: '40px' }}
        />
      }
    />
  );
};

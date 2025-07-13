import { IImgType, LoginType } from './commonmodels/Constants';
import randomcolor from 'randomcolor';
import { SingleSlideModel } from './commonmodels/SingleSliderModel';
import { getDbImage, getOrgSlides } from './mongo/MongoQueries';
import { isArray } from 'lodash';
import defaultIcon from '../lib/commonmodels/assets/login-logo.png';
import { ICurrentMaterial } from './commonmodels/MaterialModel';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import validator from 'validator';
import { Filter } from 'bad-words';
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
  Config,
} from 'unique-names-generator';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';
export interface drawerPosition {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
}

export enum TokenVerifyMsg {
  invalid = 'Invalid Token. Please request a new magic link',
  expired = 'Token Expired. Please request a new magic link',
  generic = `Seems to be an issue verifying. Let's try again...`,
  verifying = 'verifying magic link...',
  sent = 'Magic link sent! Check your email',
  sendError = `Seems to be an issue sending your magic link. Let's try again..`,
  sending = 'Sending magic link...',
  missingGameId = 'Game id missing from url. Enter game id below',
}

export const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

const stripNonAlphanumeric = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9]/g, '');
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
export const removeBadWords = (input: string) => {
  const filter = new Filter();
  let cleanedInput = stripNonAlphanumeric(input);

  filter.list.forEach((badWord) => {
    const escapedBadWord = escapeRegExp(badWord);
    const regex = new RegExp(escapedBadWord, 'gi');
    cleanedInput = cleanedInput.replace(regex, '');
  });

  return cleanedInput;
};

export const getRandomIdx = (arrLen: number) =>
  Math.floor(Math.random() * arrLen);

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const formatPhoneNumber = (input: string): string => {
  // Remove any non-digit characters
  const cleanedInput = input.replace(/\D/g, '');

  // Check if the cleaned input is a valid US phone number
  const usPhoneNumberRegex = /^1?(\d{10})$/;
  const match = cleanedInput.match(usPhoneNumberRegex);

  if (match) {
    // Add the +1 prefix if not already present
    return `+1${match[1]}`;
  }

  // Return the original input if it doesn't match the US phone number format
  return input;
};

export const timer = () => new Promise((resolve) => setTimeout(resolve, 2000));
export const waitForSpecifiedTime = async (
  secs: number,
  countDown?: (time: number) => void
) => {
  let remainingTime = secs;
  const intervalId = setInterval(() => {
    remainingTime -= 1;
    if (countDown) {
      countDown(remainingTime);
    }

    if (remainingTime < 0) {
      clearInterval(intervalId);
    }
  }, 1000);

  await new Promise((resolve) => setTimeout(resolve, secs * 1000));
};

export const getTimeSeconds = (time: number, minuteSeconds: number) =>
  (minuteSeconds - time) | 0;
export const getDeepProperty = (obj: any, propstr: string) => {
  const prop = propstr.split('.');
  for (let i = 0; i < prop.length; i++) {
    if (typeof obj === 'object') obj = obj[prop[i]];
  }

  return obj;
};

export const getProviderType = (type: string) => {
  switch (type) {
    case LoginType.anonymous:
      return LoginType.anonymous;
    case LoginType.email_phone:
      return LoginType.email_phone;
    case LoginType.oauth2_google:
      return LoginType.oauth2_google;
    default:
      return LoginType.anonymous;
  }
};

export const getTruncatedEmail = (email: string) => {
  if (email.length < 3 || email.indexOf('@') < 0) {
    throw new Error('email invalid');
  }

  return `${email[0]}${email[1]}****${email.substring(
    email.length - email.indexOf('@') - 2
  )}`;
};

export const checkIsEmailOrPhone = (str: any) => {
  if (typeof str === 'string') {
    return {
      isEmail: validator.isEmail(str),
      isPhone: validator.isMobilePhone(str),
      checkedVal: str,
    };
  } else {
    return {
      isEmail: false,
      isPhone: false,
      checkedVal: '',
    };
  }
};

export const getRandomRGBA = () => {
  return randomcolor({
    luminosity: 'bright',
    format: 'rgba',
  });
};

export const generateConfetti = (container: HTMLDivElement) => {
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');

    // Random position, rotation, and color
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.transform += `rotate(${Math.random() * 360}deg)`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;

    container.appendChild(confetti);

    // Remove confetti after animation ends
    confetti.addEventListener('animationend', () => {
      container.removeChild(confetti);
    });
  }
};

export const getSlides = async (
  db: Realm.Services.MongoDBDatabase,
  orgId: string,
  handleAfterGetSlides: (slides: any, sliderImages: any) => void
) => {
  const sliderImgCalls: any[] = [];
  const custSlides = await getOrgSlides(db, orgId);

  if (isArray(custSlides)) {
    custSlides.forEach((slide: SingleSlideModel) => {
      if (slide.img) {
        sliderImgCalls.push(
          new Promise((resolve) => {
            if (slide.img) {
              getDbImage(slide.img, IImgType.slider)
                .then((res) => resolve(res))
                .catch(() => resolve(null));
            } else {
              resolve(null);
            }
          })
        );
      }
    });

    let sliderImgs = await Promise.all(sliderImgCalls);
    sliderImgs = sliderImgs.filter((callResult) => {
      return callResult.imgId !== null;
    });

    const slides = custSlides.map((slide: any) => {
      return {
        ...slide,
        date: slide.date ? new Date(slide.date) : null,
      };
    });

    handleAfterGetSlides(slides, sliderImgs);
  }
};

export enum CurrEnvironment {
  Production = 'Production',
  Development = 'Development',
}

const typeCustomSvg: any = {};
const customItemSvg: any = {};

export const getCustomerTypeImg = async (typeSvgId: string, typeId: string) => {
  let b64Svg: string = defaultIcon;
  if (typeId && typeCustomSvg[typeId]) {
    b64Svg = typeCustomSvg[typeId];
  } else if (typeSvgId) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const dfltImg = require(`../lib/commonmodels/assets//defaulttypepngs/${typeSvgId}.png`);
      if (dfltImg) {
        return dfltImg;
      }
    } catch (error) {
      const dbSvg = await getDbImage(typeSvgId, IImgType.icon);

      if (dbSvg?.b64) {
        b64Svg = dbSvg.b64;

        if (typeId) {
          typeCustomSvg[typeId] = dbSvg.b64;
        }
      }
    }
  }

  return b64Svg;
};

export const getCustomerItemImage = async (itm: ICurrentMaterial) => {
  let b64Svg: string | null = null;
  if (itm.id && customItemSvg[itm.id]) {
    b64Svg = customItemSvg[itm.id];
  } else if (itm?.itemSvgId) {
    //check if in defaults first

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const dfltImg = require(`../lib/commonmodels/assets/defaultitempngs/${itm?.itemSvgId}.png`);
      if (dfltImg) {
        return dfltImg;
      }
    } catch (error) {
      //check in aws
      const dbSvg = await getDbImage(itm.itemSvgId, IImgType.icon);

      if (dbSvg?.b64) {
        b64Svg = dbSvg.b64;

        if (itm.id) {
          customItemSvg[itm.id] = dbSvg.b64;
        }

        return b64Svg;
      }

      if (itm.type?.svgId && itm.type?.id) {
        const typeSvg = await getCustomerTypeImg(itm.type.svgId, itm.type.id);

        if (typeSvg) {
          b64Svg = typeSvg;
          return b64Svg;
        }
      }
    }
  } else if (itm.type?.svgId && itm.type?.id) {
    const typeSvg = await getCustomerTypeImg(itm.type.svgId, itm.type.id);

    if (typeSvg) {
      b64Svg = typeSvg;
      return b64Svg;
    }
  }

  return b64Svg;
};

export const blankEditorStr = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;
export const createEditorFromQ = (q: string) => {
  return `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"${q}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
};

export const positionCamera = (
  target: GLTF,
  controls: OrbitControls,
  camera: THREE.PerspectiveCamera
) => {
  const targetObj = new THREE.Vector3(
    target.scene.position.x,
    target.scene.position.y,
    target.scene.position.z
  );

  if (controls.target) {
    new TWEEN.Tween(controls.target)
      .to(targetObj, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }

  const targetPosition = new THREE.Vector3(
    target.scene.position.x + 5,
    target.scene.position.y + 1,
    target.scene.position.z
  );
  new TWEEN.Tween(camera.position)
    .to(targetPosition, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  controls.update();
};

export const checkIsLandscape = () => {
  return window.innerWidth > window.innerHeight;
};

export const getBase64 = (file: any, cb: (str: any) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
};

export const getTxtFromEditor = (editorJsonStr: string) => {
  let jsonEditor;
  try {
    jsonEditor = JSON.parse(editorJsonStr);
  } catch (error) {
    console.error('Invalid JSON string:', editorJsonStr, error);
    return ''; // Return an empty string or a default value in case of an error
  }

  const qTxt = jsonEditor?.root?.children
    ?.map((rootChild: any) =>
      rootChild.children
        .filter((child: any) => child.type === 'text')
        .map((child: any) => child.text)
        .join(' ')
    )
    .join(' ');

  return qTxt || '';
};

// Extracts all text nodes and their corresponding strings from a Lexical editor JSON string.
export const extractTextNodeMap = (editorJsonStr: string) => {
  let jsonEditor;

  try {
    jsonEditor = JSON.parse(editorJsonStr);
  } catch (error) {
    console.error('Invalid JSON string:', editorJsonStr);
    return { texts: [], nodes: [], json: null };
  }

  const texts: string[] = [];
  const nodes: any[] = [];

  const collect = (children: any[]) => {
    for (const child of children) {
      if (child.type === 'text') {
        nodes.push(child);
        texts.push(child.text);
      }
      if (Array.isArray(child.children)) {
        collect(child.children);
      }
    }
  };

  collect(jsonEditor?.root?.children || []);

  return { texts, nodes, json: jsonEditor };
};


export const xformedUtils = (text: string) => {
  return JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
};

export const xformedSource = (text: string) => {
  return JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text,
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'link',
              version: 1,
              rel: 'noopener',
              target: '_blank', // Open link in new tab
              title: null,
              url: text,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
};

// Helper function to extract image dimensions
export const extractImageDims = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    // Read the file as a Data URL
    reader.onload = (event) => {
      img.src = event.target?.result as string;

      // Once the image is loaded, extract the dimensions
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        resolve({ width, height });
      };

      img.onerror = () => {
        reject('Error loading image.');
      };
    };

    reader.onerror = () => {
      reject('Error reading file.');
    };

    // Start reading the file
    reader.readAsDataURL(file);
  });
};

export const calculateMaxVolume = (totalVolume: number): number => {
  return totalVolume * 0.6;
};

export const splitIndexes = (numQuestions: number) => {
  const parts = Math.ceil(numQuestions / 3);
  const questionsInParts: number[] = [];
  let remainingQuestions = numQuestions;

  for (let i = 0; i < parts; i++) {
    if (
      remainingQuestions > 3 &&
      (remainingQuestions - 3) / (parts - i - 1) >= 2
    ) {
      questionsInParts.push(3);
      remainingQuestions -= 3;
    } else {
      // Distribute remaining questions evenly
      const questionsForThisPart = Math.ceil(remainingQuestions / (parts - i));
      questionsInParts.push(questionsForThisPart);
      remainingQuestions -= questionsForThisPart;
    }
  }

  return { parts, questionsInParts };
};

export const nameGenerator = () => {
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const customConfig: Config = {
    dictionaries: [adjectives, animals, numberDictionary],
    length: 3,
    separator: '',
    style: 'capital',
  };

  const name = uniqueNamesGenerator(customConfig);
  return name;
};

export enum ColorLabels {
  gold = '#FDD017',
}

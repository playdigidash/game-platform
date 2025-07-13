import { EObstaclePlacementOptions } from '@lidvizion/commonlib';
import { Vector3 } from 'three';

export enum GameFonts {
  CLOUD = 'cloud',
  NEON = 'neon',
  ASTRO = 'astro',
  DROID_REG = 'droid_regular',
  HELVETIKER_BOLD = 'helvetiker_bold',
}

export const getObstaclePlacementOption = (options: Vector3[]) => {
  return options[Math.floor(Math.random() * options.length)];
};

export const rotationDefaults = {
  90: Math.PI / 2,
  45: 45 * (Math.PI / 180),
  30: 30 * (Math.PI / 180),
  15: 15 * (Math.PI / 180),
};

export const AssignableKeys = [
  'a',
  'b',
  'c',
  'd',
  's',
  'w',
  'f',
  'g',
  'h',
  'p',
  'enter',
  'left',
  'right',
  'up',
  'down',
];

export const defaultThemeData = {
  name: 'Space Theme',
  description:
    'A space-themed setting with all default client-side textures for a digital dash game.',
  default: true,
  road: {
    textures: {
      baseColor: 'textures/cube.png',
    },
    properties: {
      reflectivity: 0.5,
      textureScale: {
        x: 2,
        y: 2,
      },
    },
    tiles: {
      x: 3,
      y: 8,
    },
  },
  background: {
    textures: {
      baseColor: 'textures/spaceship.jpg',
    },
  },
  createdAt: '2024-11-03T00:00:00Z',
  themeId: '44868127-2397-44cb-8dbb-87a48aa893c9',
};

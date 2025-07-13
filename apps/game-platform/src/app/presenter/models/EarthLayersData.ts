import { Vector3 } from 'three';

export interface IEarthLayer {
  id: string;
  name: string;
  description: string;
  color: string;
  position: Vector3;
  scale: number;
  funFacts: string[];
}

export const earthLayers: IEarthLayer[] = [
  {
    id: 'crust',
    name: 'Crust',
    description: 'The outermost layer of Earth, making up the continents and ocean floors.',
    color: '#8B4513', // Brown
    position: new Vector3(-1, 1, 0),
    scale: 1.2,
    funFacts: [
      'The crust is the thinnest layer of Earth',
      'Oceanic crust is denser but thinner than continental crust',
      'The crust makes up only about 1% of Earth\'s volume'
    ]
  },
  {
    id: 'mantle',
    name: 'Mantle',
    description: 'The largest layer of Earth, composed of hot, dense rock.',
    color: '#FF4500', // Orange-Red
    position: new Vector3(1, 1, 0),
    scale: 1.5,
    funFacts: [
      'The mantle makes up about 84% of Earth\'s volume',
      'Temperatures in the mantle can reach up to 4000°C',
      'The mantle is mostly solid but can flow slowly over time'
    ]
  },
  {
    id: 'outer-core',
    name: 'Outer Core',
    description: 'A liquid layer of mostly iron and nickel.',
    color: '#FFD700', // Gold
    position: new Vector3(-1, -1, 0),
    scale: 0.9,
    funFacts: [
      'The outer core is the only liquid layer of Earth',
      'The movement of liquid metal creates Earth\'s magnetic field',
      'Temperatures in the outer core can reach 4500°C'
    ]
  },
  {
    id: 'inner-core',
    name: 'Inner Core',
    description: 'The centermost layer of Earth, a solid ball of mostly iron.',
    color: '#FF0000', // Red
    position: new Vector3(1, -1, 0),
    scale: 0.7,
    funFacts: [
      'The inner core is nearly as hot as the surface of the Sun',
      'Despite intense heat, the inner core remains solid due to immense pressure',
      'The inner core spins slightly faster than the rest of the planet'
    ]
  }
]; 
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { Canvas } from '@react-three/fiber';
import { IEarthLayer } from '../models/EarthLayersData';
import { Vector3 } from 'three';

interface LayerSphereProps {
  color: string;
  scale: number;
  position: [number, number, number];
  onClick: () => void;
}

const LayerSphere: React.FC<LayerSphereProps> = ({ color, scale, position, onClick }) => {
  return (
    <mesh 
      scale={[scale, scale, scale]} 
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer';
        e.object.scale.multiplyScalar(1.1);
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'default';
        e.object.scale.multiplyScalar(1/1.1);
      }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const EarthLayersOverview: React.FC = observer(() => {
  const { presenterViewStore } = useGameStore();

  return (
    <div className="earth-layers-overview">
      <div className="overview-header">
        <h1>Earth's Layers</h1>
        <p>Click on a layer to explore it in detail</p>
      </div>

      <div className="layers-visualization">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {presenterViewStore.layers.map((layer: IEarthLayer, index: number) => (
            <LayerSphere
              key={layer.id}
              color={layer.color}
              scale={layer.scale}
              position={[layer.position.x, layer.position.y, layer.position.z]}
              onClick={() => presenterViewStore.setCurrentLayerIndex(index)}
            />
          ))}
        </Canvas>
      </div>

      <div className="layers-list">
        {presenterViewStore.layers.map((layer: IEarthLayer, index: number) => (
          <div 
            key={layer.id}
            className="layer-item"
            onClick={() => presenterViewStore.setCurrentLayerIndex(index)}
          >
            <div 
              className="layer-color-indicator"
              style={{ backgroundColor: layer.color }}
            />
            <h3>{layer.name}</h3>
            <p>{layer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}); 
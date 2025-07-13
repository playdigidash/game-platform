import React from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

const LayerSphere: React.FC<{ color: string; scale: number }> = ({ color, scale }) => {
  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const EarthLayer: React.FC = observer(() => {
  const { presenterViewStore } = useGameStore();
  const layer = presenterViewStore.currentLayer;

  return (
    <div className="earth-layer-view">
      <div className="layer-header">
        <h1>{layer.name}</h1>
        <button 
          className="back-to-overview"
          onClick={() => presenterViewStore.setCurrentLayerIndex(-1)}
        >
          Back to Overview
        </button>
      </div>

      <div className="layer-content">
        <div className="layer-visualization">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <LayerSphere color={layer.color} scale={layer.scale} />
          </Canvas>
        </div>

        <div className="layer-info">
          <p className="layer-description">{layer.description}</p>
          {presenterViewStore.isShowingFunFact && (
            <div className="fun-fact-box">
              <h3>Fun Fact!</h3>
              <p>{presenterViewStore.currentFunFact}</p>
            </div>
          )}
        </div>
      </div>

      <div className="navigation-controls">
        <button
          onClick={presenterViewStore.previousLayer}
          disabled={presenterViewStore.isFirstLayer}
        >
          Back
        </button>
        <button
          onClick={presenterViewStore.toggleFunFact}
        >
          Fun Fact
        </button>
        <button
          onClick={presenterViewStore.nextLayer}
          disabled={presenterViewStore.isLastLayer}
        >
          Next
        </button>
      </div>
    </div>
  );
}); 
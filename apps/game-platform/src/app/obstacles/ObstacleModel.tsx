import React from 'react';
import { EObstacleModelType, ObstacleType } from '@lidvizion/commonlib';
import { Vector3 } from 'three';

interface ObstacleModelProps {
  item: ObstacleType;
}

const ObstacleModel: React.FC<ObstacleModelProps> = ({ item }) => {
  return item?.instance ? (
    <primitive
      object={item.instance}
      scale={
        item.type === EObstacleModelType.question
          ? item.boxArg
          : new Vector3(1, 1, 1)
      }
    />
  ) : null;
};

export default ObstacleModel;

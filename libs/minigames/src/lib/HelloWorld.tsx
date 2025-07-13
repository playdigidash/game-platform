import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CrosswordCell {
  letter: string;
  isBlack: boolean;
  isSelected: boolean;
  number?: number;
}

const CrosswordCell: React.FC<{
  position: [number, number, number];
  cell: CrosswordCell;
  onCellClick: () => void;
  onCellHover: () => void;
  onCellLeave: () => void;
}> = ({ position, cell, onCellClick, onCellHover, onCellLeave }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onCellClick}
        onPointerOver={onCellHover}
        onPointerOut={onCellLeave}
      >
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial
          color={
            cell.isBlack ? '#2c2c2c' : cell.isSelected ? '#4a90e2' : '#ffffff'
          }
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Letter text */}
      {!cell.isBlack && cell.letter && (
        <Text
          position={[0, 0.06, 0]}
          fontSize={0.3}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {cell.letter}
        </Text>
      )}

      {/* Number text */}
      {!cell.isBlack && cell.number && (
        <Text
          position={[-0.35, 0.06, -0.35]}
          fontSize={0.15}
          color="#666666"
          anchorX="left"
          anchorY="bottom"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {cell.number.toString()}
        </Text>
      )}
    </group>
  );
};

const CrosswordBoard: React.FC = () => {
  const boardRef = useRef<THREE.Group>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  // Generate a 20x20 crossword grid with some black cells and numbers
  const grid = useMemo(() => {
    const newGrid: CrosswordCell[][] = [];
    let numberCounter = 1;

    for (let row = 0; row < 20; row++) {
      newGrid[row] = [];
      for (let col = 0; col < 20; col++) {
        // Create some black cells for a crossword pattern
        const isBlack =
          (row === 5 && (col < 3 || col > 16)) ||
          (row === 10 && (col < 7 || col > 12)) ||
          (row === 15 && (col < 2 || col > 17)) ||
          (col === 5 && (row < 3 || row > 16)) ||
          (col === 10 && (row < 7 || row > 12)) ||
          (col === 15 && (row < 2 || row > 17));

        // Add numbers to cells that start words
        let number: number | undefined;
        if (!isBlack) {
          const isWordStart =
            col === 0 ||
            (col > 0 && newGrid[row][col - 1]?.isBlack) ||
            row === 0 ||
            (row > 0 && newGrid[row - 1] && newGrid[row - 1][col]?.isBlack);

          if (isWordStart) {
            number = numberCounter++;
          }
        }

        newGrid[row][col] = {
          letter: '',
          isBlack,
          isSelected: false,
          number,
        };
      }
    }
    return newGrid;
  }, []);

  const [gameGrid, setGameGrid] = useState(grid);

  // Handle cell interactions
  const handleCellClick = (row: number, col: number) => {
    if (gameGrid[row][col].isBlack) return;

    setSelectedCell([row, col]);
    setGameGrid((prev) =>
      prev.map((gridRow, r) =>
        gridRow.map((cell, c) => ({
          ...cell,
          isSelected: r === row && c === col,
        }))
      )
    );
  };

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell([row, col]);
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedCell) return;

      const [row, col] = selectedCell;
      const key = event.key.toUpperCase();

      if (/^[A-Z]$/.test(key)) {
        setGameGrid((prev) =>
          prev.map((gridRow, r) =>
            gridRow.map((cell, c) =>
              r === row && c === col ? { ...cell, letter: key } : cell
            )
          )
        );
      } else if (event.key === 'Backspace') {
        setGameGrid((prev) =>
          prev.map((gridRow, r) =>
            gridRow.map((cell, c) =>
              r === row && c === col ? { ...cell, letter: '' } : cell
            )
          )
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell]);

  // Slow rotation animation
  useFrame(() => {
    if (boardRef.current) {
      boardRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={boardRef}>
      {gameGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <CrosswordCell
            key={`${rowIndex}-${colIndex}`}
            position={[colIndex - 9.5, 0, rowIndex - 9.5]}
            cell={cell}
            onCellClick={() => handleCellClick(rowIndex, colIndex)}
            onCellHover={() => handleCellHover(rowIndex, colIndex)}
            onCellLeave={handleCellLeave}
          />
        ))
      )}
    </group>
  );
};

export const HelloWorld: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#f0f0f0' }}>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
          color: '#333',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h2>3D Crossword Puzzle</h2>
        <p>Click on a cell and type letters. Use Backspace to delete.</p>
      </div>

      <Canvas camera={{ position: [0, 15, 15], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-10, 10, -5]} intensity={0.4} />

        <CrosswordBoard />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
};

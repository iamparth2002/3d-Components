'use client';

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Circle, Html, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { holeData } from '@/data';

// Hole Component
function Hole({ position, status, onClick, realRow, realCol }) {
  // Assuming 'status' is now a blockage percentage between 0 and 1
  const blockagePercentage = status;  // This could come from the AI/ML model

  // Interpolate between green and black
  const color = new THREE.Color().setHSL(0.33, 1, 0.5 - 0.5 * blockagePercentage); // Green to black based on percentage
  const invertedRow = 17 - realRow - 1
  return (
    <mesh
      position={position}
      onClick={() => onClick({ status, position, realRow: invertedRow, realCol })}
      style={{ cursor: 'pointer' }} >
      <cylinderGeometry args={[0.2, 0.2, 150, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Board({ rows, cols, spacing, width, height }) {
  return (
    <group>
      {/* Board */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} />
      </mesh>
      {/* Row and Column Markings */}
      {/* {Array.from({ length: rows }, (_, rowIndex) => (
        <Text
          key={`row-${rowIndex}`}
          position={[-width / 2 - 0.5, 0, (rowIndex - rows / 2 + 0.5) * spacing]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color="black"
        >
          L {rowIndex + 1}
        </Text>
      ))} */}
      {Array.from({ length: cols }, (_, colIndex) => (
        <Text
          key={`col-${colIndex}`}
          position={[(colIndex - cols / 2 + 0.5) * spacing, 0, height / 2 - 1.5]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={0.5}
          color="black"
        >
          Row {cols - colIndex}
        </Text>
      ))}
    </group>
  );
}
// TubeSheet Component
function TubeSheet({ onHoleClick }) {
  const TUBE_SHEET_RADIUS = 11;
  const HOLE_RADIUS = 0.2;
  const HOLE_SPACING = 0.8;
  const MAX_DISTANCE_FROM_CENTER = 10;
  const ROWS = 17;
  const COLS = 25;

  // Column distribution for each row
  const rowColumnPattern = [7, 15, 29, 22, 25, 25, 25, 25, 25, 25, 25, 25, 25, 22, 19, 15, 7];

  const createHoles = () => {
    const holes = [];
    const sampleHolesData = holeData;

    let holeIndex = 0;
    for (let row = 0; row < ROWS; row++) {
      const numColsInRow = rowColumnPattern[row];  // Get the number of columns for the current row

      for (let col = 1; col <= numColsInRow; col++) {

        if (holeIndex >= sampleHolesData.length) break;

        // Swap and rotate the coordinates (90 degrees rotation)
        const x = (col - Math.floor(numColsInRow / 2)) * HOLE_SPACING;  // Adjusted to center the columns properly
        const z = (row - Math.floor(ROWS / 2)) * HOLE_SPACING;
        const newX = z; // 90-degree rotation (swap x and z)
        const newZ = -x; // Invert the sign of the new x to get proper rotation

        const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ);

        if (distanceFromCenter <= MAX_DISTANCE_FROM_CENTER) {
          const { status } = sampleHolesData[holeIndex];
          holes.push({
            position: [newX, -74.9, newZ],
            status,
            realRow: row,
            realCol: col,  // Column will be positive and start from 1
          });
          holeIndex++;
        }
      }
    }
    return holes;
  };

  const holes = createHoles();

  return (
    <group>
      <Board
        rows={COLS}
        cols={ROWS}
        spacing={HOLE_SPACING}
        width={25} // Adjust based on TubeSheet dimensions
        height={28} // Adjust based on TubeSheet dimensions
      />
      <Circle args={[TUBE_SHEET_RADIUS, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="white"
          side={THREE.DoubleSide}
          specular="black"
          shininess={0}
        />
      </Circle>
      {holes.map((hole, index) => (
        <Hole key={index} position={hole.position} status={hole.status} realRow={hole.realRow} realCol={hole.realCol} onClick={onHoleClick} />
      ))}
    </group>
  );
}


// Chimney Base Component
function ChimneyBase() {
  const BASE_RADIUS = 11;
  const BASE_HEIGHT = 150;

  return (
    <mesh position={[0, -BASE_HEIGHT / 1.998, 0]}>
      <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, BASE_HEIGHT, 32]} />
      <meshStandardMaterial color="#666666" side={THREE.DoubleSide} />
    </mesh>
  );
}


function TopCylinder() {
  const TOP_UPPER_RADIUS = 6;
  const TOP_LOWER_RADIUS = 11;
  const TOP_HEIGHT = 12;

  return (
    <mesh position={[0, 36.1, 0]}>
      <cylinderGeometry args={[TOP_UPPER_RADIUS, TOP_LOWER_RADIUS, TOP_HEIGHT, 32]} />
      <meshStandardMaterial color="black" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}
function MidCylinder() {
  const MID_RADIUS = 11;
  const MID_HEIGHT = 20;

  return (
    <mesh position={[0, 10.01, 0]}>
      <cylinderGeometry args={[MID_RADIUS, MID_RADIUS, MID_HEIGHT, 32]} />
      <meshStandardMaterial color="#7e8487" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}
function BottomCylinder() {
  const MID_RADIUS = 11;
  const RED_HEIGHT = 10;

  return (
    <mesh position={[0, 25.01, 0]}>
      <cylinderGeometry args={[MID_RADIUS, MID_RADIUS, RED_HEIGHT, 32]} />
      <meshStandardMaterial color="red" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ChimneyTopValve() {
  const VALVE_RADIUS = 1.5;
  const VALVE_HEIGHT = 5;
  const VALVE_POSITIONS = [
    { x: 11, y: 35, z: 0, label: "Valve 1" },
  ];

  return (
    <>
      {VALVE_POSITIONS.map((pos, index) => (
        <group key={index}>
          {/* Valve */}
          <mesh
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[VALVE_RADIUS, VALVE_RADIUS, VALVE_HEIGHT, 32]} />
            <meshStandardMaterial color="#afb6ba" />
          </mesh>

          {/* Label */}
          <Html
            position={[pos.x + 10, pos.y + 1, pos.z]} // Adjust label position close to the valve
            center
            style={{
              backgroundColor: "blue",

              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "white",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {pos.label}
          </Html>
        </group>
      ))}
    </>
  );
}

function ChimneyBottomValve() {
  const VALVE_RADIUS = 1.5;
  const VALVE_HEIGHT = 5;
  const VALVE_POSITIONS = [
    { x: 13.5, y: 10, z: 0, label: "Valve 2" },
  ];

  return (
    <>
      {VALVE_POSITIONS.map((pos, index) => (
        <group key={index}>
          {/* Valve */}
          <mesh
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[VALVE_RADIUS, VALVE_RADIUS, VALVE_HEIGHT, 32]} />
            <meshStandardMaterial color="#afb6ba" />
          </mesh>

          {/* Label */}
          <Html
            position={[pos.x + 10, pos.y + 1, pos.z]} // Adjust label position close to the valve
            center
            style={{
              backgroundColor: "blue",

              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "white",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {pos.label}
          </Html>
        </group>
      ))}
    </>
  );
}

// Plate with Cylinders Component

function PlateWithCylindersUpper() {
  const CYLINDER_RADIUS = 2;
  const CYLINDER_HEIGHT = 8;
  const CYLINDER_POSITIONS = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * Math.PI) / 3;
    const x = 7 * Math.cos(angle);
    const z = 7 * Math.sin(angle);
    return { x, z };
  });

  return (
    <group position={[0, 20, 0]}>
      {/* Transparent Base Plate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[11, 11, 0.5, 64]} />
        <meshStandardMaterial color="red" side={THREE.DoubleSide} />
      </mesh>

      {/* Center Cylinder (Top Half) */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, CYLINDER_HEIGHT / 4, 0]}>
          <cylinderGeometry
            args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
          />
          <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Surrounding Cylinders (Top Half) */}
      {CYLINDER_POSITIONS.map((pos, index) => (
        <group key={index} position={[pos.x, 0.5, pos.z]}>
          <mesh position={[0, CYLINDER_HEIGHT / 4, 0]}>
            <cylinderGeometry
              args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
            />
            <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PlateWithCylindersLower() {
  const CYLINDER_RADIUS = 2;
  const CYLINDER_HEIGHT = 8;
  const CYLINDER_POSITIONS = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * Math.PI) / 3;
    const x = 7 * Math.cos(angle);
    const z = 7 * Math.sin(angle);
    return { x, z };
  });

  return (
    <group position={[0, 20, 0]}>
      {/* Center Cylinder (Bottom Half) */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, -CYLINDER_HEIGHT / 4, 0]}>
          <cylinderGeometry
            args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
          />
          <meshStandardMaterial color="#afb6ba" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Surrounding Cylinders (Bottom Half) */}
      {CYLINDER_POSITIONS.map((pos, index) => (
        <group key={index} position={[pos.x, 0.5, pos.z]}>
          <mesh position={[0, -CYLINDER_HEIGHT / 4, 0]}>
            <cylinderGeometry
              args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
            />
            <meshStandardMaterial color="#afb6ba" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DataCard({ position, data }) {
  return (
    <Html position={position} style={{ transform: 'translate(-50%, -100%)' }}>
      <div
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          pointerEvents: 'none', // Prevent interaction with the card
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // Align text to the left
          width: '250px', // Set the width of the card
          gap: '4px', // Add gap between items
        }}
      >
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Hole Data</h4>
        <p style={{ margin: 0 }}>Blockage Percentage: {(data.status * 100).toFixed(2)}%</p>
        <p style={{ margin: 0 }}>Row: {data.realRow + 1}</p>
        <p style={{ margin: 0 }}>Tube: {data.realCol}</p>
      </div>
    </Html>
  );
}




// Chimney Component
function Chimney() {
  return (
    <group>
      <TopCylinder />
      <ChimneyTopValve />

      <BottomCylinder />
      <PlateWithCylindersUpper />
      <PlateWithCylindersLower />
      <ChimneyBottomValve />
      <MidCylinder />

      <TubeSheet onHoleClick={() => { }} />
      <ChimneyBase />
    </group>
  );
}

// Main Viewer Component
function ChimneyViewer() {
  const CAMERA_POSITION = [20, 20, 50];
  const CAMERA_FOV = 40;
  const [selectedHole, setSelectedHole] = useState(null);
  const [cardPosition, setCardPosition] = useState(null);
  const [cardData, setCardData] = useState(null);

  const handleHoleClick = (hole) => {
    console.log(hole)
    setSelectedHole(hole);
    setCardPosition([hole.position[0] + 7, hole.position[1] + 80, hole.position[2]]); // Adjust height as needed
    setCardData(hole);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Panel (Chimney) */}
      <div style={{ width: '60%', height: '100%' }}>
        <Canvas camera={{ position: [20, 20, 20], fov: CAMERA_FOV }}>
          <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
          <ambientLight intensity={0.3} />
          <Chimney />
          <OrbitControls enableZoom enablePan />
        </Canvas>
      </div>

      {/* Right Panel */}
      <div style={{ width: '40%', height: '100%', display: 'flex', flexDirection: 'column' }} className="border-l-2">

        
          <Canvas camera={{ position: CAMERA_POSITION, fov: 80 }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />
            <TubeSheet onHoleClick={handleHoleClick} />
            {cardPosition && <DataCard position={cardPosition} data={cardData} />}
            {selectedHole !== null && (
              <Line points={[[selectedHole.position[0], selectedHole.position[1] + 75, selectedHole.position[2]], cardPosition]} color="blue" />
            )}
            <OrbitControls enableZoom enablePan />
          </Canvas>
          <Canvas camera={{ position: CAMERA_POSITION, fov: 80 }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />
            <PlateWithCylindersUpper />
            <PlateWithCylindersLower />
            <OrbitControls enableZoom enablePan />
          </Canvas>
        


      </div>
    </div>
  );
}

export default ChimneyViewer;

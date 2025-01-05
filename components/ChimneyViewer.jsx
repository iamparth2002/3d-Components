'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Circle, Html } from '@react-three/drei';
import * as THREE from 'three';

// Hole Component
function Hole({ position, status }) {
  // Assuming 'status' is now a blockage percentage between 0 and 1
  const blockagePercentage = status;  // This could come from the AI/ML model

  // Interpolate between green and black
  const color = new THREE.Color().setHSL(0.33, 1, 0.5 - 0.5 * blockagePercentage); // Green to black based on percentage

  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.2, 0.2, 150, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}


// TubeSheet Component
function TubeSheet() {
  const TUBE_SHEET_RADIUS = 11;
  const HOLE_RADIUS = 0.2;
  const HOLE_SPACING = 1;
  const MAX_DISTANCE_FROM_CENTER = 10;
  const ROWS = 17;
  const COLS = 25;

  // Column distribution for each row
  const rowColumnPattern = [7, 15, 19, 22, 25, 25, 25, 25, 25, 25, 25, 25, 25, 22, 19, 15, 7];

  const createHoles = () => {
    const holes = [];
    const sampleHolesData = Array.from({ length: 353 }, (_, i) => ({
      id: i + 1,
      status: Math.random()
    }));

    let holeIndex = 0;
    for (let row = 0; row < ROWS; row++) {
      const numColsInRow = rowColumnPattern[row];  // Get the number of columns for the current row

      for (let col = -Math.floor(numColsInRow / 2); col <= Math.floor(numColsInRow / 2); col++) {
        if (holeIndex >= sampleHolesData.length) break;

        // Swap and rotate the coordinates (90 degrees rotation)
        const x = col * HOLE_SPACING;
        const z = (row - Math.floor(ROWS / 2)) * HOLE_SPACING;
        const newX = z; // 90 degree rotation (swap x and z)
        const newZ = -x; // Invert the sign of the new x to get proper rotation

        const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ);

        if (distanceFromCenter <= MAX_DISTANCE_FROM_CENTER) {
          const { status } = sampleHolesData[holeIndex];
          holes.push({ position: [newX, -74.9, newZ], status });
          holeIndex++;
        }
      }
    }
    return holes;
  };



  const holes = createHoles();

  return (
    <group>
      <Circle args={[TUBE_SHEET_RADIUS, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="white"
          side={THREE.DoubleSide}
          specular="black"
          shininess={0}
        />
      </Circle>
      {holes.map((hole, index) => (
        <Hole key={index} position={hole.position} status={hole.status} />
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
// function PlateWithCylinders() {
//   const PLATE_RADIUS = 11;
//   const CYLINDER_RADIUS = 2;
//   const INNER_CYLINDER_RADIUS = 1.8;
//   const CYLINDER_HEIGHT = 8;
//   const CYLINDER_POSITIONS = Array.from({ length: 6 }).map((_, i) => {
//     const angle = (i * Math.PI) / 3; // Distribute 6 cylinders evenly
//     const x = 7 * Math.cos(angle); // Distance from center
//     const z = 7 * Math.sin(angle);
//     return { x, z };
//   });

//   return (
//     <group position={[0, 20, 0]}>
//       {/* Transparent Base Plate */}
//       <mesh position={[0, 0, 0]}>
//         <cylinderGeometry args={[PLATE_RADIUS, PLATE_RADIUS, 0.5, 64]} />
//         <meshStandardMaterial color="red" side={THREE.DoubleSide} />
//       </mesh>

//       {/* Center Cylinder (Split into Top and Bottom) */}
//       <group position={[0, 0.5, 0]}>
//         {/* Top Half */}
//         <mesh position={[0, CYLINDER_HEIGHT / 4, 0]}>
//           <cylinderGeometry
//             args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
//           />
//           <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
//         </mesh>
//         {/* Bottom Half */}
//         <mesh position={[0, -CYLINDER_HEIGHT / 4, 0]}>
//           <cylinderGeometry
//             args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
//           />
//           <meshStandardMaterial color="#afb6ba" side={THREE.DoubleSide} />
//         </mesh>
//       </group>

//       {/* Surrounding Cylinders (Split into Top and Bottom) */}
//       {CYLINDER_POSITIONS.map((pos, index) => (
//         <group key={index} position={[pos.x, 0.5, pos.z]}>
//           {/* Top Half */}
//           <mesh position={[0, CYLINDER_HEIGHT / 4, 0]}>
//             <cylinderGeometry
//               args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
//             />
//             <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
//           </mesh>
//           {/* Bottom Half */}
//           <mesh position={[0, -CYLINDER_HEIGHT / 4, 0]}>
//             <cylinderGeometry
//               args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT / 2, 64, 10, true]}
//             />
//             <meshStandardMaterial color="#afb6ba" side={THREE.DoubleSide} />
//           </mesh>
//         </group>
//       ))}
//     </group>
//   );
// }
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

      {/* <PlateWithCylinders /> */}


      <TubeSheet />
      <ChimneyBase />
    </group>
  );
}

// Main Viewer Component
export default function ChimneyViewer() {
  const CAMERA_POSITION = [20, 20, 50];
  const CAMERA_FOV = 40;

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
      <div style={{ width: '40%', height: '100%', display: 'flex', flexDirection: 'column' }} className=' border-l-2'>
        {/* Top - TubeSheet Canvas */}
        <div style={{ flex: 1 }} className=' border-b-2 overflow-x-hidden'>
          <Canvas camera={{ position: CAMERA_POSITION, fov: 80 }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />
            {/* <PlateWithCylinders /> */}
            {/* <PlateWithCylindersLower />
            <MidCylinder /> */}
            <TubeSheet />
            {/* <ChimneyBottomValve /> */}
            <ChimneyBase />

            <OrbitControls enableZoom enablePan />
          </Canvas>
        </div>

        {/* Bottom - PlateWithCylinders Canvas */}
        <div style={{ flex: 1 }}>
            <Canvas camera={{ position: [60, 80, 0], fov: 80 }}>
              <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
              <ambientLight intensity={0.3} />
              <TopCylinder />
              <ChimneyTopValve />
  
              <BottomCylinder />
              <PlateWithCylindersUpper />
              <OrbitControls enableZoom enablePan/>
            </Canvas>
        </div>
      </div>
    </div>
  );
}

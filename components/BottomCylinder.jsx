import React from 'react'
import * as THREE from 'three';

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

export default BottomCylinder
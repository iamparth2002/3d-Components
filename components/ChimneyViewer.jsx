'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Chimney() {
  const chimneyRef = useRef(null)

  return (
    <group ref={chimneyRef} position={[0, 0, 0]}>
      {/* Base section with ribs */}
      <mesh position={[0, -16.5, 0]}>
        <cylinderGeometry args={[3, 3, 28, 32]} />
        <meshStandardMaterial color="#666666" />
       
        {/* {Array.from({ length: 40 }).map((_, i) => (
          <mesh key={i} position={[0, -13 + i * 0.7, 0]}>
            <torusGeometry args={[2.1, 0.1, 16, 32]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        ))} */}
      </mesh>

      {/* Top section */}
      <mesh position={[0, 6.5, 0]}>
        <cylinderGeometry args={[1.4, 3, 4, 32]} />
        <meshStandardMaterial color="#afb6ba" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[3, 3, 7, 32]} />
        <meshStandardMaterial color="#7e8487" />
      </mesh>
     
     {/* valves */}
      <mesh position={[3, 6.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
        <meshStandardMaterial color="#afb6ba" />
      </mesh>
      <mesh position={[3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
        <meshStandardMaterial color="#afb6ba" />
      </mesh>


      {/* Windows/openings */}
      {/* {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            2.3 * Math.cos((i * Math.PI) / 2),
            1,
            2.3 * Math.sin((i * Math.PI) / 2),
          ]}
          rotation={[0, (i * Math.PI) / 2, 0]}
        >
          <boxGeometry args={[0.5, 1, 0.3]} />
          <meshStandardMaterial color="#44bbff" />
        </mesh>
      ))} */}
    </group>
  )
}

export default function ChimneyViewer() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [10, 5, 10],
          fov: 50,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Chimney />
        <OrbitControls enableZoom={true} enablePan={true} />
        {/* <gridHelper args={[20, 20]} /> */}
      </Canvas>
    </div>
  )
}


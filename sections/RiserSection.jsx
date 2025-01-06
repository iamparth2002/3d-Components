import React from 'react'
import PlateWithCylindersLower from '@/components/PlateWithCylindersLower'
import PlateWithCylindersUpper from '@/components/PlateWithCylindersUpper'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function RiserSection() {
    const CAMERA_POSITION = [20, 20, 50];
  
    return (
        <Canvas camera={{ position: CAMERA_POSITION, fov: 80 }}>
            <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
            <ambientLight intensity={0.3} />
            <PlateWithCylindersUpper />
            <PlateWithCylindersLower />
            <OrbitControls enableZoom enablePan />
        </Canvas>
    )
}

export default RiserSection
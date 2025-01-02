'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

function PlateWithCylinders() {
    return (
        <group position={[0, 0, 0]}>
            {/* Transparent Base Plate */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[6, 6, 0.5, 64]} />
                <meshStandardMaterial
                    color="black"
                    transparent={true}
                    opacity={0.5} // Makes the plate see-through
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Center Thick Filled Hollow Cylinder */}
            <group position={[0, 0.5, 0]}>
                {/* Outer Wall */}
                <mesh>
                    <cylinderGeometry args={[1.5, 1.5, 7, 64, 10, true]} />
                    <meshStandardMaterial
                        color="#7e8487"
                        transparent={false}
                        opacity={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Inner Wall */}
                <mesh>
                    <cylinderGeometry args={[1.3, 1.3, 7, 64, 10, true]} />
                    <meshStandardMaterial
                        color="black"
                        transparent={false}
                        opacity={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Top and Bottom Faces */}
                <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.3, 1.5, 64]} />
                    <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, -3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.3, 1.5, 64]} />
                    <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* Surrounding Thick Filled Hollow Cylinders */}
            {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * Math.PI) / 3; // Distributes the 6 cylinders evenly
                const x = 4 * Math.cos(angle); // Radius for the placement
                const z = 4 * Math.sin(angle);
                return (
                    <group key={i} position={[x, 0.5, z]}>
                        {/* Outer Wall */}
                        <mesh>
                            <cylinderGeometry args={[1.5, 1.5, 7, 64, 10, true]} />
                            <meshStandardMaterial
                                color="#7e8487"
                                transparent={false}
                                opacity={1}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        {/* Inner Wall */}
                        <mesh>
                            <cylinderGeometry args={[1.3, 1.3, 7, 64, 10, true]} />
                            <meshStandardMaterial
                                color="black"
                                transparent={false}
                                opacity={1}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        {/* Top and Bottom Faces */}
                        <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[1.3, 1.5, 64]} />
                            <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh position={[0, -3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[1.3, 1.5, 64]} />
                            <meshStandardMaterial color="#7e8487" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                )
            })}
        </group>
    )
}

export default function InnerDisk() {
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
                <PlateWithCylinders />
                <OrbitControls enableZoom={true} enablePan={true} />
            </Canvas>
        </div>
    )
}

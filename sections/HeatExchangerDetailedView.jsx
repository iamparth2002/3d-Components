import BottomCylinder from '@/components/BottomCylinder'
import ChimneyBase from '@/components/ChimneyBase'
import ChimneyBottomValve from '@/components/ChimneyBottomValve'
import ChimneyTopValve from '@/components/ChimneyTopValve'
import MidCylinder from '@/components/MidCylinder'
import PlateWithCylindersLower from '@/components/PlateWithCylindersLower'
import PlateWithCylindersUpper from '@/components/PlateWithCylindersUpper'
import TopCylinder from '@/components/TopCylinder'
import TubeSheet from '@/components/TubeSheet'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'

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

function HeatExchangerDetailedView() {
    const CAMERA_POSITION = [20, 20, 50];
    const CAMERA_FOV = 40;
    return (
        <group>
            <Canvas camera={{ position: [20, 20, 20], fov: CAMERA_FOV }}>
                <directionalLight castShadow position={[10, 20, 15]} intensity={0.8} />
                <ambientLight intensity={0.3} />

                <Chimney />
                <OrbitControls enableZoom enablePan />
            </Canvas>
        </group>
    )
}

export default HeatExchangerDetailedView
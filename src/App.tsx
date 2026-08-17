import { Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { Suspense } from 'react'
import * as THREE from 'three'
import Experience from './Experience/Experience'

THREE.ColorManagement.enabled = true

export default function App()
{
    return <>
        <Leva collapsed />

        <Canvas
            shadows={{ type: THREE.PCFSoftShadowMap }}
            gl={{
                antialias: true,
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1,
            }}
        >
            <Suspense fallback={null}>
                <Experience />
            </Suspense>

            {import.meta.env.DEV && <Stats />}
        </Canvas>
    </>
}

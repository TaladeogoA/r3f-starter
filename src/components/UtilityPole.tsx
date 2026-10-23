import { useMemo } from 'react'
import * as THREE from 'three'

const POLES = [
  { x: 30, z: 12 },
  { x: 66, z: 12 },
  { x: -34, z: 12 },
]
const HEIGHT = 11
const SAG = 0.9

function Pole({ x, z }: { x: number; z: number }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#141516', roughness: 0.85 }), [])
  const insMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a3a36', roughness: 0.3, metalness: 0.2 }), [])
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, HEIGHT / 2, 0]} material={mat}>
        <cylinderGeometry args={[0.1, 0.17, HEIGHT, 10]} />
      </mesh>
      <mesh position={[0, HEIGHT - 0.5, 0]} material={mat}>
        <boxGeometry args={[0.1, 0.12, 2.0]} />
      </mesh>
      <mesh position={[0, HEIGHT - 1.7, 0]} material={mat}>
        <boxGeometry args={[0.1, 0.1, 1.5]} />
      </mesh>
      {[-0.85, 0, 0.85].map((dz) => (
        <mesh key={dz} position={[0, HEIGHT - 0.35, dz]} material={insMat}>
          <cylinderGeometry args={[0.05, 0.07, 0.22, 8]} />
        </mesh>
      ))}
    </group>
  )
}

function Cable({ x0, x1, z, dz }: { x0: number; x1: number; z: number; dz: number }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const n = 24
    for (let i = 0; i <= n; i++) {
      const t = i / n
      pts.push(new THREE.Vector3(x0 + (x1 - x0) * t, HEIGHT - 0.2 - SAG * 4 * t * (1 - t), z + dz))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.015, 4)
  }, [x0, x1, z, dz])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0d0d0e', roughness: 0.6 }), [])
  return <mesh geometry={geo} material={mat} />
}

export default function UtilityPole() {
  return (
    <group>
      {POLES.map((p) => (
        <Pole key={p.x} x={p.x} z={p.z} />
      ))}
      {[-0.85, 0, 0.85].map((dz) => (
        <group key={dz}>
          <Cable x0={30} x1={66} z={12} dz={dz} />
          <Cable x0={-34} x1={30} z={12} dz={dz} />
        </group>
      ))}
    </group>
  )
}

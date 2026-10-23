import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const WALL_Z = 29
const X_MIN = -90
const X_MAX = 100
const HEIGHT = 3.2
const THICK = 0.3
const BAY = 5
const PILASTER_W = 0.45

function wallTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const ctx = c.getContext('2d') as CanvasRenderingContext2D
  ctx.fillStyle = '#d6d3c8'
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const a = Math.random() * 0.07
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(70,60,45,${a})` : `rgba(255,250,235,${a})`
    ctx.fillRect(x, y, 2 + Math.random() * 6, 2 + Math.random() * 6)
  }
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * 512
    const g = ctx.createLinearGradient(x, 0, x, 512)
    g.addColorStop(0, 'rgba(60,50,38,0.10)')
    g.addColorStop(0.5, 'rgba(60,50,38,0.03)')
    g.addColorStop(1, 'rgba(60,50,38,0)')
    ctx.fillStyle = g
    ctx.fillRect(x, 0, 6 + Math.random() * 14, 512)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(1 / 4, 1 / 3)
  t.anisotropy = 8
  return t
}

export default function BoundaryWall() {
  const bays = Math.round((X_MAX - X_MIN) / BAY)
  const tex = useMemo(wallTexture, [])
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, color: '#bdbbb4' }), [tex])
  const recessMat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex, roughness: 1, color: '#8f8d88' }), [tex])
  const wireMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a3c3e', roughness: 0.5, metalness: 0.8 }), [])
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
  const wireGeo = useMemo(() => new THREE.CylinderGeometry(0.012, 0.012, 1, 5), [])
  const barbGeo = useMemo(() => new THREE.ConeGeometry(0.025, 0.12, 4), [])

  const base = useRef<THREE.Mesh>(null)
  const pilasters = useRef<THREE.InstancedMesh>(null)
  const recesses = useRef<THREE.InstancedMesh>(null)
  const arms = useRef<THREE.InstancedMesh>(null)
  const strands = useRef<THREE.InstancedMesh>(null)
  const barbs = useRef<THREE.InstancedMesh>(null)

  const barbCount = bays * 40

  useLayoutEffect(() => {
    const pi = pilasters.current
    const re = recesses.current
    const ar = arms.current
    const st = strands.current
    const ba = barbs.current
    if (!pi || !re || !ar || !st || !ba) return
    const d = new THREE.Object3D()
    for (let i = 0; i <= bays; i++) {
      const x = X_MIN + i * BAY
      d.position.set(x, HEIGHT / 2, WALL_Z - THICK / 2 - 0.05)
      d.rotation.set(0, 0, 0)
      d.scale.set(PILASTER_W, HEIGHT + 0.12, 0.1)
      d.updateMatrix()
      pi.setMatrixAt(i, d.matrix)
      d.position.set(x, HEIGHT + 0.6, WALL_Z - 0.1)
      d.rotation.set(0.5, 0, 0)
      d.scale.set(0.03, 1.1, 0.03)
      d.updateMatrix()
      ar.setMatrixAt(i, d.matrix)
    }
    for (let i = 0; i < bays; i++) {
      const cx = X_MIN + (i + 0.5) * BAY
      d.position.set(cx, HEIGHT * 0.5 - 0.1, WALL_Z - THICK / 2 - 0.005)
      d.rotation.set(0, 0, 0)
      d.scale.set(BAY - 1.2, HEIGHT - 1.0, 0.02)
      d.updateMatrix()
      re.setMatrixAt(i, d.matrix)
    }
    const len = X_MAX - X_MIN
    const ys = [HEIGHT + 0.28, HEIGHT + 0.58, HEIGHT + 0.9]
    const zs = [WALL_Z - 0.55, WALL_Z - 0.33, WALL_Z - 0.1]
    ys.forEach((y, i) => {
      d.position.set((X_MIN + X_MAX) / 2, y, zs[i])
      d.rotation.set(0, 0, Math.PI / 2)
      d.scale.set(1, len, 1)
      d.updateMatrix()
      st.setMatrixAt(i, d.matrix)
    })
    for (let i = 0; i < barbCount; i++) {
      const k = i % 3
      const x = X_MIN + (i / barbCount) * len + (k * 0.17)
      d.position.set(x, ys[k], zs[k])
      d.rotation.set(0, 0, (i % 2 ? 1 : -1) * 1.1 + k)
      d.scale.set(1, 1, 1)
      d.updateMatrix()
      ba.setMatrixAt(i, d.matrix)
    }
    pi.instanceMatrix.needsUpdate = true
    re.instanceMatrix.needsUpdate = true
    ar.instanceMatrix.needsUpdate = true
    st.instanceMatrix.needsUpdate = true
    ba.instanceMatrix.needsUpdate = true
  }, [bays, barbCount])

  return (
    <group>
      <mesh ref={base} position={[(X_MIN + X_MAX) / 2, HEIGHT / 2, WALL_Z]} geometry={box} material={wallMat} scale={[X_MAX - X_MIN, HEIGHT, THICK]} />
      <instancedMesh ref={pilasters} args={[box, wallMat, bays + 1]} frustumCulled={false} />
      <instancedMesh ref={recesses} args={[box, recessMat, bays]} frustumCulled={false} />
      <instancedMesh ref={arms} args={[wireGeo, wireMat, bays + 1]} frustumCulled={false} />
      <instancedMesh ref={strands} args={[wireGeo, wireMat, 3]} frustumCulled={false} />
      <instancedMesh ref={barbs} args={[barbGeo, wireMat, barbCount]} frustumCulled={false} />
    </group>
  )
}

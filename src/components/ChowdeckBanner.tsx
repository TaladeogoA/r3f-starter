import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { windUniforms } from '../Experience/weather'

const BANNER_X = 15.5
const BANNER_Z = 13.8
const W = 0.7
const H = 2.6
const BOTTOM = 0.8
const POLE_HEIGHT = 3.6
const CANVAS_W = 360
const CANVAS_H = Math.round((CANVAS_W * H) / W)
const RED = '#c4301f'

function paintBase(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = RED
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
  g.addColorStop(0, 'rgba(255,255,255,0.05)')
  g.addColorStop(1, 'rgba(0,0,0,0.12)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const vertexHelpers = /* glsl */ `
uniform float uTime;
uniform float uWind;
const float BW = ${W.toFixed(3)};
const float BH = ${H.toFixed(3)};
vec3 flag(vec3 p) {
  float s = clamp(p.x / BW, 0.0, 1.0);
  float amp = uWind * (0.04 + 0.34 * pow(s, 1.15));
  float k = 7.0;
  float ph = uTime * (3.2 + uWind * 3.0);
  float w1 = sin(p.x * k - ph + p.y * 1.6);
  float w2 = sin(p.x * k * 1.9 - ph * 1.35 + p.y * 3.1 + 1.3) * 0.35;
  float w3 = sin(p.y * 4.0 + uTime * 2.1 + p.x * 3.0) * 0.12;
  float dz = amp * (w1 + w2 + w3);
  float pull = 0.5 * amp * amp * 1.4;
  float lift = uWind * 0.12 * s * s;
  float tipFlap = sin(uTime * 5.0 + p.y * 2.2) * 0.05 * uWind * s;
  return vec3(p.x - pull + tipFlap, p.y + lift * (1.0 - (p.y + BH * 0.5) / BH), p.z + dz);
}
`

export default function ChowdeckBanner() {
  const { texture, material, geometry } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_W
    canvas.height = CANVAS_H
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    paintBase(ctx)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    ;(tex as THREE.CanvasTexture & { userData: { canvas: HTMLCanvasElement } }).userData.canvas = canvas

    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0, side: THREE.DoubleSide })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = windUniforms.uTime
      shader.uniforms.uWind = windUniforms.uWind
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${vertexHelpers}`)
        .replace(
          '#include <beginnormal_vertex>',
          `vec3 pc = flag(position);
vec3 pdx = flag(position + vec3(0.02, 0.0, 0.0)) - pc;
vec3 pdy = flag(position + vec3(0.0, 0.02, 0.0)) - pc;
vec3 objectNormal = normalize(cross(pdx, pdy));
#ifdef USE_TANGENT
vec3 objectTangent = vec3(tangent.xyz);
#endif`,
        )
        .replace('#include <begin_vertex>', 'vec3 transformed = pc;')
    }

    const geo = new THREE.PlaneGeometry(W, H, 12, 44)
    geo.translate(W / 2, 0, 0)
    return { texture: tex, material: mat, geometry: geo }
  }, [])

  useEffect(() => {
    let cancelled = false
    const canvas = (texture as THREE.CanvasTexture & { userData: { canvas: HTMLCanvasElement } }).userData.canvas
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    Promise.all([loadImage('/textures/chowdeck_icon.png'), loadImage('/textures/chowdeck_wordmark.png')])
      .then(([icon, word]) => {
        if (cancelled) return
        paintBase(ctx)
        const iw = 230
        const ih = (icon.height / icon.width) * iw
        ctx.drawImage(icon, (CANVAS_W - iw) / 2, 110, iw, ih)
        const len = 780
        const thick = (word.height / word.width) * len
        ctx.save()
        ctx.translate(CANVAS_W / 2, 110 + ih + 110)
        ctx.rotate(Math.PI / 2)
        ctx.drawImage(word, 0, -thick / 2, len, thick)
        ctx.restore()
        texture.needsUpdate = true
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [texture])

  const poleMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5a5d60', roughness: 0.6, metalness: 0.5 }), [])

  const centerY = BOTTOM + H / 2

  return (
    <group position={[BANNER_X, 0, BANNER_Z]}>
      <mesh position={[0, POLE_HEIGHT / 2, 0]} material={poleMaterial}>
        <cylinderGeometry args={[0.035, 0.045, POLE_HEIGHT, 10]} />
      </mesh>
      <mesh position={[0.02, BOTTOM + H + 0.03, 0]} rotation={[0, 0, Math.PI / 2]} material={poleMaterial}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
      </mesh>
      <mesh position={[0.045, centerY, 0]} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  )
}

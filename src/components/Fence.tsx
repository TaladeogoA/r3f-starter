import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const FENCE_Z = 14.6;
const X_MIN = -70;
const X_MAX = 80;
const GATE_MIN = 18.5;
const GATE_MAX = 23.5;
const PANEL_W = 3.5;
const PANEL_H = 2.2;
const PLINTH_H = 0.3;
const POST_R = 0.04;

function meshTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(190,194,196,1)";
  ctx.lineWidth = 7;
  const step = 32;
  for (let i = 0; i <= 256; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(PANEL_W / 0.2, (PANEL_H - 0.1) / 0.2);
  t.anisotropy = 8;
  return t;
}

function segments() {
  const out: { x0: number; x1: number }[] = [];
  const add = (a: number, b: number) => {
    const n = Math.max(1, Math.round((b - a) / PANEL_W));
    const w = (b - a) / n;
    for (let i = 0; i < n; i++)
      out.push({ x0: a + i * w, x1: a + (i + 1) * w });
  };
  add(X_MIN, GATE_MIN);
  add(GATE_MAX, X_MAX);
  return out;
}

export default function Fence() {
  const segs = useMemo(segments, []);
  const meshTex = useMemo(meshTexture, []);
  const panels = useRef<THREE.InstancedMesh>(null);
  const frames = useRef<THREE.InstancedMesh>(null);
  const posts = useRef<THREE.InstancedMesh>(null);
  const plinths = useRef<THREE.InstancedMesh>(null);

  const panelGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const frameGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const postGeo = useMemo(
    () => new THREE.CylinderGeometry(POST_R, POST_R, 1, 8),
    [],
  );

  const panelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: meshTex,
        transparent: true,
        alphaTest: 0.12,
        alphaToCoverage: true,
        side: THREE.DoubleSide,
        roughness: 0.55,
        metalness: 0.6,
        color: "#c9cdd0",
      }),
    [meshTex],
  );
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8b8f92",
        roughness: 0.55,
        metalness: 0.6,
      }),
    [],
  );
  const plinthMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#6b6e6d", roughness: 0.95 }),
    [],
  );

  useLayoutEffect(() => {
    const p = panels.current;
    const f = frames.current;
    const po = posts.current;
    const pl = plinths.current;
    if (!p || !f || !po || !pl) return;
    const d = new THREE.Object3D();
    let fi = 0;
    const frame = (x: number, y: number, sx: number, sy: number) => {
      d.position.set(x, y, FENCE_Z);
      d.rotation.set(0, 0, 0);
      d.scale.set(sx, sy, 0.05);
      d.updateMatrix();
      f.setMatrixAt(fi++, d.matrix);
    };
    segs.forEach((s, i) => {
      const w = s.x1 - s.x0;
      const cx = (s.x0 + s.x1) / 2;
      const cy = PLINTH_H + PANEL_H / 2;
      d.position.set(cx, cy, FENCE_Z);
      d.rotation.set(0, 0, 0);
      d.scale.set(w, PANEL_H, 1);
      d.updateMatrix();
      p.setMatrixAt(i, d.matrix);
      frame(cx, PLINTH_H + PANEL_H - 0.025, w, 0.05);
      frame(cx, PLINTH_H + 0.025, w, 0.05);
      d.position.set(cx, PLINTH_H / 2, FENCE_Z);
      d.scale.set(w, PLINTH_H, 0.2);
      d.updateMatrix();
      pl.setMatrixAt(i, d.matrix);
    });
    const xs: number[] = [];
    segs.forEach((s) => xs.push(s.x0));
    xs.push(GATE_MIN, GATE_MAX, X_MAX);
    xs.forEach((x, i) => {
      d.position.set(x, PLINTH_H + PANEL_H / 2 + 0.05, FENCE_Z);
      d.rotation.set(0, 0, 0);
      d.scale.set(1, PANEL_H + 0.1, 1);
      d.updateMatrix();
      po.setMatrixAt(i, d.matrix);
    });
    po.count = xs.length;
    p.instanceMatrix.needsUpdate = true;
    f.instanceMatrix.needsUpdate = true;
    po.instanceMatrix.needsUpdate = true;
    pl.instanceMatrix.needsUpdate = true;
  }, [segs]);

  return (
    <group>
      <instancedMesh
        ref={panels}
        args={[panelGeo, panelMat, segs.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={frames}
        args={[frameGeo, metalMat, segs.length * 2]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={posts}
        args={[postGeo, metalMat, segs.length + 3]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={plinths}
        args={[frameGeo, plinthMat, segs.length]}
        frustumCulled={false}
      />
    </group>
  );
}

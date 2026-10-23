import { PerspectiveCamera } from "@react-three/drei";

export default function Camera() {
  return (
    <PerspectiveCamera
      makeDefault
      fov={45}
      near={0.1}
      far={500}
      position={[-30, 18, 40]}
    />
  );
}

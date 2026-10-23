import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Backdrop() {
  const texture = useTexture("/textures/backdrop_overcast.jpg", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.repeat.x = -1;
    texture.offset.x = 1;
  });

  return (
    <mesh position={[5, 33, -3]}>
      <cylinderGeometry
        args={[300, 300, 250, 64, undefined, true, 2.18, 1.92]}
      />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        fog={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

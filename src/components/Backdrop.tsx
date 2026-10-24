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
        args={[300, 300, 190, 64, undefined, true, 1.68, 1.92]}
      />
      <meshBasicMaterial
        map={texture}
        color="#7f889c"
        fog={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

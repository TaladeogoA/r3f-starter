import { OrbitControls } from "@react-three/drei";

export default function Controls() {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      target={[5.4, 8, -3]}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
}

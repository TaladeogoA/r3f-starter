import { useGLTF } from "@react-three/drei";

const URL = "/models/building.glb";

export default function Building() {
  const { scene } = useGLTF(URL);

  return <primitive object={scene} />;
}

useGLTF.preload(URL);

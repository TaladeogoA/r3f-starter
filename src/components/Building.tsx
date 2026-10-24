import { useGLTF } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";

const URL = "/models/building.glb";

export default function Building() {
  const { scene } = useGLTF(URL);

  useLayoutEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload(URL);

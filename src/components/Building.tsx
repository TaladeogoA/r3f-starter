import { useGLTF } from "@react-three/drei";
import { useLayoutEffect } from "react";

const HIDDEN = new Set([
  "cutter_central_well",
  "cutter_lane",
  "prop_fan_tower",
  "prop_tent_popup",
  "prop_chair_plastic",
  "prop_table_folding",
  "prop_vendor_drinks",
  "prop_vendor_snacks",
  "prop_vendor_hot",
]);

const URL = "/models/building.glb";

export default function Building() {
  const { scene } = useGLTF(URL);

  useLayoutEffect(() => {
    scene.traverse((object) => {
      if (HIDDEN.has(object.name)) {
        object.visible = false;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload(URL);

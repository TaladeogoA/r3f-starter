import { Environment as DreiEnvironment } from "@react-three/drei";

export default function Environment() {
  return (
    <DreiEnvironment
      files="/hdr/preller_drive_2k.hdr"
      environmentIntensity={0.1}
    />
  );
}

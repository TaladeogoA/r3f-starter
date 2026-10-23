import Building from "../components/Building";
import Exterior from "../components/Exterior";

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#05060a"]} />

      <Building />
      <Exterior />
    </>
  );
}

export default function Lights() {
  return (
    <>
      <hemisphereLight args={["#8ca8c3", "#1a1612", 0.35]} />
      <directionalLight
        color="#b8c6e0"
        intensity={1.1}
        position={[30, 25, -25]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
      />
    </>
  );
}

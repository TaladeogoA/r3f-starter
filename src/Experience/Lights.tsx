export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 40, 20]} intensity={1.5} />
    </>
  );
}

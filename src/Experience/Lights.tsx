export default function Lights()
{
    return <>
        <ambientLight intensity={0.5} />
        <directionalLight
            castShadow
            position={[4, 6, 4]}
            intensity={2}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-bias={-0.0001}
        />
    </>
}

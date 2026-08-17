import { PerspectiveCamera } from '@react-three/drei'

export default function Camera()
{
    return (
        <PerspectiveCamera
            makeDefault
            fov={45}
            near={0.1}
            far={200}
            position={[4, 3, 6]}
        />
    )
}

import Camera from './Camera'
import Controls from './Controls'
import Environment from './Environment'
import Lights from './Lights'
import Scene from './Scene'

export default function Experience()
{
    return <>
        <Camera />
        <Controls />
        <Lights />
        <Environment />
        <Scene />
    </>
}

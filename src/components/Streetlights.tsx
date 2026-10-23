import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";

const POLE_XS = [-32, -10, 12, 34, 50];
const LIT_CENTER = 5.4;
const LIT_RADIUS = 30;
const POLE_Z = 15.2;
const POLE_H = 8;
const ARM_REACH = 2.4;
const POLE_COLOR = "#aeb2b4";
const LAMP_COLOR = "#ffd9a0";

function Streetlight({ x, lit }: { x: number; lit: boolean }) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, 0, 0),
        new Vector3(0, POLE_H * 0.6, 0),
        new Vector3(0, POLE_H - 0.8, 0),
        new Vector3(0, POLE_H - 0.15, 0.35),
        new Vector3(0, POLE_H + 0.1, 1.1),
        new Vector3(0, POLE_H + 0.12, ARM_REACH),
      ]),
    [],
  );

  return (
    <group position={[x, 0, POLE_Z]}>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.055, 8, false]} />
        <meshStandardMaterial
          color={POLE_COLOR}
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 1, 12]} />
        <meshStandardMaterial
          color={POLE_COLOR}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      <group position={[0, POLE_H + 0.12, ARM_REACH]}>
        <mesh>
          <boxGeometry args={[0.35, 0.1, 0.9]} />
          <meshStandardMaterial
            color={POLE_COLOR}
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
        <mesh position={[0, -0.056, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 0.8]} />
          <meshStandardMaterial
            color="#fff2d6"
            emissive={LAMP_COLOR}
            emissiveIntensity={2.5}
          />
        </mesh>
        {lit && (
          <pointLight
            position={[0, -0.3, 0]}
            color={LAMP_COLOR}
            intensity={200}
            distance={30}
            decay={2}
          />
        )}
      </group>
    </group>
  );
}

export default function Streetlights() {
  return (
    <group>
      {POLE_XS.map((x) => (
        <Streetlight
          key={x}
          x={x}
          lit={Math.abs(x - LIT_CENTER) < LIT_RADIUS}
        />
      ))}
    </group>
  );
}

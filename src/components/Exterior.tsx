import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import Backdrop from "./Backdrop";
import BoundaryWall from "./BoundaryWall";
import Fence from "./Fence";

const CENTER_X = 5.4;
const ROAD_START = 14.7;
const ROAD_WIDTH = 14.5;
const ROAD_TILE = 6;
const ROAD_LENGTH = 200;
const CONCRETE_WIDTH = 80;
const CONCRETE_DEPTH = 50;
const CONCRETE_TILE = 12.5;
const DUST_WIDTH = 3.2;

export default function Exterior() {
  const concreteNor = useTexture("/textures/concrete/nor.jpg", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(
      CONCRETE_WIDTH / CONCRETE_TILE,
      CONCRETE_DEPTH / CONCRETE_TILE,
    );
  });
  const concreteRough = useTexture(
    "/textures/concrete/rough.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(
        CONCRETE_WIDTH / CONCRETE_TILE,
        CONCRETE_DEPTH / CONCRETE_TILE,
      );
    },
  );
  const concreteDiff = useTexture("/textures/concrete/diff.jpg", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(
      CONCRETE_WIDTH / CONCRETE_TILE,
      CONCRETE_DEPTH / CONCRETE_TILE,
    );
  });

  const asphaltNor = useTexture("/textures/asphalt/nor.jpg", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(ROAD_LENGTH / ROAD_TILE, ROAD_WIDTH / ROAD_TILE);
  });

  const asphaltRough = useTexture("/textures/asphalt/rough.jpg", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(ROAD_LENGTH / ROAD_TILE, ROAD_WIDTH / ROAD_TILE);
  });

  const asphaltDiff = useTexture("/textures/asphalt/diff.jpg", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(ROAD_LENGTH / ROAD_TILE, ROAD_WIDTH / ROAD_TILE);
  });

  const dustMap = useTexture("/textures/dust_fade.png", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(ROAD_LENGTH / 40, 1);
  });

  return (
    <group>
      <Backdrop />
      <fog attach="fog" args={["#101217", 45, 160]} />

      <mesh rotation-x={-Math.PI / 2} position-y={-0.1} position-x={CENTER_X}>
        <planeGeometry args={[CONCRETE_WIDTH, CONCRETE_DEPTH]} />
        <meshStandardMaterial
          map={concreteDiff}
          normalMap={concreteNor}
          roughnessMap={concreteRough}
          roughness={1}
        />
      </mesh>

      {/* Aphalt Road */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[CENTER_X, 0, ROAD_START + ROAD_WIDTH / 2]}
      >
        <planeGeometry args={[ROAD_LENGTH, ROAD_WIDTH]} />
        <meshStandardMaterial
          map={asphaltDiff}
          normalMap={asphaltNor}
          roughnessMap={asphaltRough}
          roughness={0.95}
        />
      </mesh>

      {/* Dust */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, ROAD_START + DUST_WIDTH / 2]}
      >
        <planeGeometry args={[ROAD_LENGTH, DUST_WIDTH]} />
        <meshStandardMaterial
          color="#b8aa94"
          transparent
          depthWrite={false}
          polygonOffset={true}
          opacity={0.8}
          alphaMap={dustMap}
        />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI]}
        position={[0, 0.012, ROAD_START + ROAD_WIDTH - DUST_WIDTH / 2]}
      >
        <planeGeometry args={[ROAD_LENGTH, DUST_WIDTH]} />
        <meshStandardMaterial
          color="#b8aa94"
          transparent
          depthWrite={false}
          polygonOffset={true}
          opacity={0.7}
          alphaMap={dustMap}
        />
      </mesh>
      <Fence />
      <BoundaryWall />
    </group>
  );
}

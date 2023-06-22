import { useRef, useState ,useEffect} from 'react'
import { Canvas, useFrame,useThree,useLoader } from '@react-three/fiber'
import { RenderTexture, OrbitControls, PerspectiveCamera, Text, ContactShadows,Float } from '@react-three/drei'
// import {TextureScene} from "./projetBouf"
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
export default function App() {
  return (
    <div
    style={{
        height:"100vh"
    }}
    >
    <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Cube />
      <Dodecahedron position={[0, 1, 0]} scale={0.2} />
      <ContactShadows frames={1} position={[0, -0.5, 0]} blur={1} opacity={0.75} />
      <ContactShadows frames={1} position={[0, -0.5, 0]} blur={3} color="orange" />
      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
    </div>
  )
}

function Cube() {
  const textRef = useRef()
//   useFrame((state) => (textRef.current.position.x = Math.sin(state.clock.elapsedTime) * 2))

var viewport = useThree((state) => state.viewport);

  return (
    <mesh  scale={[viewport.width, viewport.height, viewport.width]}>
      <boxGeometry />
      <meshStandardMaterial>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera far={100} makeDefault manual aspect={1 / 1} position={[0, 0,80]} />
          <color attach="background" args={['orange']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          {/* <Text ref={textRef} fontSize={4} color="#555">
            hello
          </Text> */}
          <TextureScene />
          {/* <Dodecahedron /> */}
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  )
}

function Dodecahedron(props) {
  const meshRef = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame(() => (meshRef.current.rotation.x += 0.01))
  return (
    <group {...props}>
      <mesh
        ref={meshRef}
        scale={clicked ? 1.5 : 1}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}>
        <dodecahedronGeometry args={[0.75]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#5de4c7'} />
      </mesh>
    </group>
  )
}

function TextureScene() {
  useFrame((state) => {
    // state.camera.position.z =
    // 20 + Math.sin(state.clock.getElapsedTime() * 0.5) * 3;
    // state.camera.position.x =
    // Math.sin(state.clock.getElapsedTime() * 0.5) * 3;
    // state.camera.position.y =
    // Math.sin(state.clock.getElapsedTime() * 0.5) * 3;
    // state.camera.position.x =0
    // state.camera.position.y =0
    if (state.clock.elapsedTime % 5 < 1) {
      // console.log(state.camera.position);
    }
  });
  return (
    <>
      {/* <Effect2 progress={pA.progress} /> */}
      
      {/* <PerspectiveCamera makeDefault manual aspect={1 / 3} position={[0, 0, 10]} /> */}
      {/* <axesHelper /> */}
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={45} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {/* <Cuube position={[100,0,-20]}  img_adress="mushrooms.jpg"/> */}
      <Cuube position={[0,0,-20]} img_adress="nature_morte.jpg"/>
      {/* <Sparkles /> */}
      {/* <ShootingStar /> */}
      {/* <OrbitControls /> */}
    </>
  );
}

export function Cuube({img_adress,position}) {
  const ref = useRef();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  var viewport = useThree((state) => state.viewport);

  useFrame(({ clock, camera }) => {
    // mouseTarget.current.x = lerp(mouse.current.x, 0, 0.5);
    // mouseTarget.current.y = lerp(mouse.current.y, 0, 0.5);
    // ref.current.rotation.x += -mouseTarget.current.x * 0.001;
    // ref.current.rotation.y += -mouseTarget.current.y * 0.001;

    // ref.current.rotation.x = -mouseTarget.current.x * 0.001;
    // ref.current.rotation.y = -mouseTarget.current.y * 0.001;

    // ref.current.position.x=Math.cos(clock.elapsedTime)
    // ref.current.position.y=Math.cos(clock.elapsedTime)
    // console.log(camera.position);
  });

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      mouse.current.x = event.movementY - 0.5;
      mouse.current.y = event.movementX - 0.5;
    });
  });

  const image = useLoader(THREE.TextureLoader, img_adress);

  const image_size = [1024 / 10, 742 / 10];

  const mask = useLoader(THREE.TextureLoader, "mask5.jpg");

  return (
    <Float>
      <group position={position} ref={ref}>
        <Text
          scale={[3, 3, 3]}
          anchorX="center" // default
          anchorY="middle" // default
          color="red"
          toneMapped={false}
          position={[0, 0, 4]}
          font={"Harmond-ExtraBoldExpanded.otf"}
        >
          Hello
        </Text>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <meshStandardMaterial map={image} transparent />
        </mesh>

        <mesh position={[0, 0, 2]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <meshStandardMaterial alphaMap={mask} map={image} transparent />
        </mesh>

        <mesh position={[0, 0, 3]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <meshStandardMaterial alphaMap={mask} map={image} transparent />
        </mesh>

        <mesh position={[0, 0, 4]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <meshStandardMaterial alphaMap={mask} map={image} transparent />
        </mesh>

        <mesh position={[0, 0, 5]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <meshStandardMaterial alphaMap={mask} map={image} transparent />
        </mesh>

        <mesh position={[0, 0, 6]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <meshStandardMaterial alphaMap={mask} map={image} transparent />
        </mesh>
      </group>
     </Float>
  );
}

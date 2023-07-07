import dynamic from "next/dynamic";

import * as THREE from "three";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { useEffect, useRef, useMemo, useState } from "react";
// import { Debug, Physics, usePlane, useSphere } from "@react-three/cannon";
import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import {
  postprocessing,
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import { GLSL } from "gl-react";
import { lerp, damp } from "three/src/math/MathUtils";
import { useControls } from "leva";

import {
  OrbitControls,
  Text,
  shaderMaterial,
  PerspectiveCamera,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";

function Home() {
  //   u_normal.colorSpace = THREE.SRGBColorSpace;

  //   const u_diffuse = useLoader(THREE.TextureLoader, "nature_morte.jpg");
  //   u_diffuse.colorSpace = THREE.SRGBColorSpace;

  //   const u_reflection = useLoader(THREE.TextureLoader, "mushrooms.jpg");
  //   u_reflection.colorSpace = THREE.SRGBColorSpace;

  return (
    <div
      style={{
        background: "black",
        height: "100vh",
        width: "100vw",
        position: "fixed",
      }}
    >
      <Canvas
        gl={{ antialias: false }}
        camera={{
          near: 0.1,
          far: 20000,
          zoom: 1,
          position: [0, 0, 3],
          maxPolarAngle: 0.85,
        }}
      >
        <ambientLight intensity={3} />
        <spotLight position={[10, 10, 10]} angle={45} penumbra={0} />
        <Forme />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function Forme() {
  const u_normal = useLoader(THREE.TextureLoader, "normal.jpg");
  u_normal.colorSpace = THREE.SRGBColorSpace;
  const u_diffuse = useLoader(THREE.TextureLoader, "nature_morte.jpg");
  u_diffuse.colorSpace = THREE.SRGBColorSpace;

  const u_reflection = useLoader(THREE.TextureLoader, "mushrooms.jpg");
  u_reflection.colorSpace = THREE.SRGBColorSpace;
  return (
    <>
      <mesh position={[0, 0, 2]}>
        <planeGeometry args={[1, 1, 32]} />
        <waveShaderMaterial2
          color={"blue"}
          u_normal={u_normal}
          u_diffuse={u_diffuse}
          u_reflection={u_reflection}
          scrollOffset={0.0}
          refractionAmount={0.1}
        />
        {/* <waveShaderMaterial color={"blue"} /> */}
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1, 1, 32]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    </>
  );
}
const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    prout: 0,
    uAlphaMap: new THREE.Texture(),
    fond: false,
    camera_x: 0,
    compteurCycle: 0,
  },
  GLSL`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  GLSL`

precision mediump float;


  void main() {


    gl_FragColor = vec4(1.0,0.,1.,1.);;
  }`
);

extend({ WaveShaderMaterial });

const WaveShaderMaterial2 = shaderMaterial(
  {
    u_normal: new THREE.Texture(),
    u_diffuse: new THREE.Texture(),
    u_reflection: new THREE.Texture(),
    scrollOffset: 0.1,
    refractionAmount: 0.1,
  },
  GLSL`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  GLSL`
precision mediump float;
  uniform float scrollOffset;
  uniform float refractionAmount;

  // our textures
  uniform sampler2D u_normal;
  uniform sampler2D u_diffuse;
  uniform sampler2D u_reflection;

  // varying vec2 v_texCoord;
  varying vec2 vUv;

  void main() {
    vec4 diffuse = texture2D(u_diffuse, vUv);
    vec4 normal = texture2D(u_normal, vUv);

    float u = normal.r * 16.0;
    float v = normal.g * 16.0;
    u += floor(normal.b * 16.0) * 16.0;
    v += mod(normal.b * 255.0, 16.0) * 16.0;
    u = u / 255.0;
    v = v / 255.0;

    vec2 p = vec2(u, v + scrollOffset);
    vec4 reflect = texture2D(u_reflection, p);
    reflect.a = normal.a;

    // vec4 col = mix(diffuse, reflect, normal.a - diffuse.a);
    vec4 col = mix(reflect, diffuse, 0.5);
    // col.a += normal.a;

    gl_FragColor = diffuse;
  }
  
  `
);

extend({ WaveShaderMaterial2 });

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

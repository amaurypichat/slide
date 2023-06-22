import * as THREE from "three";
import { useRef, useMemo, Suspense, useEffect } from "react";
import {
  Canvas,
  useFrame,
  createPortal,
  extend,
  useThree,
} from "@react-three/fiber";
import {
  useFBO,
  PerspectiveCamera,
  OrthographicCamera,
  OrbitControls,
  shaderMaterial,
  useLoader,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import glsl from "babel-plugin-glsl/macro";
// import { Perf } from "r3f-perf";

import { TextureScene } from "./projetBouf";
function TextureScene2() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.x =
      mesh.current.rotation.y =
      mesh.current.rotation.z +=
        0.01;
  });
  return (
    <mesh ref={mesh}>
      <boxBufferGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}

const WaveShaderMaterial = shaderMaterial(
  { uTime: 0, uTexture: new THREE.Texture(), prout: 0 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    precision mediump float;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float prout; 

    varying vec2 vUv;

    void main() {
      vec2 uv=vUv;
      if (uv.x < (.25 + (prout/ 10.))){
        uv.x=uv.x+0.1;
      }

      else if (uv.x < (.5 + (prout/ 10.))){
        uv.x=uv.x-0.2;
      }

      else if (uv.x < (.75 + (prout/ 10.))){
        uv.x=uv.x-0.3;
      }
      // uv=vUv;
      vec3 texture = texture2D(uTexture, uv).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

extend({ WaveShaderMaterial });

const FBOScene = ({ props }) => {
  const target = useFBO(props);
  const cam = useRef();
  const ref2 = useRef();
  const scene = useMemo(() => {
    const scene = new THREE.Scene();
    return scene;
  }, []);

  useFrame((state) => {
    // cam.current.position.z =
    //   20 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
    state.gl.setRenderTarget(target);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
  });

  const shader = useRef();
  var viewport = useThree((state) => state.viewport);
  var cammera = useThree((state) => state.camera);
  // useFrame(({ clock }) => (shader.current.uTime = clock.getElapsedTime()));
  useFrame((state) => {
    shader.current.prout = Math.cos(state.clock.getElapsedTime() / 10);
    shader.current.uTime = state.clock.getElapsedTime();
    if (state.clock.elapsedTime % 10 < 1) {
      // state.camera.position.z=4.5;
      // console.log("meshpos", cam.current.position);
      // console.log("camerapos", state.camera.position);
    }
  });

  useEffect(() => {
    // cammera.position.z=93;
    cam.current.position.z = 93;
  });

  return (
    <>
      <PerspectiveCamera ref={cam} position={[0, 0, 20]} />
      {/* <OrbitControls /> */}
      {/* <OrthographicCamera ref={cam} makeDefault position={[0, 0, 20]} /> */}
      {createPortal(<TextureScene />
      
      , scene)}
      <mesh ref={ref2} scale={[viewport.width, viewport.height, 1]}>
        <planeBufferGeometry args={[2, 2]} />
        <waveShaderMaterial ref={shader} uTexture={target.texture} />
      </mesh>
    </>
  );
};

export default function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Canvas>
        <OrbitControls position={[0, 0, 4.5]}/>
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} />
        </EffectComposer>
        <Suspense fallback={null}>
          <FBOScene
            multisample
            samples={8}
            stencilBuffer={false}
            format={THREE.RGBFormat}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

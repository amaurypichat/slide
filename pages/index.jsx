import dynamic from "next/dynamic";
import * as THREE from "three";

import {
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
  Tube,
} from "@react-three/fiber";
import {  GLSL } from "gl-react";
import { lerp, damp } from "three/src/math/MathUtils";
import { useControls } from "leva";
import MyShaderPass from "component_landingpage/shaderpass";

import {
  OrbitControls,
  Text,
  Trail,
  shaderMaterial,
  PerspectiveCamera,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";

import { VFXSpan } from "react-vfx";
import PostFX from "component_landingpage/PostFX";

function Effect2(progress) {
  const { gl, scene, camera, size } = useThree();
  // const renderer = new PostFX(gl);
  let progress_old = null;
  const post_old = null;
  return useFrame(({ clock }) => {
    // deltaSomme += delta;
    // renderer.render(scene, camera);
    const post = new PostFX(gl, 0.1);
    post.render(scene, camera);
    // if (post_old==null){
    //   post_old=post
    // }else{
    //   post_old.delete()
    // }
    // if (progress_old != progress) {
    // progress_old=progress
    // renderer.setProgress(progress);
    // } else {

    // }
  }, 1);
}

extend(MyShaderPass);

function Home() {
  const intensity = 0.1;
  const radius = 0.9;
  const luminanceThreshold = 1;
  const luminanceSmoothing = 1;
  // var OrbitControls;
  const options = useMemo(() => {
    return {
      progress: { value: 0, min: 0, max: 1, step: 0.1 },
      z: { value: 10, min: 0, max: 20, step: 1 },
      maxpolarangle: { value: 0.85, min: 0, max: 1, step: 0.01 },
      x: { value: 0, min: 0, max: 50, step: 10 },
    };
  }, []);



  const pA = useControls("Progress", options);

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
          position: [pA.x, 0, pA.z],
          maxPolarAngle: 0.85,
        }}
      >

          <TextureScene pA={pA} />
      </Canvas>
      ghfgh
    </div>
  );
}

export function EnsembleImage({ img_adress, position }) {
  const ref = useRef();
  const shader = useRef();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  const CycleModulo = useRef();

  const couche1 = useRef();

  const couche2 = useRef();

  const couche3 = useRef();

  var viewport = useThree((state) => state.viewport);

  useFrame(({ clock, camera }) => {
    mouseTarget.current.x = -lerp(mouse.current.y, 0, 0.3);
    mouseTarget.current.y = -lerp(mouse.current.x, 0, 0.3);
    ref.current.rotation.x = -mouseTarget.current.x * 0.1;
    ref.current.rotation.y = -mouseTarget.current.y * 0.1;

    // shader.current.uTime;

    // ref.current.rotation.x = -mouseTarget.current.x * 0.001;
    // ref.current.rotation.y = -mouseTarget.current.y * 0.001;

    // ref.current.position.x=Math.cos(clock.elapsedTime)
    // ref.current.position.y=Math.cos(clock.elapsedTime)
    // console.log(mouseTarget.current);
  });

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      mouse.current.x = lerp(mouse.current.x, event.clientX / window.screen.width, 0.3); 
      mouse.current.y = lerp(mouse.current.y, event.clientY / window.screen.width, 0.3); 
    });
  });

  useFrame((state) => {
    // shader.current.prout = Math.cos(state.clock.getElapsedTime() / 10);
    // shader.current.uTime = state.clock.getElapsedTime();

    CycleModulo.current = (state.clock.elapsedTime % 10) / 10;

    // couche1.current.position.z =
    //   4 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    // couche2.current.position.z =
    //   8 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    // couche3.current.position.z =
    //   12 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    if (state.clock.elapsedTime % 10 < 1) {
      // state.camera.position.z=4.5;
      // console.log("meshpos", cam.current.position);
      // console.log("camerapos", state.camera.position);
    }
  });

  const image = useLoader(THREE.TextureLoader, img_adress);

  const image_size = [1024 / 10, 742 / 10];

  const mask = useLoader(THREE.TextureLoader, "mask5.jpg");

  return (
    <group position={position} ref={ref}>
      <Text
        scale={[3, 3, 3]}
        anchorX="center" // default
        anchorY="middle" // default
        color="red"
        toneMapped={false}
        position={[0, 0, 8]}
        font={"Harmond-ExtraBoldExpanded.otf"}
      >
        Hello
      </Text>
      {/* <mesh position={[0, 0, 0]} >
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial map={image} transparent />
      </mesh> */}

      <mesh ref={couche1} position={[0, 0, 4]} >
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader}
          // alphaMap={mask}
          map={image}
          uTexture={image}
          transparent
          // lights="true"
        />
      </mesh>

      <mesh ref={couche2} position={[0, 0, 8]} >
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial alphaMap={mask} map={image} transparent />

      </mesh>

      <mesh ref={couche3} position={[0, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial alphaMap={mask} map={image} transparent />
      </mesh> 
    </group>
  );
}



const WaveShaderMaterial = shaderMaterial(
  { uTime: 0, uTexture: new THREE.Texture(), prout: 0 },
  GLSL`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  GLSL`
    precision mediump float;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float prout; 

    varying vec2 vUv;

    float A;

    float Reste;
    float ambientStrength = 0.1;

    #define PI 3.1415926538

    vec2 SineWave( vec2 p, float A ){
      float pi = 3.14159;
      // float A = 0.50;
      float w = 10.0 * pi;
      float t = 30.0*pi/180.0;
      float y = sin( w*p.x + t) * A; 
      return vec2(p.x, p.y+y);
  }

    void main() {
      vec2 uv=vUv;

      Reste=uTime - 10. * floor(uTime/10.);

      A=0.;
      if (Reste>7.){
        A=0.5*sin(PI* (Reste-7.) / 3.);
      }

      if ( (uTime - 10. * floor(uTime/10.)) >10.){
        if (uv.x < (.3  )){
          uv.x=uv.x+0.1;
        }

        else if (uv.x < (.6  )){
          uv.x=uv.x+0.3;
        }

        else if (uv.x < (.9  )){
          uv.x=uv.x+0.1;
        }
    }

    if ( (uTime - 10. * floor(uTime/10.)) > 7.){

      // uv.x+=0.1 * sin(10.*uv.x);
      // uv = SineWave( uv,A ); 

    }


    // uv=vUv;
      vec3 texture = texture2D(uTexture, uv).rgb;
      // texture.r+=0.1;
      // texture.g+=0.1;
      // texture.b+=0.1;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

extend({ WaveShaderMaterial });

export function TextureScene({ pA }) {
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
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={45} penumbra={0} />

      <EnsembleImage position={[0, 0, -20]} img_adress="nature_morte.jpg" />
      {/* <ShootingStar /> */}
      <OrbitControls />
    </>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

import dynamic from "next/dynamic";
import * as THREE from "three";

import { useEffect, useRef, useMemo, useState } from "react";
import { Debug, Physics, usePlane, useSphere } from "@react-three/cannon";
import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import { GLSL } from "gl-react";
import { lerp, damp } from "three/src/math/MathUtils";
import { useControls } from "leva";

// import MyShaderPass from "component_landingpage/shaderpass";

import {
  OrbitControls,
  Text,
  shaderMaterial,
  PerspectiveCamera,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";

function Cyl({ rotation, length, position }) {
  return (
    <mesh rotation={rotation} position={position}>
      <cylinderGeometry args={[0.01, 0.01, length, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

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
          position: [pA.x, 0, 20],
          maxPolarAngle: 0.85,
        }}
        // dpr={[1, 2]}
      >
        <TextureScene pA={pA} />
      </Canvas>
    </div>
  );
}

export function EnsembleImage({ img_adress, position, camera_x }) {
  const ref = useRef();
  const shader2 = useRef();
  const shader3 = useRef();
  const shader = useRef();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  const CycleModulo = useRef();

  const compteurCycle = useRef(0);

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
      mouse.current.x = lerp(
        mouse.current.x,
        event.clientX / window.screen.width,
        0.3
      );
      mouse.current.y = lerp(
        mouse.current.y,
        event.clientY / window.screen.width,
        0.3
      );
    });
  });

  useFrame((state, delta) => {
    // shader.current.prout = Math.cos(state.clock.getElapsedTime() / 10);
    shader.current.uTime = state.clock.getElapsedTime();
    shader2.current.uTime = state.clock.getElapsedTime();
    shader3.current.uTime = state.clock.getElapsedTime();

    CycleModulo.current = (state.clock.elapsedTime % 10) / 10;

    if (
      state.clock.elapsedTime % 10 > 7 &&
      (state.clock.elapsedTime - delta) % 10 < 7
    ) {
      compteurCycle.current += 1;
      // console.log("aa", compteurCycle.current);
    }

    couche1.current.position.z =
      4 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche2.current.position.z =
      8 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche3.current.position.z =
      12 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    state.camera.position.y =
      5 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 20);

    state.camera.lookAt(
      0,
      5 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 20),
      0
    );

    if (state.clock.elapsedTime % 10 < 1) {
      // console.log("meshpos", cam.current.position);
      // console.log("camerapos", state.camera.position);
    }
  });

  const image = useLoader(THREE.TextureLoader, img_adress);
  image.colorSpace = THREE.SRGBColorSpace;

  const image2 = useLoader(THREE.TextureLoader, "mushrooms.jpg");
  image2.colorSpace = THREE.SRGBColorSpace;

  const image_size = [1024 / 10, 742 / 10];

  const mask = useLoader(THREE.TextureLoader, "mask5.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  // const siteExemple = useLoader(THREE.TextureLoader, "SiteExemple.JPG");
  // siteExemple.colorSpace = THREE.SRGBColorSpace;

  // const sitePlanete = useLoader(THREE.TextureLoader, "SitePlanete.JPG");
  // sitePlanete.colorSpace = THREE.SRGBColorSpace;

  // const siteAgap2 = useLoader(THREE.TextureLoader, "agap2.JPG");
  // siteAgap2.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position} ref={ref}>
      <Physics allowSleep={false} gravity={[0, 0, 0]}>
        <Ttext />
      </Physics>
      {/* <mesh position={[0, 0, 0]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial map={image} transparent />
      </mesh> */}

      <mesh ref={couche1} position={[0, 0, 4]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader2}
          uAlphaMap={mask}
          map={image}
          // map2={image2}
          uTexture={image}
          transparent
          fond={true}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
        />
      </mesh>

      <mesh ref={couche2} position={[0, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader3}
          uAlphaMap={mask}
          map={image}
          // map2={image2}
          uTexture={image}
          transparent
          fond={false}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
        />
      </mesh>

      <mesh ref={couche3} position={[0, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader}
          uAlphaMap={mask}
          map={image}
          // map2={image2}
          uTexture={image}
          transparent
          fond={false}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
        />
      </mesh>

      {/* <mesh ref={couche2} position={[0, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader2}
          uAlphaMap={mask}
          map={image}
          // map2={image2}
          uTexture={image}
          transparent
          // lights="true"
          toneMapped={false}
          fond={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
        />
      </mesh>

      <mesh ref={couche3} position={[0, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader3}
          uAlphaMap={mask}
          map={image}
          // map2={image2}
          uTexture={image}
          transparent
          // lights="true"
          toneMapped={false}
          fond={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
        />
      </mesh> */}

      {/* <mesh ref={couche1} position={[102, 0, 4]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader}
          alphaMap={mask}
          map={image2}
          // map2={image2}
          uTexture={image2}
          transparent
          // lights="true"
          toneMapped={false}
        />
      </mesh> */}

      {/* <mesh ref={couche2} position={[0, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial alphaMap={mask} map={image} transparent />
      </mesh>

      <mesh ref={couche3} position={[0, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial alphaMap={mask} map={image} transparent />
      </mesh> */}
      {/*
      <mesh ref={couche2} position={[102, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial alphaMap={mask} map={image2} transparent />
      </mesh>

      <mesh ref={couche3} position={[102, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <meshStandardMaterial alphaMap={mask} map={image2} transparent />
      </mesh> */}
    </group>
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
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform sampler2D uAlphaMap;
    uniform vec3 uColor;
    uniform float prout; 
    uniform bool fond;
    uniform float camera_x;
    uniform float compteurCycle;
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
      vec2 uv;
      
      uv.y=vUv.y;
      
      // uv.x=vUv.x * 1024. / 1280.;
      
      // if (mod(floor(uTime/10.),2.0)==0.0 && floor(uTime/10.)>=2.0 ){
      //   uv.x=vUv.x * 0.33 + 0.66;
      // }else if (mod(floor(uTime/10.),1.0)==0.0 && floor(uTime/10.)>=1.0 ){
      //   uv.x=vUv.x * 0.33 + 0.33;
      // }else{
      //   uv.x=vUv.x * 0.33;
      // }
      
      if (mod(floor(uTime/10.) - 1.,2.0)==0.0 && floor(uTime/10.)>=1.0 ){
        uv.x=vUv.x * 0.5 + 0.5;
      // }else if (mod(floor(uTime/10.),1.0)==0.0 && floor(uTime/10.)>=1.0 ){
      //   uv.x=vUv.x * 0.33 + 0.33;
      }else{
        uv.x=vUv.x * 0.5;
      }

      Reste=uTime - 10. * floor(uTime/10.);

      A=0.;
      if (Reste>7.){
        A=0.5 * sin(PI* (Reste-7.) / 3.);
      }
      
      // if (uv.x<0.5){
      //   uv.x=uv.x + 0.3;
      // }

    //   if ( (uTime - 10. * floor(uTime/10.)) >6.){
    //     if (uv.x < (.3  )){
    //       uv.x=uv.x+0.1;
    //     }

    //     else if (uv.x < (.6  )){
    //       uv.x=uv.x+0.3;
    //     }

    //     else if (uv.x < (.9  )){
    //       uv.x=uv.x+0.1;
    //     }
    // }
    
    

    if ( uTime - 10. * floor(uTime/10.) > 7.){
      
      uv = SineWave( uv,A ); 
      
      // uv.x=uv.x+(Reste - 7. ) *.33/3.;

      if (mod(floor(uTime/10.),2.0)==0.0 && floor(uTime/10.)>=2.0 ){
        // uv.x=vUv.x * 0.33 + 0.66;
      uv.x=uv.x-(Reste - 7. ) *.5/3.;
      }
      else{
        uv.x=uv.x +(Reste - 7. ) *.5/3.;
      }
     
    }
    
    // if ( uTime - 10. * floor(uTime/10.) > 2. ){
      
    //       if (uv.x < (.15  )){
    //       uv.x=uv.x+0.1;
    //     }

    //     else if (uv.x < (.4  )){
    //       uv.x=uv.x-0.1;
    //     }

    //     else if (uv.x < (.5  )){
    //       uv.x=uv.x-0.2;
    //     }
     
    // }
      
    


    // uv=vUv;
      vec3 texture = texture2D(uTexture, uv).rgb;
      float alpha=1.;
      if (((vUv.x - .5) * (vUv.x - .5) + (vUv.y - .5)*(vUv.y - .5)) <.2){
        alpha=0.;
      }
      float d = sqrt(dot(vUv - vec2(.5,.5),vUv - vec2(.5,.5)));
      float t2 = smoothstep(.3, .3+0.1, d);
      if (fond==true){
        t2=1.;
      }
      
      alpha=smoothstep(0.,1.,(vUv.x - .5) * (vUv.x - .5) + (vUv.y - .5)*(vUv.y - .5));

      gl_FragColor = vec4(texture, t2);
      #include <tonemapping_fragment>
#include <encodings_fragment>
    }
  `
);

extend({ WaveShaderMaterial });

export function TextureScene({ pA }) {
  // const camera_x = useRef(0);
  var camera_x;
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

    if (state.clock.elapsedTime > 10 && state.camera.position.x < 100) {
      // console.log(state.camera);
      // state.camera.position.x += 0.1;
      // state.camera.lookAt(state.camera.position.x + 0.1, 0, 0);
    }
    camera_x = state.camera.position.x;
    // state.camera.lookAt(state.camera.position.x, 0, 0);
    // console.log(camera_x);
  });
  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={45} penumbra={0} />

      <EnsembleImage
        position={[0, 0, -20]}
        img_adress="concat2.jpg"
        camera_x={camera_x}
      />
      {/* <EnsembleImage
        position={[102, 0, -20]}
        img_adress="mushrooms.jpg"
        camera_x={camera_x}
      /> */}
      <Cyl rotation={[0, 0, Math.PI / 4]} position={[25, 0, 2]} length={50} />

      <Cyl
        rotation={[0, 0, 0.1 + (3 * Math.PI) / 4]}
        position={[-25, 0, 2]}
        length={50}
      />

      <Cyl
        rotation={[0, Math.PI / 4, 0.1 + Math.PI / 2]}
        position={[-25, 0, 2]}
        length={50}
      />

      <Cyl
        rotation={[0, -Math.PI / 2, 0.1 + Math.PI / 2]}
        position={[25, 0, 2]}
        length={50}
      />
      {/* <ShootingStar /> */}
      {/* <OrbitControls /> */}
    </>
  );
}

function Ttext() {
  const y = useRef(0);
  const reftext = useRef();

  let mouseTarget = useRef({ y: 0 });

  useFrame((state) => {
    reftext.current.position.y = lerp(
      reftext.current.position.y,
      mouseTarget.current.y,
      0.3
    );
  });


  useEffect(() => {
    addEventListener("wheel", (event) => {

      mouseTarget.current.y += event.deltaY / 100;

    });
  });

  return (
    <Text
      ref={reftext}
      scale={[3, 3, 3]}
      anchorX="center" // default
      anchorY="middle" // default
      color="white"
      toneMapped={false}
      position={[0, 5, 8]}
      font={"Harmond-ExtraBoldExpanded.otf"}
    >
      Hello
    </Text>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

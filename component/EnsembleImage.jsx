import {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useLayoutEffect,
} from "react";

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import WaveShaderMaterial from "../component/shader";
extend({ WaveShaderMaterial });
import {
  Text,
  Text3D,
  shaderMaterial,
  PerspectiveCamera,
  AdaptiveDpr,
  PerformanceMonitor,
  FontData,
} from "@react-three/drei";
import * as THREE from "three";
import { lerp, damp } from "three/src/math/MathUtils";
import { Physics } from "@react-three/cannon";
export default function EnsembleImage({ position, camera_x }) {
  const ref = useRef();
  const shader2 = useRef();
  const shader3 = useRef();
  const shader = useRef();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  // const CycleModulo = useRef(1);

  const compteurCycle = useRef(1);

  const couche1 = useRef();

  const couche2 = useRef();

  const couche3 = useRef();

  const couche1_bis = useRef();

  const couche2_bis = useRef();

  const couche3_bis = useRef();

  const listeRef = [couche1, couche2, couche3, couche3_bis];

  var viewport = useThree((state) => state.viewport);

  const start = useRef(false);

  let delayClock=0

  useFrame(({ clock, camera }) => {
    mouseTarget.current.x = -lerp(mouse.current.y, 0, 0.3);
    mouseTarget.current.y = -lerp(mouse.current.x, 0, 0.3);
    ref.current.rotation.x = -mouseTarget.current.x * 0.1;
    ref.current.rotation.y = -mouseTarget.current.y * 0.1;
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
        event.clientY / window.screen.height,
        0.3
      );
    });

    for (let i = 0; i < listeRef.length; i++) {
      listeRef[i].current.material.resolution =
        window.innerHeight / window.innerWidth;
    }

    // useEffect(()=>{
      // console.log("EnsembleImage",Date.now() / 1000)
    // })
  });

 

  useFrame((state, delta) => {
    // couche1.current.material.prout = Math.cos(state.clock.getElapsedTime() / 10);

    

    // state.clock.

    // delayClock+=delta

    // if (!start.current){
      // state.clock.stop()
    // }

    // if (state.clock.getElapsedTime()>8 && !start.current ){
      // console.log("rr",state.clock.getElapsedTime())
      // state.clock.start()
      // start.current=true
      // console.log("rr",delayClock)
    // }


    for (let i = 0; i < listeRef.length; i++) {
      listeRef[i].current.material.uTime = state.clock.elapsedTime;
    }
    // couche1.current.material.uTime = state.clock.getElapsedTime();
    // couche2.current.material.uTime = state.clock.getElapsedTime();
    // couche3.current.material.uTime = state.clock.getElapsedTime();
    // couche3_bis.current.material.uTime = state.clock.getElapsedTime();

    // [couche1, couche2, couche3, couche3_bis].forEach((i) => {
    //   i.current.material._resolution = [window.innerWidth, window.innerHeight];
    // });

    if (couche2.current.material.compteurCycle == 0) {
      for (let i = 0; i < listeRef.length; i++) {
        listeRef[i].current.material.compteurCycle = compteurCycle.current;
      }
      // couche1.current.material.compteurCycle = compteurCycle.current;
      // couche2.current.material.compteurCycle = compteurCycle.current;
      // couche3.current.material.compteurCycle = compteurCycle.current;
      // couche3_bis.current.material.compteurCycle = compteurCycle.current;
    }

    if (couche2.current.material.compteurCycle == 3) {
      for (let i = 0; i < listeRef.length; i++) {
        listeRef[i].current.material.uAlphaMap = maskDesert;
      }
      // couche1.current.material.uAlphaMap = maskDesert;
      // couche2.current.material.uAlphaMap = maskDesert;
      // couche3.current.material.uAlphaMap = maskDesert;
      // couche3_bis.current.material.uAlphaMap = maskDesert;
    }

    if (
      Math.floor(state.clock.elapsedTime / 10) !=
      Math.floor((state.clock.elapsedTime - delta) / 10)
    ) {
      if (compteurCycle.current == 3) {
        compteurCycle.current = 1;
      } else {
        compteurCycle.current += 1;
      }

      for (let i = 0; i < listeRef.length; i++) {
        listeRef[i].current.material.compteurCycle = compteurCycle.current;
      }

      // couche1.current.material.compteurCycle = compteurCycle.current;
      // couche2.current.material.compteurCycle = compteurCycle.current;
      // couche3.current.material.compteurCycle = compteurCycle.current;
      // couche3_bis.current.material.compteurCycle = compteurCycle.current;
    }

    // for (let i = 0; i < listeRef.length; i++) {
    //   listeRef[i].current.position.z =
    //   4 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    // }

    // couche1.current.position.z =
    //   4 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche2.current.position.z =
      8 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche3.current.position.z =
      12 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche3_bis.current.position.z =
      12.1 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    state.camera.position.y =
      5 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 20);

    state.camera.lookAt(
      0,
      5 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 20),
      0
    );
  });

  const image = useLoader(THREE.TextureLoader, "/slide/image3.png");
  image.colorSpace = THREE.SRGBColorSpace;

  // const image2 = useLoader(THREE.TextureLoader, "/slide/mushrooms.jpg");
  // image2.colorSpace = THREE.SRGBColorSpace;

  const image_size = [1024 / 10, 742 / 10];

  const mask = useLoader(THREE.TextureLoader, "/slide/mask5.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  const maskDesert = useLoader(THREE.TextureLoader, "/slide/maskDesert.png");
  mask.colorSpace = THREE.SRGBColorSpace;

  const transition_shape = useLoader(THREE.TextureLoader, "/slide/spiral.png");
  mask.colorSpace = THREE.SRGBColorSpace;

  const image2 = useLoader(THREE.TextureLoader, "/slide/ds.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  const map = useLoader(THREE.TextureLoader, "/slide/terrasse.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  const image3 = useLoader(THREE.TextureLoader, "/slide/ds.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  const image1 = useLoader(THREE.TextureLoader, "/slide/nature_morte.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  // const image3 = useLoader(THREE.TextureLoader, "/slide/ds.jpg");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // const transition_shape = useLoader(THREE.TextureLoader, "/slide/spiral.png");
  // mask.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position} ref={ref}>
      <Physics allowSleep={false} gravity={[0, 0, 0]}>
        <Ttext  />
      </Physics>

      <mesh ref={couche1} position={[0, 0, 4]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          // ref={shader2}
          uAlphaMap={image}
          map={image}
          map2={image2}
          image3={image3}
          image1={image1}
          uTexture={image}
          fond={true}
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          color="black"
          filigrane={false}
          _resolution={0.0}
          transition_shape={transition_shape}
        />
      </mesh>

      {/* <mesh ref={couche1_bis} position={[0, 0, 4.1]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <waveShaderMaterial
            // ref={shader2}
            uAlphaMap={image}
            map={image}
            map2={maskDesert}
            uTexture={image}
            fond={true}
            toneMapped={false}
            camera_x={camera_x}
            compteurCycle={compteurCycle.current}
            color="black"
            filigrane={true}
          />
        </mesh> */}

      <mesh ref={couche2} position={[0, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          // ref={shader3}
          uAlphaMap={image}
          map={map}
          map2={image2}
          uTexture={image}
          transparent
          fond={false}
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          filigrane={false}
          color="black"
          _resolution={0.0}
          transition_shape={transition_shape}
          image3={image3}
          image1={image1}
        />
      </mesh>

      {/* <mesh ref={couche2_bis} position={[0, 0, 8.1]}>
          <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
          <waveShaderMaterial
            // ref={shader2}
            uAlphaMap={image}
            map={image}
            map2={maskDesert}
            uTexture={image}
            fond={false}
            toneMapped={false}
            camera_x={camera_x}
            compteurCycle={compteurCycle.current}
            color="black"
            filigrane={true}
          />
        </mesh> */}

      <mesh ref={couche3} position={[0, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          // ref={shader}
          uAlphaMap={image}
          map={map}
          map2={image2}
          uTexture={image}
          transparent
          fond={false}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          filigrane={false}
          color="black"
          _resolution={0.0}
          transition_shape={transition_shape}
          image3={image3}
          image1={image1}
        />
      </mesh>

      <mesh ref={couche3_bis} position={[0, 0, 12.1]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          // ref={shader}
          uAlphaMap={image}
          map={map}
          map2={image2}
          uTexture={image}
          transparent
          fond={false}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          filigrane={true}
          color="black"
          _resolution={0.0}
          transition_shape={transition_shape}
          image3={image3}
          image1={image1}
        />
      </mesh>
    </group>
  );
}

function Ttext() {
  const y = useRef(0);
  const refOldScreenHeight = useRef(0);
  const reftext = useRef();
  const compteurCycle = useRef(1);
  let mouseTarget = useRef({ y: 0 });

  useFrame((state,delta) => {
    reftext.current.position.y = lerp(
      reftext.current.position.y,
      mouseTarget.current.y,
      0.3
    );

    if (
      Math.floor(state.clock.elapsedTime / 10) !=
      Math.floor((state.clock.elapsedTime - delta) / 10)
    ) {
      if (compteurCycle.current == 3) {
        compteurCycle.current = 1;
      } else {
        compteurCycle.current += 1;
      }
    }
    
    if (compteurCycle.current == 3) {
      reftext.current.outlineColor = "black";
    } else {
      reftext.current.outlineColor = "green";
    }


    
  });

  useEffect(() => {
    //max pos du texte => 40
    // moitié ecran défilement site web standard = 30

    const setTargetMouse = (event) => {
      mouseTarget.current.y += event.deltaY / 100;
    };

    window.addEventListener("wheel", setTargetMouse);
  });
  //text position was originaly 5
  return (
    <>
      <Text
        ref={reftext}
        scale={[3, 3, 3]}
        anchorX="center" // default
        anchorY="middle" // default
        color="white"
        toneMapped={false}
        position={[0, 15, 13.2]}
        font={"/slide/Roboto-Regular.ttf"}
        outlineWidth="1%"
        // outlineColor="green"
      >
        Hello
      </Text>
    </>
  );
}

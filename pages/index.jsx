import dynamic from "next/dynamic";
import Head from "next/head";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Html } from "@react-three/drei";
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useLayoutEffect,
  Suspense,
} from "react";

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
// import { GLSL } from "gl-react";
import { lerp, damp } from "three/src/math/MathUtils";
// import { useControls } from "leva";
// import WaveShaderMaterial from "../component/shader2";
import RoundedBoxGeometry from "./../boxgeo.js";
import CookieConsent from "../component/CookieConsent";

import { OrbitControls } from "@react-three/drei";

import EnsembleImage from "@/component/EnsembleImage";

extend({ RoundedBoxGeometry });

const Cyl = forwardRef(({ rotation, length, position }, ref) => (
  <mesh ref={ref} rotation={rotation} position={position}>
    <cylinderGeometry args={[0.03, 0.03, length, 16]} />
    <meshStandardMaterial color="white" />
  </mesh>
));

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

  useEffect(() => {
    var first = true;
    // if (first) {
    //   for (let pas = 0; pas < 110; pas = pas + 1) {
    //     setTimeout(() => {
    //       document.querySelector(".greybar").style.width = pas + "vw";
    //     }, 80 * pas);
    //   }

    //   setTimeout(() => {
    //     document.querySelector(".wrapGreybar").style.display = "none";
    //     document.querySelector("#div_canvas").style.visibility = "visible";
    //     document.querySelector("#menu").style.visibility = "visible";
    //     // document.querySelector("#div_canvas").style.display = "block";
    //   }, 8000);
    // }
  });

  return (
    <>
      {/* <CookieConsent /> */}
      <Head>
        <title>Book A.PICHAT</title>
        <link rel="shortcut icon" href="/slide/favicon.ico" />
      </Head>

      <div
        id="menu"
        className="flex flex-col space-y-1 justify-center fixed top-2 right-2 bg-white rounded-full px-2 m-1 z-50 cursor-pointer"
        style={{
          height: "32px",
          width: "32px",
        }}
      >
        <div
          className="w-full bg-black"
          style={{
            height: "2px",
          }}
        ></div>
        <div
          style={{
            height: "2px",
          }}
          className="w-full bg-black"
        ></div>
        <div
          style={{
            height: "2px",
          }}
          className="w-full bg-black"
        ></div>
      </div>
      <div
        id="div_canvas"
        style={{
          background: "black",
          height: "100vh",
          width: "100vw",
          position: "fixed",
        }}
      >
        <Canvas
          gl={{ antialias: true }}
          camera={{
            near: 0.1,
            far: 20000,
            zoom: 1,
            position: [0, 0, 20],
            maxPolarAngle: 0.85,
          }}
        >
          {/* <Suspense
            fallback={<Html center className="loading" children="Loading..." />}
          > */}
            <TextureScene />
          {/* </Suspense> */}
          {/* <BoxTransparent /> */}
          {/* <Cyl2 /> */}
          {/* <OrbitControls /> */}
        </Canvas>
      </div>
      <div className="wrapGreybar">
        <div className="greybar"></div>
      </div>
    </>
  );
}

function BoxTransparent() {
  const refBox = useRef();
  const options = {
    transmission: 1,
    thickness: 2.2,
    roughness: 0.0,
    envMapIntensity: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.0,
    normalScale: 0,
    clearcoatNormalScale: 3.13,
    normalRepeat: 1,
    bloomThreshold: 0.85,
    bloomStrength: 0.5,
    bloomRadius: 0.33,
  };

  // const normalMapTexture = textureLoader.load("normal.jpg");
  const normalMapTexture = useLoader(THREE.TextureLoader, "normal.jpg");
  const loader = new RGBELoader();

  useFrame((state) => {
    refBox.current.rotation.x += 0.01;
    refBox.current.rotation.y += 0.01;
  });

  const options2 = useMemo(() => {
    return {
      transmission: { value: 0, min: 0, max: 1, step: 0.01 },
      x: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      y: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
      visible: true,
      color: { value: "lime" },
    };
  }, []);

  // const pA = useControls("Polyhedron A", options2);
  // const pB = useControls("Polyhedron B", options2);

  return (
    <>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.85}
          // luminanceSmoothing={luminanceSmoothing}
          // height={300},
          mipmapBlur={true}
          intensity={0.5}
          radius={0.33}
        />
      </EffectComposer>
      <mesh>
        <planeGeometry args={[10, 10, 9]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
      <mesh position={[0, 0, 0]} ref={refBox}>
        <roundedBoxGeometry args={[10, 10, 1, 16, 2]} />
        <meshPhysicalMaterial
          // transmission={pA.transmission}
          // thickness={options.thickness}
          // roughness={options.roughness}
          transmission={0}
          thickness={0}
          roughness={0}
          color="white"
          transparent={true}
          opacity={1}
          // // envMap={hdrEquirect}
          // envMapIntensity={options.envMapIntensity}
          // clearcoat={options.clearcoat}
          // clearcoatRoughness={options.clearcoatRoughness}
          // normalScale={new THREE.Vector2(options.normalScale)}
          // normalMap={normalMapTexture}
          // clearcoatNormalMap={normalMapTexture}
          // clearcoatNormalScale={new THREE.Vector2(options.clearcoatNormalScale)}
          // transparent
        />
      </mesh>
    </>
  );
}

export function TextureScene() {
  // const camera_x = useRef(0);
  var camera_x;
  var tt = null;
  const ref33 = useRef();

  useFrame((state) => {
    // if (state.clock.elapsedTime % 5 < 1) {
    // }

    // if (state.clock.elapsedTime > 10 && state.camera.position.x < 100) {

    // }

    camera_x = state.camera.position.x;
  });

  useEffect(() => {
    console.log(Date.now() / 1000);
  });

  function gaussianRand() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
      rand += Math.random();
    }

    return rand / 6;
  }
  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={45} penumbra={0} />
      {/* <axesHelper args={[5]} /> */}
      <EnsembleImage position={[0, 0, -20]} camera_x={camera_x} />

      {[...Array(3)].map((x, i) => {
        return (
          <>
            <TraitBlanc
              ref={ref33}
              key={Math.random()}
              rotation={[Math.PI * gaussianRand(), Math.PI * gaussianRand(), 0]}
            />
          </>
        );
      })}
    </>
  );
}

const TraitBlanc = forwardRef(({ rotation, position }, ref) => {
  const ref2 = useRef();
  let points = [];
  let direction;
  //vitesse de déplacement
  let speed = 0.1 * (1 + 2 * Math.random());
  //espace entre les deux points
  let llength;
  //espace entre les deux points
  let length = 1 + 5 * Math.random();
  let posCercle = (Math.PI * Math.random()) / 4;

  let centreSphere1 = [
    25 * Math.random(),
    25 * Math.random(),
    25 * Math.random(),
  ];
  // let centreSphere2=[];

  let point2;

  let point1;

  useLayoutEffect(() => {
    Inittt();
  }, []);

  function Inittt() {
    posCercle = (Math.PI * Math.random()) / 4;

    point2 = [
      centreSphere1[0] + 50 * Math.cos(posCercle),
      centreSphere1[1] + 50 * Math.sin(posCercle),
      0,
    ];
    point1 = [
      centreSphere1[0] + 100 * Math.cos(posCercle) * length,
      centreSphere1[1] + 100 * Math.sin(posCercle) * length,
      0,
    ];

    direction = [
      point2[0] - point1[0],
      point2[1] - point1[1],
      point2[2] - point1[2],
    ];

    llength = (direction[0] + direction[1] + direction[2]) / 3;

    direction[0] = speed * (direction[0] / llength);

    direction[1] = speed * (direction[1] / llength);

    direction[2] = speed * (direction[2] / llength);

    points = [
      new THREE.Vector3(point1[0], point1[1], point1[2]),
      new THREE.Vector3(point2[0], point2[1], point2[2]),
    ];
    if (ref2.current) {
      ref2.current.geometry.setFromPoints(points);

      ref2.current.rotation.z = (Math.PI * [2 * Math.random() - 1]) / 4;
    }
  }

  useFrame(() => {
    if (ref2.current) {
      ref2.current.geometry.translate(
        -direction[0],
        -direction[1],
        -direction[2]
      );
    }
  });

  return (
    <line key={Math.random()} ref={ref2}>
      <bufferGeometry attach="geometry" />
      <lineBasicMaterial linewidth="10.0" color="white" />
    </line>
  );
});

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

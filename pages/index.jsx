import dynamic from "next/dynamic";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useLayoutEffect,
} from "react";
import { Debug, Physics, usePlane, useSphere } from "@react-three/cannon";
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
import WaveShaderMaterial from "./shader";
import RoundedBoxGeometry from "./../boxgeo.js";
import CookieConsent from "./CookieConsent";
// import font from "./Monaco.ttf";

import {
  OrbitControls,
  Text,
  Text3D,
  shaderMaterial,
  PerspectiveCamera,
  AdaptiveDpr,
  PerformanceMonitor,
  FontData,
} from "@react-three/drei";

extend({ RoundedBoxGeometry });

// import MyShaderPass from "component_landingpage/shaderpass";

// for (let { a, b } of endPoints) {

//         // stick has length equal to distance between endpoints
//         const distance = a.distanceTo( b )
//         const cylinder = new THREE.CylinderGeometry(stickRadius, stickRadius, distance, stickTesselation.radial, stickTesselation.length)

//         // stick endpoints define the axis of stick alignment
//         const { x:ax, y:ay, z:az } = a
//         const { x:bx, y:by, z:bz } = b
//         const stickAxis = new THREE.Vector3(bx-ax, by-ay, bz-az).normalize()

//         // Use quaternion to rotate cylinder from default to target orientation
//         const quaternion = new THREE.Quaternion()
//         const cylinderUpAxis = new THREE.Vector3( 0, 1, 0 )
//         quaternion.setFromUnitVectors(cylinderUpAxis, stickAxis)
//         cylinder.applyQuaternion(quaternion)

//         // Translate oriented stick to location between endpoints
//         cylinder.translate((bx+ax)/2, (by+ay)/2, (bz+az)/2)

//         // add to geometry list
//         geometries.push(cylinder)

//     }

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

  // const pA = useControls("Progress", options);

  return (
    <>
      <div className="app">
        <h1>Welcome to my website</h1>
        <CookieConsent />
      </div>
      <div
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
          // orthographic
          // dpr={[1, 2]}
        >
          <TextureScene />
          {/* <BoxTransparent /> */}
          {/* <Cyl2 /> */}
          <OrbitControls />
        </Canvas>
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

  // const hdrEquirect = new THREE.RGBELoader().load(
  //   "empty_warehouse_01_2k.hdr",
  //   () => {
  //     hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
  //   }
  // );

  // const hdrEquirect = useLoader(THREE.RGBELoader, "normal.jpg", () => {
  //   hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
  // });

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

export function EnsembleImage({ img_adress, position, camera_x }) {
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

  var viewport = useThree((state) => state.viewport);

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
  });

  useFrame((state, delta) => {
    // shader.current.prout = Math.cos(state.clock.getElapsedTime() / 10);
    shader.current.uTime = state.clock.getElapsedTime();
    shader2.current.uTime = state.clock.getElapsedTime();
    shader3.current.uTime = state.clock.getElapsedTime();
    if (shader.current.compteurCycle == 0) {
      shader.current.compteurCycle = compteurCycle.current;
      shader2.current.compteurCycle = compteurCycle.current;
      shader3.current.compteurCycle = compteurCycle.current;
    }

    if (shader.current.compteurCycle == 3) {
      shader.current.uAlphaMap = maskDesert;
      shader2.current.uAlphaMap = maskDesert;
      shader3.current.uAlphaMap = maskDesert;
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

      shader.current.compteurCycle = compteurCycle.current;
      shader2.current.compteurCycle = compteurCycle.current;
      shader3.current.compteurCycle = compteurCycle.current;
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
  });

  const image = useLoader(THREE.TextureLoader, "concat5.jpg");
  image.colorSpace = THREE.SRGBColorSpace;

  const image2 = useLoader(THREE.TextureLoader, "mushrooms.jpg");
  image2.colorSpace = THREE.SRGBColorSpace;

  const image_size = [1024 / 10, 742 / 10];

  const mask = useLoader(THREE.TextureLoader, "mask5.jpg");
  mask.colorSpace = THREE.SRGBColorSpace;

  const maskDesert = useLoader(THREE.TextureLoader, "maskDesert.png");
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
          uAlphaMap={image}
          map={image}
          map2={maskDesert}
          uTexture={image}
          // transparent
          fond={true}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          color="black"
        />
      </mesh>

      <mesh ref={couche2} position={[0, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          ref={shader3}
          uAlphaMap={image}
          map={image}
          map2={maskDesert}
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
          uAlphaMap={image}
          map={image}
          map2={maskDesert}
          uTexture={image}
          transparent
          fond={false}
          // lights="true"
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
        />
      </mesh>
    </group>
  );
}

extend({ WaveShaderMaterial });

export function TextureScene() {
  // const camera_x = useRef(0);
  var camera_x;
  var tt = null;
  const ref33 = useRef();
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

    //

    // if (ref33.current.isObject3D && !tt) {
    //   tt = new THREE.Vector3();
    //   // ref33.current.getWorldDirection(tt);
    //   const a = new THREE.Vector3(0, 0, 0);
    //   const b = new THREE.Vector3(1, 1, 1);
    //   ref33.current.geometry.setFromPoints(a, b);
    //   // console.log(tt);
    //   console.log("rotation", ref33.current);
    // }

    // console.log("rotation", Math.PI * (1 - gaussianRand()));
    // ref33.current.position.x += 0.1 * tt.x;
    // ref33.current.position.y += 0.1 * tt.y;
    // ref33.current.position.z += 0.1 * tt.z;
    // ref33.current.translateZ(tt.z * 0.01);
    // ref33.current.translateY(tt.y * 0.01);
    // ref33.current.translateX(tt.x * 0.01);
  });

  useEffect(() => {});

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
      <axesHelper />
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
      {/* <Cyl rotation={[0, 0, Math.PI / 4]} position={[25, 0, 2]} length={50} />

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
      /> */}

      {[...Array(3)].map((x, i) => {
        return (
          <>
            {/* <Cyl
            key={Math.random()}
            rotation={[
              Math.PI * (1 - gaussianRand()),
              Math.PI * (1 - gaussianRand()),
              0,
            ]}
            position={[
              10 * Math.cos(2 * Math.PI * Math.random()),
              10 * Math.sin(2 * Math.PI * Math.random()),
              -20,
            ]}
            length={50 * Math.random()}
          /> */}
            {/* <Cyl
            ref={ref33}
            key={Math.random()}
            rotation={[
              Math.PI * (1 - gaussianRand()),
              Math.PI * (1 - gaussianRand()),
              0,
            ]}
            position={[
              30 * Math.cos(2 * Math.PI * Math.random()),
              30 * Math.sin(2 * Math.PI * Math.random()),
              -20,
            ]}
            length={50 * Math.random()}
          /> */}
            {/* <Cyl2
              ref={ref33}
              key={Math.random()}
              rotation={[Math.PI * gaussianRand(), Math.PI * gaussianRand(), 0]}
              length={50 * Math.random()}
            /> */}
            <TraitBlanc
              ref={ref33}
              key={Math.random()}
              rotation={[Math.PI * gaussianRand(), Math.PI * gaussianRand(), 0]}
              length={2 * Math.random()}
            />
          </>
        );
      })}
    </>
  );
}

const Cyl2 = forwardRef(({ rotation, length, position }, ref) => {
  const ref2 = useRef();
  let points = [];
  let direction;
  let speed = 0.005;

  let point1 = [
    30 * Math.cos(2 * Math.PI * Math.random()),
    30 * Math.sin(2 * Math.PI * Math.random()),
    -20,
  ];
  let point2 = [
    30 * Math.cos(2 * Math.PI * Math.random()),
    30 * Math.sin(2 * Math.PI * Math.random()),
    0,
  ];

  useLayoutEffect(() => {
    direction = [
      (point2[0] - point1[0]) * speed,
      (point2[1] - point1[1]) * speed,
      (point2[2] - point1[2]) * speed,
    ];

    // direction = direction * Math.sign(Math.random() - 0.5);
    if (ref2.current) {
      points = [
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2]),
      ];
      ref2.current.geometry.setFromPoints(points);
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      point1 = [
        30 * Math.cos(2 * Math.PI * Math.random()),
        30 * Math.sin(2 * Math.PI * Math.random()),
        -20,
      ];
      point2 = [
        30 * Math.cos(2 * Math.PI * Math.random()),
        30 * Math.sin(2 * Math.PI * Math.random()),
        -40,
      ];

      direction = [
        (point2[0] - point1[0]) * speed,
        (point2[1] - point1[1]) * speed,
        (point2[2] - point1[2]) * speed,
      ];
      //sens aléaoire sur la direction
      // direction = direction * Math.sign(Math.random() - 0.5);

      points = [
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2]),
      ];
      if (ref2.current) {
        ref2.current.geometry.setFromPoints(points);
      }
    }, "5000");
  });

  useFrame(() => {
    if (ref2.current) {
      ref2.current.geometry.translate(direction[0], direction[1], direction[2]);
    }
  });

  return (
    <line ref={ref2}>
      <bufferGeometry attach="geometry" />
      <lineBasicMaterial linewidth="10.0" color="white" />
    </line>
  );
});

const TraitBlanc = forwardRef(({ rotation, length, position }, ref) => {
  const ref2 = useRef();
  let points = [];
  let direction;
  let speed = 0.01;

  let posCercle = (Math.PI * Math.random()) / 4;

  let point2 = [50 * Math.cos(posCercle), 50 * Math.sin(posCercle), 0];
  let point1 = [
    100 * Math.cos(posCercle) * length,
    100 * Math.sin(posCercle) * length,
    0,
  ];

  useLayoutEffect(() => {
    direction = [
      point2[0] - point1[0],
      point2[1] - point1[1],
      point2[2] - point1[2],
    ];

    direction[0] =
      speed *
      ((direction[0] * (direction[0] + direction[1] + direction[2])) / 3);

    direction[1] =
      speed *
      ((direction[1] * (direction[0] + direction[1] + direction[2])) / 3);

    direction[2] =
      speed *
      ((direction[2] * (direction[0] + direction[1] + direction[2])) / 3);

    // direction = direction * Math.sign(Math.random() - 0.5);
    if (ref2.current) {
      points = [
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2]),
      ];
      ref2.current.geometry.setFromPoints(points);
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      posCercle = (Math.PI * Math.random()) / 4;

      point2 = [50 * Math.cos(posCercle), 50 * Math.sin(posCercle), 0];
      point1 = [
        100 * Math.cos(posCercle) * length,
        100 * Math.sin(posCercle) * length,
        0,
      ];

      direction = [
        point2[0] - point1[0],
        point2[1] - point1[1],
        point2[2] - point1[2],
      ];

      direction[0] =
        speed *
        ((direction[0] * (direction[0] + direction[1] + direction[2])) / 3);
      3;
      direction[1] =
        speed *
        ((direction[1] * (direction[0] + direction[1] + direction[2])) / 3);
      3;
      direction[2] =
        speed *
        ((direction[2] * (direction[0] + direction[1] + direction[2])) / 3);
      3;

      points = [
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2]),
      ];
      if (ref2.current) {
        ref2.current.geometry.setFromPoints(points);
      }
    }, "5000");
  });

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
    <line ref={ref2}>
      <bufferGeometry attach="geometry" />
      <lineBasicMaterial linewidth="10.0" color="white" />
    </line>
  );
});

function Ttext() {
  const y = useRef(0);
  const reftext = useRef();

  let mouseTarget = useRef({ y: 0 });

  console.log("prout");

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
        position={[0, 15, 8]}
        font={"Roboto-Regular.ttf"}
        outlineWidth="1%"
        outlineColor="green"
      >
        Hello
      </Text>
      {/* <Text3D
        font={"Roboto_Regular.json"}
        // font={font}
        ref={reftext}
        scale={[3, 3, 0.1]}
        color="white"
        toneMapped={false}
        position={[-2, 5, 8]}
      >
        Hello world!
        <meshBasicMaterial color="white" />
      </Text3D> */}
    </>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

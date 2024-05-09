import dynamic from "next/dynamic";
import Head from "next/head";
import { Vector3 } from "three";
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
import RoundedBoxGeometry from "/../component/BoxGeo.js";
import { useMediaQuery } from "react-responsive";
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
  const options = useMemo(() => {
    return {
      progress: { value: 0, min: 0, max: 1, step: 0.1 },
      z: { value: 10, min: 0, max: 20, step: 1 },
      maxpolarangle: { value: 0.85, min: 0, max: 1, step: 0.01 },
      x: { value: 0, min: 0, max: 50, step: 10 },
    };
  }, []);
  const start = Date.now();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  useEffect(() => {
    var first = true;
  });
  return (
    <>
    
      {!isTabletOrMobile && (
        <>
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
              <Suspense fallback={<Delayed />}>
                <TextureScene start={start} />
              </Suspense>
            </Canvas>
          </div>
          <div className="wrapGreybar">
            <div className="greybar"></div>
          </div>
        </>
      )}
      {isTabletOrMobile && (
        <div
          style={{
            backgroundColor: "white",
            height: "100vh",
            width: "100wh",
            color: "black",
            textAlign: "center",
            lineHeight: "100vh",
          }}
        >
          <span
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              lineHeight: "normal",
            }}
          >
            Site non optimisé pour Smartphone. Merci de revenir consulter cette
            page sur PC !
          </span>
        </div>
      )}
    </>
  );
}
const Delayed = ({ start }) => {
  return (
    <>
      <Html center className="loading" children="Loading..." />
    </>
  );
};
export function TextureScene({ start }) {
  var camera_x;
  var tt = null;
  const ref33 = useRef();
  useFrame((state) => {
    camera_x = state.camera.position.x;
  });
  useEffect(() => {
    const millis = Date.now() - start;
    // console.log(`seconds elapsed = ${millis / 1000}`);
  }, []);
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
  let speed = 0.1 * (1 + 2 * Math.random());
  let llength;
  let length = 1 + 5 * Math.random();
  let posCercle = (Math.PI * Math.random()) / 4;
  let centreSphere1 = [
    25 * Math.random(),
    25 * Math.random(),
    25 * Math.random(),
  ];
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
      new Vector3(point1[0], point1[1], point1[2]),
      new Vector3(point2[0], point2[1], point2[2]),
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

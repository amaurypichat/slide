import {
  useEffect,
  useRef,
} from "react";
import { lerp, damp } from "three/src/math/MathUtils";
import {
  
  useFrame

} from "@react-three/fiber";

import {Text} from "@react-three/drei";

export default function Ttext() {
    const y = useRef(0);
    const delayClock = useRef(0);
    const reftext = useRef();
    const compteurCycle = useRef(1);
    let mouseTarget = useRef({ y: 0 });
  
    useFrame((state, delta) => {
      reftext.current.position.y = lerp(
        reftext.current.position.y,
        mouseTarget.current.y,
        0.3
      );
  
      delayClock.current += delta;
  
      if (
        Math.floor(delayClock.current / 10) !=
        Math.floor((delayClock.current - delta) / 10)
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
      const setTargetMouse = (event) => {
        mouseTarget.current.y += event.deltaY / 100;
      };
  
      window.addEventListener("wheel", setTargetMouse);
    });
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
        >
          Site réalisé avec Three.js et WebGL
        </Text>
      </>
    );
  }
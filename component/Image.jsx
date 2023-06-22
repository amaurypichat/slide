import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useTexture,
  shaderMaterial,
  Text,
  OrthographicCamera,
} from "@react-three/drei";

export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
    offset2: new THREE.Vector2(),
  },
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  ` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    uniform float uAlpha;
    uniform vec2 offset2;
   
   vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 uoffset) {
      float r = texture2D(textureImage,uv + uoffset ).r;
      vec2 gb = texture2D(textureImage,uv).gb;
      return vec3(r,gb);
    }
   
   void main() {
      vec3 color = rgbShift(tex,vUv, offset2);
      gl_FragColor = vec4(color,1.0);
    }
    
    `
);

extend({ ImageFadeMaterial });

function FadingImage({ src }) {
  const ref = useRef(null);
  const offset = useRef(0);
  const [texture1, texture2, dispTexture] = useTexture([
    src,
    "./images/git.png",
    "./images/git.png",
  ]);
  const [hovered, setHover] = useState(false);
  function lerp(start, end, t){
    return start * (1 - t ) + end * t;
}

  useFrame(() => {

    offset.current = lerp(offset.current, 0.0, 0.075);
    ref.current.offset2 = new THREE.Vector2(
      0.0,
      -(0.0 - offset.current) * 0.0003
    );
    
  });

  useEffect(() => {
    // offset.current=0
    window.addEventListener("wheel", (event) => {
      offset.current =  lerp(offset.current, event.screenY, 0.075);
      console.log(offset.current)
    });
  }, []);

  return (
    <>
      <mesh
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <planeGeometry args={[10, 10]} />
        <imageFadeMaterial
          ref={ref}
          offset2={new THREE.Vector2(0.0, 0.0)}
          tex={texture1}
          tex2={texture2}
          disp={dispTexture}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

export default function Image({ src }) {
  return (
    <Canvas
    // camera={{ position: [0, 0, 2], fov: 50 }}
    >
      <OrthographicCamera args={[-1, 1, 1, -1, 0, 1]} />
      {/* <Text >AAA </Text> */}
      <FadingImage src={src} />
    </Canvas>
  );
}


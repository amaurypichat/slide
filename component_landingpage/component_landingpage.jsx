import Script from "next/script";
import { Shaders, Node, GLSL } from "gl-react";
import * as THREE from "three";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { Surface } from "gl-react-dom";

const WaveShaderMaterial2 = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(1.0, 0.0, 1.0, 0.0),
    uOffset: new THREE.Vector2(0.0, 0.0),
    uResolution: new THREE.Vector2(2.0, 1.0),
  },
  // Vertex Shader
  `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform sampler2D uTexture;
  uniform vec2 uOffset;
  // out vec2 vUv;
  // out sampler2D ttext;
  // varying vec2 uv;

  varying vec2 vUv;
  
  out vec2 texCoordV;

  in vec2 texCoord;
  
  #define M_PI 3.1415926535897932384626433832795
  
  vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
     position.x = position.x + (sin(uv.y * M_PI) * offset.x);
     position.y = position.y + (sin(uv.x * M_PI) * offset.y);
     return position;
  }
  
  void main() {
    vec2 vUv = uv;
    // sampler2D ttext = uTexture;
    vec2 texCoordV = texCoord;
     vec3 newPosition = deformationCurve(position, uv, uOffset);
     gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  }
      `,
  // Fragment Shader
  `
  #ifdef GL_ES
  precision mediump float;
  #endif
        uniform sampler2D uTexture;
        uniform vec2 uOffset;
        uniform vec2 uResolution;
       
    
        void main() {
          // vec2 uResolution2=vec2(2.,1.);
          // vec2 vUv = gl_FragCoord.xy / uResolution2.xy;

          gl_FragColor = texture2D(uTexture,gl_FragCoord.xy);
          
        }
      `
);

extend({ WaveShaderMaterial2 });

function Ahah({ TriggerFunc, CurrentFunc }) {
  const current2 = useRef(0);
  const target = useRef(0);
  const ease = useRef(0.075);
  // const material = useRef();
  const trigger = useRef(false);

  useFrame(({ clock }) => {
    if (trigger.current) {
      function lerp(start, end, t) {
        return start * (1 - t) + end * t;
      }
      current2.current = lerp(current2.current, target.current, ease.current);

      CurrentFunc(lerp(current2.current, target.current, ease.current));
    }
  });

  useEffect(() => {
    if (window) {
      window.addEventListener("scroll", () => {
        // if (trigger.current == false) {
        trigger.current = true;
        current2.current = window.scrollY;

        TriggerFunc(true);
        // setTimeout(() => {
        //   trigger.current = false;
        //   TriggerFunc(false);
        // }, 3000);
        // }
      });
    }
  }, []);

  return <></>;
}

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float blue;
void main() {
  gl_FragColor = vec4(1., 1., 1., 1.0);
}`,
  },
});

function Test_gl_react() {
  let blue = 1.0;
  return <Node shader={shaders.helloBlue} uniforms={{ blue }} />;
}

export function Home({ Component, pageProps }) {
  // const image = useTexture("blackgit.png");

  // const material = new WaveShaderMaterial2({
  //   color: new THREE.Color("hotpink"),
  // });
  // material.uTime = 1;
  // material.uTexture = image;
  const ref = useRef();
  const trigger = useRef(false);

  const material = useRef(0);

  useEffect(() => {
    if (window) {
      console.log("ee", window.devicePixelRatio);
    }
  }, []);

  function TriggerFunc(aa) {
    trigger.current = aa;
  }

  function CurrentFunc(aa) {
    trigger.current = aa;
    material.current.needsUpdate = true;
    material.current.material.uniforms.uOffset.value = new THREE.Vector2(
      0.0,
      -(0 - aa) * 0.0003
    );
  }

  return (
    <div
      style={{
        background: "black",
        height: "200vh",
        width: "100vw",
        position: "absolute",
      }}
    >
      {/* <span
        style={{
          background: "white",
          height: "10vh",
          width: "10vw",
          position: "fixed",
        }}
      >
        {material.current.material && material.current.material.uniforms.uOffset.value.y
          ? material.current.material.uniforms.uOffset.value.y
          : ""}
      </span> */}
      <div id="aaaa">
        {/* <Surface width={300} height={300}>
        <Test_gl_react />
      </Surface> */}
      </div>
      <div
        style={{
          background: "black",
          height: "50vh",
          width: "100vw",
          position: "fixed",
          top: "10vh",
          // display:"none"
        }}
      >
        <Canvas
          gl={{ antialias: false }}
          camera={{
            near: 0.1,
            far: 50,
            zoom: 1,
            position: [4, 4, 4],
            maxPolarAngle: 0.85,
          }}
          ref={ref}
        >
          {/* <Ahah CurrentFunc={CurrentFunc} TriggerFunc={TriggerFunc} /> */}
          <RRR />
          <ambientLight intensity={0.3} />
          <spotLight position={[10, 10, 10]} angle={45} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
        </Canvas>
      </div>
    </div>
  );
}

function RRR() {
  const image = useTexture("blackgit.png");
  const material = useRef(0);

  
  useFrame(()=>{
    material.current.material.uniformsNeedUpdate = true;
    material.uTexture = new THREE.TextureLoader().load("blackgit.png")
    // console.log(material.current.material.uniformsNeedUpdate)
  })
  // useEffect(()=>{
  //   if (window){
    
  //   }
  // }
  // )

  return (
    <mesh
    ref={material}
    >
      <planeGeometry args={[3, 4, 16, 16]} />
      <waveShaderMaterial2
        // key={WaveShaderMaterial2.key}
        uTime={0.0}
        uTexture={image}
        uOffset={0.0}
        uResolution={[window.devicePixelRatio, 1]}
        uniformsNeedUpdate="true"
        map={image}
      />
      {/* <meshStandardMaterial 
            map={image}
            // color={"white"} 
            /> */}

      {/* <meshStandardMaterial
            // emissiveIntensity={4}
            color={[255, 255, 0]}
            toneMapped={false}
          /> */}
    </mesh>
  );
}

export default Home;

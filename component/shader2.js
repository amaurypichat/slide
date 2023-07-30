import * as THREE from "three";
import { GLSL } from "gl-react";
import { lerp, damp } from "three/src/math/MathUtils";
import {
  OrbitControls,
  Text,
  shaderMaterial,
  PerspectiveCamera,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";

const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    prout: 0,
    uAlphaMap: new THREE.Texture(),
    map2: new THREE.Texture(),
    map: new THREE.Texture(),
    fond: false,
    camera_x: 0,
    compteurCycle: 1,
    filigrane: false,
    _resolution: new THREE.Vector2(),
  },
  GLSL`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
  GLSL`


uniform sampler2D transition_shape;

uniform sampler2D uTexture;
uniform sampler2D map;
uniform sampler2D map2;
uniform float uTime;
varying vec2 vUv;

// layout(location=0) out vec4 whatever;



vec4 getFromColor(vec2 uvloc){

    vec4 ttt = texture2D(map, uvloc);
    return ttt;
}

vec4 getToColor(vec2 uvloc){

    vec4 ttt = texture2D(map2, uvloc);
    return ttt;
}


vec4 transition (vec2 uv,float progress) {
  
  float strength= 0.1;
  float displacement = texture2D(transition_shape, uv).r * strength;

  vec2 uvFrom = vec2(uv.x + progress * displacement, uv.y);
  vec2 uvTo = vec2(uv.x - (1.0 - progress) * displacement, uv.y);

  return mix(
    getFromColor(uvFrom),
    getToColor(uvTo),
    progress
  );
}

const float SQRT_2 = 1.414213562373;
// uniform float dots;// = 20.0;
// uniform vec2 center;// = vec2(0, 0);

vec4 transition2(vec2 uv,float progress) {
  vec2 center = vec2(0, 0);
  float dots = 20.0;
  vec2 uvbis=uv;
  uvbis.x=uv.x*0.3;
  bool nextImage = distance(fract(uv * dots), vec2(0.5, 0.5)) < ( progress / distance(uv, center));
  return nextImage ? getToColor(uvbis) : getFromColor(uv);
}

void main() {
    vec2 uv;

    // uv.x=vUv.x * 0.3 ;
    uv=vUv;

    float progress;
    progress=uTime - 5. * floor(uTime/5.);

    vec4 rr=transition2(uv,progress / 2.);

    // gl_FragColor = texture2D(map2, vUv);

    gl_FragColor = rr;

}

`
);

export default WaveShaderMaterial;

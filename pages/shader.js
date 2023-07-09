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
    fond: false,
    camera_x: 0,
    compteurCycle: 1,
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
    uniform sampler2D map2;
    uniform sampler2D uAlphaMap;
    uniform vec3 uColor;
    uniform float prout; 
    uniform bool fond;
    uniform float camera_x;
    uniform int compteurCycle;
    varying vec2 vUv;
    varying vec2 resolution;
    
  
    float A;
    
    float nEcran=1.;

    float Reste;
    float ambientStrength = 0.1;
    
    float floatResolution;
    
    // floatResolution=resolution.x/resolution.y;

    #define PI 3.1415926538

    vec2 SineWave( vec2 p, float A ){
      float pi = 3.14159;
      // float A = 0.50;
      float w = 10.0 * pi;
      float t = 30.0*pi/180.0;
      float y = sin( w*p.x + t) * A; 
      return vec2(p.x, p.y+y);
  }
  
  vec2 Point( vec2 p, int nEcran2){
    
    // float ww=1920.;
    
    // for(int i=0;i<10;i++) {
      
      
      
    //   }
    
    if (nEcran2==1){
    float d = sqrt(dot(p - vec2(.16666,.5),p - vec2(.1666,.5)));
    if (d<0.1){
        p.x=p.x+0.333;
      }
    }
    
     if (nEcran2==2){
    float d = sqrt(dot(p - vec2(.48888,.5),p - vec2(.4888,.5)));
    if (d<0.1){
        p.x=p.x+0.333;
      }
    }
    
    if (nEcran2==3){
    float d = sqrt(dot(p - vec2(.8444,.5),p - vec2(.8444,.5)));
    if (d<0.1){
        p.x=p.x -0.666;
      }
    }
    
      
      
      return p;
  }

    void main() {
      vec2 uv;
      
      uv.y=vUv.y;
      
      // uv.x=vUv.x * 1024. / 1280.;
  
     
      if (compteurCycle==1 ){
        uv.x=vUv.x * 0.3 ;
      }
      
      else if (compteurCycle==2){
        uv.x=vUv.x * 0.3 + 0.3;
      }
      
      else if (compteurCycle==3){
        uv.x=vUv.x * 0.33 + 0.66;
      }

      Reste=uTime - 10. * floor(uTime/10.);


    if ( uTime - 10. * floor(uTime/10.) > 7.){
      
      A=0.;
      
      A=0.5 * sin(PI* (Reste-7.) / 3.);
    
      uv = SineWave( uv,A ); 

      if (compteurCycle==1 || compteurCycle==2){

      uv.x=uv.x+(Reste - 7. ) *.333/3.;
      }
      else{
        uv.x=uv.x -(Reste - 7. ) *.666/3.;
        
      }
     
    }
    
    // uv=Point(uv,compteurCycle);
   
      vec3 ttt = texture2D(uTexture, uv).rgb;
      
      
      // vec3 texture2 = texture2D(map2, vUv).rgb;
      // vec3 ggg =texture2D(uTexture, uv).rgb;
      //defining alpha
      float t2=0.;
      if (compteurCycle!=4){
        float alpha=1.;
        if (((vUv.x - .5) * (vUv.x - .5) + (vUv.y - .5)*(vUv.y - .5)) <.2){
          alpha=0.;
        }
        //we define a circle of transparency at the center
        float d = sqrt(dot(vUv - vec2(.5,.5),vUv - vec2(.5,.5)));
        t2 = smoothstep(.3, .3+0.1, d);
        if (fond==true){
          t2=1.;
        }
        
        alpha=smoothstep(0.,1.,(vUv.x - .5) * (vUv.x - .5) + (vUv.y - .5)*(vUv.y - .5));
      }else{
        // textureAlpha = texture2D(uAlphaMap, uv).rgb;
        vec3 aa = texture2D(uAlphaMap, uv).rgb;
        t2=(aa.r +  aa.g + aa.b ) /3.;
      }

      gl_FragColor = vec4(ttt, t2);
      #include <tonemapping_fragment>
#include <encodings_fragment>
    }
  `
);

export default WaveShaderMaterial;

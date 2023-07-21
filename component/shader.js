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
    uniform bool filigrane;
    varying vec2 vUv;
    uniform vec2 _resolution;
    
  
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
      float w = 20.0 * pi;
      float t = 30.0*pi/180.0;
      float y = sin( w*p.x + t) * A; 
      return vec2(p.x, p.y+y);
  }


  
  float Point2( int nEcran2){
    
    vec2 centrePoint;
    int nbDivHor=3;
    int nbDivVer=3;
    float coeff_a_=0.1;

    vec2 p = 2.0 * gl_FragCoord.x / _resolution.xy - 1.0;

    // p=p * vec2(1.0, _resolution);

    // vec2 resolution = vec2(800.0, 600.0);

    float d = sqrt(dot((p - vec2(.12,.5)) ,(p - vec2(.12,.5))));
    
     for(int i=0;i<nbDivHor;i++) {
      centrePoint=vec2( (i+1) / nbDivHor, 1 / nbDivVer );

      // d = sqrt(dot((p - vec2(centrePoint[0],centrePoint[1])) ,(p - vec2(centrePoint[0],centrePoint[1]))));

      d=distance(p,centrePoint);

      if (d<0.05){
        coeff_a_=1.;
      }

       if (compteurCycle==1){

        // centrePoint
        //  a = sqrt(dot((p - vec2(centrePoint[0],.5)) ,p - vec2(centrePoint[1],.5)));

         d=distance(p,centrePoint);
         if (d<0.1){
             p.x=p.x+0.333;
           }
        }
        
          if (compteurCycle==2){
         float a = sqrt(dot(p - vec2(.48888,.5),p - vec2(.4888,.5)));

         d=distance(p,centrePoint);
          if (d<0.1){
              p.x=p.x+0.333;
            }
         }
        
         if (compteurCycle==3){
         float d = sqrt(dot(p - vec2(.8444,.5),p - vec2(.8444,.5)));
         if (d<0.1){
             p.x=p.x -0.666;
           }
         }
      
      
        }
    
      
      return coeff_a_;
  }

    void main() {
      vec2 uv;

      vec2 uv3=uv;
      
      uv.y=vUv.y;
      
      // uv.x=vUv.x * 1024. / 1280.;

      // uv = gl_FragCoord.xy / _resolution.xy ;
      
  
     
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
    

    float t2=0.;
    float coeff_a=1.;


   
      vec3 ttt = texture2D(uTexture, uv).rgb;
      
      
      //defining alpha

      t2=0.;

      if (compteurCycle!=4){
        float alpha=1.;
        if (((vUv.x - .5) * (vUv.x - .5) + (vUv.y - .5)*(vUv.y - .5)) <.2){
          alpha=0.;
        }
        //we define a circle of transparency at the center
        float d = sqrt(dot(vUv - vec2(.5,.5),vUv - vec2(.5,.5)));
        t2 = smoothstep(.3, .3+0.1, d);
        if (fond==true){
          t2=0.;
        }
        
        alpha=smoothstep(0.,1.,(vUv.x - .5) * (vUv.x - .5) + (vUv.y - .5)*(vUv.y - .5));
      }else{
        // textureAlpha = texture2D(uAlphaMap, uv).rgb;
        vec3 aa = texture2D(uAlphaMap, uv).rgb;
        t2=(aa.r +  aa.g + aa.b ) /3.;
      }

      if (filigrane){
        vec3 aa = texture2D(uTexture, uv).rgb;
          
        t2=(aa.r +  aa.g + aa.b ) /6.;
      }
      
      // vec2 p = gl_FragCoord.xy / _resolution.xy ;
      vec2 uv2=uv;
      uv2.x=uv.x * (_resolution.x / _resolution.y);
      
      // ttt=vec3(1.,1.,1.);
      
      float nbDivHor=3.;
    float nbDivVer=3.;
    vec2 centrePoint;

    vec2 px = vec2(1.0/_resolution.x, 1.0/_resolution.y);
    float aspect = _resolution.x / _resolution.y; 
    // vec4 uv4=uv;
    // uv4.x=vUv;
    t2=0.;

    // marge de 0.1
    // rayon cercle

    float rrayon=0.01 * (10. - 2. * Reste);
    // float rrayon=0.01 ;

    if (Reste <7.){
      // rrayon=10.;
    }
    for(float i=0.;i<nbDivHor;i++) {
      for(float j=0.;j<nbDivVer;j++) {
      centrePoint=vec2(0.1 + 0.8* (i+1.) / nbDivHor, 0.1 + 0.8 * (j+1.) / nbDivVer );
      if ((distance(vUv  ,vec2(centrePoint[0],centrePoint[1]))  < rrayon && compteurCycle==1)
      ^^(distance(vUv  ,vec2(centrePoint[0],centrePoint[1]))  < rrayon && compteurCycle==2)
      ^^(distance(vUv  ,vec2(centrePoint[0],centrePoint[1]))  < rrayon && compteurCycle==3)
      ){
        // d=distance(p,centrePoint);
        // ttt=vec3(1.,0.,0.);
        t2=1.;
        uv.x=vUv.x*0.3;
        ttt=texture2D(uTexture, uv).rgb;
      }
      else{
        t2=1.;
        // uv.x=vUv.x*0.3;
        ttt=texture2D(uTexture, uv).rgb;
      }

      // if (distance(vUv ,vec2(centrePoint[0] ,centrePoint[1]))  > 0.01 && compteurCycle==2){
      //   // d=distance(p,centrePoint);
      //   ttt=vec3(1.,1.,0.);
      //   t2=1.;
      // }

      if (distance(vUv ,vec2(centrePoint[0] ,centrePoint[1]))  <rrayon){
        
        // t2=1.;
        // uv.x=vUv.x*0.3 + 0.3;
      }
    }
    }

  
      gl_FragColor = vec4(ttt, t2 );
      #include <tonemapping_fragment>
#include <encodings_fragment>
    }
  `
);

export default WaveShaderMaterial;

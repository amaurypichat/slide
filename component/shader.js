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
    uAlphaMap: new THREE.Texture(),
    map2: new THREE.Texture(),
    map: new THREE.Texture(),
    image3: new THREE.Texture(),
    image1: new THREE.Texture(),
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
    uniform sampler2D map;

    uniform sampler2D image3;
    uniform sampler2D image1;

    uniform vec3 uColor;
    uniform bool fond;
    uniform float camera_x;
    uniform int compteurCycle;
    uniform bool filigrane;
    varying vec2 vUv;
    uniform vec2 _resolution;
    
    float A;
    
    float nEcran=1.;

    float Reste;

   

    #define PI 3.1415926538

    vec2 SineWave( vec2 p, float A ){
      float pi = 3.14159;
      // float A = 0.50;
      float w = 20.0 * pi;
      float t = 30.0*pi/180.0;
      float y = sin( w*p.x + t) * A; 
      return vec2(p.x, p.y+y);
   }

   vec4 getFromColor(vec2 uvloc){
    
    vec4 ttt = texture2D(uTexture, uvloc);
    return ttt;
  }

  vec4 getToColor(vec2 uvloc){
      vec2 uvloc2=vUv;
      uvloc2.x=vUv.x* 0.3;
      vec4 ttt = texture2D(uTexture, uvloc2);
      return ttt;
  }

  vec4 getFromColor2(vec2 uvloc){
    
    vec4 ttt = texture2D(image3, uvloc);
    return ttt;
  }

  vec4 getToColor2(vec2 uvloc){
      vec2 uvloc2=vUv;
      // uvloc2.x=vUv.x* 0.3;
      vec4 ttt = texture2D(image1, uvloc2);
      return ttt;
  }

  vec4 transition2(vec2 uv,float progress) {
    vec2 center = vec2(0, 0);
    float dots = 20.0;
    vec2 uvbis=uv;
    bool nextImage = distance(fract(uv * dots), vec2(0.5, 0.5)) < ( progress / distance(uv, center));
    return nextImage ? getToColor(uvbis) : getFromColor(uv);
  }

  vec4 transition3(vec2 p,float progress) {
    float strength=0.5;
    vec4 ca = getFromColor(p);
    vec4 cb = getToColor(p);
    
    vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);
    vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);
    vec2 oc = mix(oa,ob,0.5)*strength;
    
    float w0 = progress;
    float w1 = 1.0-w0;
    return mix(getFromColor2(p+oc*w0), getToColor2(p-oc*w1), progress);
  }

  vec4 transition4(vec2 p,float progress) {
    float size= 0.04;
    float zoom= 50.0;
    float colorSeparation= 0.3;
    float inv = 1. - progress;
    vec2 disp = size*vec2(cos(zoom*p.x), sin(zoom*p.y));
    vec4 texTo = getToColor(p + inv*disp);
    vec4 texFrom = vec4(
      getFromColor(p + progress*disp*(1.0 - colorSeparation)).r,
      getFromColor(p + progress*disp).g,
      getFromColor(p + progress*disp*(1.0 + colorSeparation)).b,
      1.0);
    return texTo*progress + texFrom*inv;
  }

  float rand (vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }
  
  vec4 transitionCarreau(vec2 p,float progress) {
    ivec2 size= ivec2(10, 10);
    float smoothness= 0.5;
    float r = rand(floor(vec2(size) * p));
    float m = smoothstep(0.0, -smoothness, r - (progress * (1.0 + smoothness)));
    return mix(getFromColor(p), getToColor(p), m);
  }
  


    void main() {
      vec2 uv;

      vec2 uv3=uv;
      
      uv.y=vUv.y;

      Reste=uTime - 10. * floor(uTime/10.);

      float dim_image;
      float dim_image1=994.;
      float dim_image2=1080.;
      float dim_image3=960.;
      dim_image1=26.29;
      dim_image2=28.59;
      dim_image3=35.18;
      dim_image=(dim_image1 + dim_image2 + dim_image3 );

      float compteurCycle_old;
      float uTime_old;

      // if ((uTime - 10. * floor(uTime/10.)) < (uTime_old - 10. * floor(uTime_old/10.)){
       int i_int = int(floor(uTime/10.));
      // res = i_float2 / 15.0;
      int compteurCycle2=i_int;
      // }
      
      // ) !=
      //   Math.floor((state.clock.getElapsedTime() - delta) / 10))

      
     // on se cale sur chaque image
      if (compteurCycle==1 ){
        uv.x=vUv.x * 0.3  ;
      }
      
      else if (compteurCycle==2){
        uv.x=vUv.x * 0.3 + (dim_image1) / dim_image;
      }
      
      else if (compteurCycle==3){
        uv.x=vUv.x * 0.3 + (dim_image1 + dim_image2) / dim_image;
      }

      

      


    if ( Reste > 7. && compteurCycle!=3){
      
      A=0.;
      
      A=0.5 * sin(PI* (Reste-7.) / 3.);
    
      uv = SineWave( uv,A ); 

      if (compteurCycle==1) {
          
          uv.x=uv.x+(Reste - 7. ) * (dim_image1) / (3. * dim_image);
      }
      else if(compteurCycle==2){
        uv.x=uv.x+(Reste - 7. ) * (dim_image2) / (3. * dim_image);
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
      vec3 aa = texture2D(uAlphaMap, uv).rgb;
      t2=(aa.r +  aa.g + aa.b ) /3.;
    }

    
    
    // vec2 p = gl_FragCoord.xy / _resolution.xy ;

    if (Reste > 7. && compteurCycle==3){
      float progress=uTime - 3. * floor(uTime/3.);

      vec4 aa=transitionCarreau(uv,progress / 2.);
      if (filigrane){
        t2=(aa.r +  aa.g + aa.b ) /6.;
      }
      gl_FragColor =vec4(aa.rgb,t2);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
    else{
      if (filigrane){
        t2=(ttt.r +  ttt.g + ttt.b ) /6.;
      }
      gl_FragColor = vec4(ttt, t2 );
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }

    

    


    }
  `
);

export default WaveShaderMaterial;

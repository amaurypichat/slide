/*
  To use it, simply declare:
  `const post = new PostFX(rendering);`
  
  Then on update, instead of:
  `rendering.render(scene, camera);`
  replace with:
  `post.render(scene, camera);`
*/
import {
  WebGLRenderTarget,
  OrthographicCamera,
  RGBFormat,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  Scene,
  RawShaderMaterial,
  Vector2,
  Uniform
} from "three";

const vertexShaderSplit = `precision highp float;
  attribute vec2 position;
  void main() {
    // Look ma! no projection matrix multiplication,
    // because we pass the values directly in clip space coordinates.
    gl_Position = vec4(position, 1.0, 1.0);

    
  }`;

const fragmentShader = `precision highp float;
  uniform sampler2D uScene;
  uniform float amount;
  uniform float angle;
  uniform vec2 uResolution;
  uniform float uProgress;
  uniform float utime;

  // varying vec2 vUv;

void main() {

  vec2 vUv = gl_FragCoord.xy / uResolution.xy ;
  vec2 uv=vUv;
  vec4 color = texture2D(uScene,uv);
  if (mod(utime,10.)==5. ){
    // color = vec4(.0,1,.1,.5);
  }
  else{
    if (vUv.y>(.5 + uProgress)){
      if (vUv.x <.25){
        uv.x=uv.x;
      }
      else if(vUv.x <.5){
        // uv.x=vUv.x - .25 * uProgress;
        uv.x=vUv.x - 0.1;
      }
      else if(vUv.x <.75){
        // uv.x=vUv.x - .37 * uProgress;
        uv.x=uv.x - 0.3;
      }

      else{
        // uv.x=vUv.x - .65 * uProgress;
        uv.x=uv.x - 0.5;
      }
    }

    

    color = texture2D(uScene,uv);

  }
  
  gl_FragColor = color;
}
  
  `;

const vertexShader = `precision highp float;
  attribute vec2 position;
  // varying vec2 vUv;
  void main() {
    // Look ma! no projection matrix multiplication,
    // because we pass the values directly in clip space coordinates.
    gl_Position = vec4(position, 1.0, 1.0);
  }`;

const fragmentShaderA = `precision highp float;
uniform sampler2D uScene;
uniform float amount;
uniform float angle;
uniform vec2 uResolution;


void main() {
  vec2 vUv = gl_FragCoord.xy / uResolution.xy;
  vec2 offset = amount * vec2(cos(angle) ,sin(angle));
  vec4 cr = texture2D(uScene ,vUv + offset);
  vec4 cga = texture2D(uScene, vUv);
  vec4 cb = texture2D(uScene, vUv - offset);
  // gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
  // gl_FragColor = vec4(.0,1,.1,.5);
}
  
  `;

export default class PostFX {
  constructor(renderer,uProgress) {
    this.renderer = renderer;
    this.scene = new Scene();
    // three.js for .render() wants a camera, even if we're not using it :(
    this.dummyCamera = new OrthographicCamera();
    this.geometry = new BufferGeometry();
    this.uProgress=uProgress;

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]);

    this.geometry.setAttribute("position", new BufferAttribute(vertices, 2));

    this.resolution = new Vector2();
    this.renderer.getDrawingBufferSize(this.resolution);

    this.uniform;

    this.target = new WebGLRenderTarget(this.resolution.x, this.resolution.y, {
      format: RGBFormat,
      stencilBuffer: false,
      depthBuffer: true,
    });

    this.material = new RawShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uScene: { value: this.target.texture },
        uResolution: { value: this.resolution },
        angle: { value: 0.0 },
        amount: { value: 4.0 },
        // uProgress: new Uniform(  { value: 0.1 }),
        uProgress: {value: this.uProgress },
        utime: { value: 0.5 },
      },
    });

    // TODO: handle the resize -> update uResolution uniform and this.target.setSize()

    this.triangle = new Mesh(this.geometry, this.material);
    // Our triangle will be always on screen, so avoid frustum culling checking
    this.triangle.frustumCulled = false;
    this.scene.add(this.triangle);
  }

  render(scene, camera, time) {
    // this.material.uniforms.uProgress.value = 2.0;
    // this.material.needsUpdate = true;
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.dummyCamera);
    // this.material.uniforms.angle.value += time;
    // this.material.uniforms.amount.value = 0.01;
    // this.material.uniforms.utime.value += time;
// 
    // this.material.needsUpdate = true;
    
  }

  // setProgress(progress){
  //   this.material.uniforms.uProgress.value = progress;
  //   this.material.uniforms.uProgress.needsUpdate = true;
  //   // this.material.needsUpdate = true;
  //   this.material.uniforms.needsUpdate = true;
  //   this.material.uniforms.uProgress.value =progress;
  //   // this.material.uniforms.angle.value = 0.1;
  //   // this.material.uniforms.amount.value = 0.1;
  //   // this.material.uniforms.utime.value = 0.1;

  //   // this.material.needsUpdate = true;
  // }
}

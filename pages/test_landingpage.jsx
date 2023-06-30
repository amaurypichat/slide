import React, { dyna } from "react";
import { Shaders, Node, GLSL } from "gl-react";
// import { Surface } from "gl-react-headless";
import { Surface } from "gl-react-dom"; // for React DOM
import dynamic from "next/dynamic";
const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
void main() {
  gl_FragColor = vec4(uv.x, uv.y,0.5, 1.0);
}`,
  },
});
function HelloBlue() {
  return <Node shader={shaders.helloBlue} />;
}

function Home() {
  return (
    <div>
      <Surface width={300} height={300}>
        <HelloBlue blue={0.5} />
      </Surface>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

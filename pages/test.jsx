import { VFXSpan } from "react-vfx";

const blink = `
uniform vec2 resolution; // Resolution of the element
uniform vec2 offset;     // Position of the element in the screen
uniform float time;      // Time passed since mount
uniform sampler2D src;   // Input texture

void main() {
    // Get UV in the element
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;

    gl_FragColor = texture2D(src, uv) * step(.5, fract(time));
}
`;

export default function Home() {
  return <VFXSpan shader={blink}>I'm blinking!</VFXSpan>;
}

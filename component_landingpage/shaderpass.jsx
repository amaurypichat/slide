import { ShaderMaterial, Uniform } from "three";
import { ShaderPass } from "postprocessing";

const myShaderMaterial = new ShaderMaterial({

	defines: { LABEL: "value" },
	uniforms: { tDiffuse: new Uniform(null) },
	vertexShader: `

    varying vec2 vUv;

    void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
`
    ,
	fragmentShader: `

    uniform float opacity;

    // uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {

        gl_FragColor = vec4(1,1,1,1);
        // texture2D( tDiffuse, vUv );
        // gl_FragColor.a *= opacity;
        // gl_FragColor.a = 1;


    }`

});

const MyShaderPass = new ShaderPass(myShaderMaterial);

export default  MyShaderPass;
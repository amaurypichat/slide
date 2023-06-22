import { Canvas } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

const Image = dynamic(() => import("../component/Image"), {
  ssr: false,
});


const Cube = () => {
  const mesh = useRef();
  const uniforms = useMemo(
    () => ({
      u_test: {
        value: 1.0,
      },
    }),
    []
  );

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function Home() {
  return (
    <>
      <div
        style={{
          width: "80%",
          height: "40vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src="images/2.jpg" />
      </div>

    </>
  );
}

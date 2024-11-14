'use client';
import { Billboard, Edges, Image, PerspectiveCamera, Text } from '@react-three/drei';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { type PerspectiveCamera as PerspectiveCameraType } from 'three';
import { geometry } from 'maath';
import { useScroll } from 'framer-motion';

declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedPlaneGeometry: any;
  }
}
extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry });
interface DataProps {
  data: { name: string; image: string | null; isSupporter: boolean; score: number | string }[];
}
export function Stage(props: DataProps) {
  return (
    <Canvas>
      <color args={['ivory']} />
      <Experience data={props.data} />
    </Canvas>
  );
}

function Experience(props: DataProps) {
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const { scrollY: scrollYProgress } = useScroll({ smooth: 0.4 });
  /* const scrollYProgress = useSpring(scrollY, {
  }); */
  useFrame(() => {
    if (cameraRef.current === null) return;

    const progress = Math.min(scrollYProgress.get() / 330, 1);
    cameraRef.current.position.y = 4 + progress * -15;
    cameraRef.current.lookAt(0, 2, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.2]} ref={cameraRef} zoom={1} />
      {/* <OrbitControls /> */}
      <group scale={1.5}>
        <Platform
          x={-1}
          height={1.3}
          userInfo={{
            username: props.data[1]?.name ?? '',
            points: props.data[1]?.score ?? '',
            image: 'https://avatars.githubusercontent.com/u/3579142?v=4',
          }}
        />
        <Platform
          x={0}
          height={1.6}
          userInfo={{
            username: props.data[0]?.name ?? '',
            points: props.data[0]?.score ?? '',
            image: 'https://avatars.githubusercontent.com/u/53154523?v=4',
          }}
        />
        <Platform
          x={1}
          height={1.1}
          userInfo={{
            username: props.data[2]?.name ?? '',
            points: props.data[2]?.score ?? '',
            image: 'https://avatars.githubusercontent.com/u/31113245?v=4',
          }}
        />
      </group>
    </>
  );
}
function Platform(props: {
  x: number;
  height: number;
  userInfo: { username: string; points: number | string; image: string | null };
}) {
  return (
    <group position-x={props.x} position-y={0.4}>
      <Billboard lockZ position-y={props.height} position-z={0.35} scale={0.7}>
        <Image url={props.userInfo.image ?? ''}>
          <roundedPlaneGeometry args={[1, 1, 0.1]} />
        </Image>
        <Text fontSize={0.1} position-y={0.6} maxWidth={1}>
          {props.userInfo.points}
        </Text>
      </Billboard>
      <mesh position-y={(props.height - 1) / 2}>
        <boxGeometry args={[1, props.height, 1]} />
        <meshBasicMaterial color="black" />
        <Edges linewidth={1} color="white" />
      </mesh>
      <group>
        <Text
          fontSize={0.12}
          textAlign="center"
          anchorY="top"
          position-y={props.height - 0.6}
          position-z={0.51}
          maxWidth={0.9}
          overflowWrap="break-word"
          fontWeight={600}
        >
          {props.userInfo.username}
        </Text>
      </group>
    </group>
  );
}

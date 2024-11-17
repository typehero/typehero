'use client';
import { Billboard, Edges, Image, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, type PerspectiveCamera as PerspectiveCameraType } from 'three';
import { geometry } from 'maath';
import { useScroll, useSpring } from 'framer-motion';
import { motion } from 'framer-motion-3d';
import { Perf } from 'r3f-perf';
declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedPlaneGeometry: any;
  }
}
extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry });
interface DataProps {
  data: { name: string; image: string | null; score: number | string }[];
  isDayStage: boolean;
}
export function Stage(props: DataProps) {
  return (
    <Canvas>
      <Perf position="top-right" />
      <color args={['ivory']} />
      <Experience data={props.data} isDayStage={props.isDayStage} />
    </Canvas>
  );
}

function Experience(props: DataProps) {
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const { scrollY } = useScroll({ smooth: 0.4 });
  const scrollYProgress = useSpring(scrollY, {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  });
  useFrame(() => {
    if (cameraRef.current === null) return;

    const progress = Math.min(scrollYProgress.get() / 600, 1);
    console.log(progress);
    cameraRef.current.position.y = 4 + progress * -15;
    cameraRef.current.lookAt(0, 2, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.2]} ref={cameraRef} zoom={1} />
      {/* <OrbitControls /> */}
      <motion.group
        scale={1.35}
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.5,
        }}
      >
        <Platform
          x={0}
          height={1.8 + 2}
          userInfo={{
            username: props.data[0]?.name ?? '',
            points: props.data[0]?.score ?? '',
            image: props.data[0]?.image ?? null,
          }}
          isDayStage={props.isDayStage}
        />
        <Platform
          x={-1}
          height={1.5 + 2}
          userInfo={{
            username: props.data[1]?.name ?? '',
            points: props.data[1]?.score ?? '',
            image: props.data[1]?.image ?? null,
          }}
          isDayStage={props.isDayStage}
        />
        <Platform
          x={1}
          height={2 + 1.3}
          userInfo={{
            username: props.data[2]?.name ?? '',
            points: props.data[2]?.score ?? '',
            image: props.data[2]?.image ?? null,
          }}
          isDayStage={props.isDayStage}
        />
      </motion.group>
    </>
  );
}

function Platform(props: {
  x: number;
  height: number;
  userInfo: { username: string; points: number | string; image: string | null };
  isDayStage: boolean;
}) {
  return (
    <motion.group
      position-x={props.x}
      variants={{
        initial: {
          y: -props.height - 2,
        },
        animate: {
          y: 0.4 - 2,
          transition: {
            duration: 1,
          },
        },
      }}
    >
      <Billboard
        lockZ
        position-y={props.height}
        position-z={0.35}
        scale={0.7}
        onClick={() => {
          window.open(`https://typehero.dev/@${props.userInfo.username}`, '_blank')?.focus();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <motion.group
          whileHover={{
            scale: 1.1,
          }}
        >
          <ImageWithFallback image={props.userInfo.image} name={props.userInfo.username} />
          <Text
            fontSize={0.14}
            position-y={0.55}
            maxWidth={1}
            font="/roboto-mono-v23-latin-regular.woff"
            anchorY="bottom"
            textAlign="center"
          >
            {props.userInfo.username}
          </Text>
        </motion.group>
      </Billboard>
      <mesh position-y={(props.height - 1) / 2}>
        <boxGeometry args={[1, props.height, 1]} />
        <meshBasicMaterial color="black" />
        <Edges linewidth={2} color="white" />
      </mesh>
      <group position-z={0.51}>
        <Text
          fontSize={0.1}
          font="/roboto-mono-v23-latin-regular.woff"
          textAlign="center"
          anchorY="top"
          position-y={props.height - 0.6}
          maxWidth={0.9}
          overflowWrap="break-word"
        >
          {props.userInfo.points}
        </Text>
        {props.isDayStage ? null : (
          <Text
            anchorY="top"
            position-y={props.height - 0.74}
            fontSize={0.1}
            font="/roboto-mono-v23-latin-regular.woff"
          >
            points
          </Text>
        )}
      </group>
    </motion.group>
  );
}

function ImageWithFallback(props: { image: string | null; name: string }) {
  if (props.image === null) {
    return (
      <mesh>
        <roundedPlaneGeometry args={[1, 1, 0.1]} />
        <Text position-z={0.01} fontSize={0.5}>
          {props.name.slice(0, 1)}
        </Text>
        <meshBasicMaterial color={new Color('hsl(221, 83%, 20%)')} />
      </mesh>
    );
  }
  return (
    <Image url={props.image}>
      <roundedPlaneGeometry args={[1, 1, 0.1]} />
    </Image>
  );
}

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'

export default function Home() {
  return (
    <>
      <p>ParallarXiv online</p>
      <Canvas style={{ height: 400 }}>
        <Physics>
          <RigidBody>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          </RigidBody>
          <ambientLight />
          <OrbitControls />
        </Physics>
      </Canvas>
    </>
  )
}

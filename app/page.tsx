'use client'

import Image from 'next/image'
import { Canvas } from '@react-three/fiber'

export default function Home() {
  return (
    <main className='w-full h-screen'>
      <Canvas
        className=''
        camera={{
          position: [0, 0, 5],
        }}
        shadows
      >
        <mesh>
          <boxGeometry attach='geometry' args={[1, 1, 1]} />
          <meshStandardMaterial attach='material' color='#6be092' />
        </mesh>
      </Canvas>
    </main>
  )
}

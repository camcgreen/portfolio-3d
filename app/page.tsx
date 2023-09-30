'use client'

import { useEffect, useState, useRef } from 'react'
import NextImage from 'next/image'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { CameraControls, Image, MeshPortalMaterial } from '@react-three/drei'
import { easing, geometry } from 'maath'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { positionsOnEllipse } from '../utils/helpers'
import Overlay from './components/overlay'

extend(geometry)

export default function Home() {
  return (
    <>
      <main className='relative w-full min-h-screen'>
        <Overlay />
      </main>
      <div className='fixed left-0 top-0 w-full h-screen'>
        <Canvas
          camera={{
            fov: 60,
            // position: [0, 0, 0],
            position: [0, 0, 1],
            rotation: [0, 0, -Math.PI / 32],
          }}
          shadows
          gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
          linear
        >
          <Scene />
          {/* <CameraControls /> */}
        </Canvas>
      </div>
    </>
  )
}

function Scene() {
  const scrollPos = useScrollPosition()
  const [scrollSmoothTime, setScrollSmoothTime] = useState(0.4)
  const { camera } = useThree()
  const IMAGE_SIZE = 12
  const images = [
    '/images/1.webp',
    '/images/2.webp',
    '/images/3.webp',
    '/images/4.webp',
    '/images/5.webp',
    '/images/6.webp',
    '/images/7.webp',
    '/images/8.webp',
    '/images/9.webp',
  ]

  // Example usage:
  const imagePositions = positionsOnEllipse(IMAGE_SIZE * 1.75, images.length)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null

    if (window.innerWidth < 1100) {
      timeout = setTimeout(() => {
        setScrollSmoothTime(0.05)
      }, 2000)
    } else {
      timeout = setTimeout(() => {
        setScrollSmoothTime(0.2)
      }, 2000)
    }

    return () => {
      if (timeout !== null) clearTimeout(timeout)
    }
  }, [])

  useFrame((state, dt) => {
    const group = state.scene.children[0]
    const r = new THREE.Euler(-Math.PI / 2 - scrollPos, 0, 0)
    easing.dampE(group.rotation, r, scrollSmoothTime, dt)

    const images = [...group.children]
    images.forEach((image, i) => {
      image.lookAt(new THREE.Vector3(0, 0, 0))
    })

    // const r2 = new THREE.Euler(-Math.PI / 2, Math.PI / 2, Math.PI / 2)
    // easing.dampE(state.scene.children[0].rotation, r2, scrollSmoothTime, dt)
    // state.scene.children.rotation.set(new Euler(0, 1, 0))
  })

  return (
    // <group position={[0, 0, 8]} rotation={[Math.PI / 2, 0, 0]}>
    //   {images.map((image, i) => {
    //     return (
    //       <group position={[...imagePositions[i]]}>
    //         <Frame>
    //           <Image
    //             url={image}
    //             position={[0, 0, -2]}
    //             scale={[IMAGE_SIZE, (IMAGE_SIZE * 9) / 16]}
    //           />
    //         </Frame>
    //       </group>
    //     )
    //   })}
    // </group>
    <group position={[0, 0, 8]} rotation={[Math.PI / 2, 0, 0]}>
      {images.map((image, i) => {
        return (
          <group position={[...imagePositions[i]]}>
            <Image
              key={i}
              url={image}
              position={[0, 0, 0]}
              // position={[...imagePositions[i]]}
              scale={[IMAGE_SIZE, (IMAGE_SIZE * 9) / 16]}
            />
          </group>
        )
      })}
    </group>
  )
}

// function Frame({ children, ...props }) {
//   return (
//     <group {...props}>
//       <mesh>
//         <roundedPlaneGeometry args={[9, (9 * 9) / 16]} />
//         <MeshPortalMaterial side={THREE.DoubleSide}>
//           {children}
//         </MeshPortalMaterial>
//       </mesh>
//     </group>
//   )
// }

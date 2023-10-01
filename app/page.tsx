'use client'

import { useEffect, useState, useRef } from 'react'
import NextImage from 'next/image'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { CameraControls, Image, MeshPortalMaterial } from '@react-three/drei'
import { easing, geometry } from 'maath'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import Overlay from './components/overlay'
import gsap from 'gsap'

extend(geometry)

const IMAGE_SIZE = 3.1
const images = [
  '/images/1.webp',
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.webp',
  '/images/5.webp',
]

export default function Portal() {
  return (
    <>
      <main className='relative w-full min-h-screen'>
        <Overlay />
      </main>
      <div className='fixed left-0 top-0 w-full h-screen'>
        <Canvas
          camera={{
            fov: 60,
            position: [0, 0, 0.5],
            // rotation: [0, 0, -Math.PI / 64],
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
  const scroll = useScrollPosition()
  const [scrollSmoothTime, setScrollSmoothTime] = useState(0.4)
  let oldDelta = 0

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
    let fixedDelta = 0
    if (oldDelta === scroll.delta) {
      fixedDelta = 0
    } else {
      fixedDelta = scroll.delta
    }
    oldDelta = scroll.delta

    const p = new THREE.Vector3(state.camera.position.x, scroll.scrollPos, 1)
    easing.damp3(state.camera.position, p, scrollSmoothTime, dt)

    const group = state.scene.children[0]
    const squish = new THREE.Vector3(
      1,
      1 + Math.abs(fixedDelta / 250),
      1 + Math.abs(fixedDelta / 250)
    )
    easing.damp3(group.scale, squish, scrollSmoothTime, dt)

    const reset = new THREE.Vector3(0, 0, 0)
    easing.damp3(group.position, reset, scrollSmoothTime, dt)

    const images = [...group.children]
    images.forEach((image, i) => {
      const s = new THREE.Vector3(
        Math.abs(1 - fixedDelta / 500),
        1 - Math.abs(fixedDelta / 250),
        1
      )
      easing.damp3(image.scale, s, scrollSmoothTime * 2, dt)
      const p1 = new THREE.Vector3(
        0 - fixedDelta / 500,
        0,
        0 - fixedDelta / 500
      )
      easing.damp3(image.position, p1, scrollSmoothTime * 2, dt)
    })
  })

  return <Cards />
}

function Cards({ ...props }) {
  return (
    <group position={[0, 2, 0]}>
      {images.map((image, i) => {
        return (
          <group key={i}>
            <mesh position={[0, -i, 0]}>
              {/* @ts-ignore */}
              <roundedPlaneGeometry args={[1, (1 * 9) / 16, 0.1]} />
              <MeshPortalMaterial side={THREE.DoubleSide}>
                <Image
                  url={image}
                  position={[0, 0, -1]}
                  scale={[IMAGE_SIZE, (IMAGE_SIZE * 9) / 16]}
                />
              </MeshPortalMaterial>
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

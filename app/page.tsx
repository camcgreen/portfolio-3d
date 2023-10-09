'use client'

import { useEffect, useState, useRef } from 'react'
import NextImage from 'next/image'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { CameraControls, Image, MeshPortalMaterial } from '@react-three/drei'
import { easing, geometry } from 'maath'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useMousePosition } from '@/hooks/useMousePosition'
import Overlay from './components/overlay'
import gsap from 'gsap'
import { clamp, pixelToSceneUnits } from '../utils/helpers'

extend(geometry)

const IMAGE_SIZE = 4
const images = [
  '/images/1.webp',
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.webp',
  '/images/5.webp',
]

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
            position: [0, 0, 0],
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
  const mousePos = useMousePosition()
  const [introAnimFinished, setIntroAnimFinished] = useState<boolean>(false)
  const [scrollSmoothTime, setScrollSmoothTime] = useState<number>(0.4)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  let oldDelta = 0

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null

    if (window.innerWidth < 1100) {
      timeout = setTimeout(() => {
        setScrollSmoothTime(0.000001)
        setIntroAnimFinished(true)
        setIsMobile(true)
      }, 1000)
    } else {
      timeout = setTimeout(() => {
        setScrollSmoothTime(0.2)
        setIntroAnimFinished(true)
        setIsMobile(false)
      }, 1000)
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

    if (!isMobile) {
      const group = state.scene.children[0]
      const squish = new THREE.Vector3(
        1,
        1 + Math.abs(fixedDelta / 250),
        1 + Math.abs(fixedDelta / 250)
      )
      easing.damp3(group.scale, squish, scrollSmoothTime, dt)

      // const roundedPlanes = state.scene.children[0]
      // console.log(roundedPlanes)

      if (!introAnimFinished) {
        const reset = new THREE.Vector3(0, 0, 0)
        easing.damp3(group.position, reset, scrollSmoothTime, dt)
      } else {
        const mouseTarget = new THREE.Vector3(
          clamp(mousePos.x / 10, -0.03, 0.03),
          clamp(mousePos.y / 10, -0.03, 0.03),
          // 0
          clamp(-Math.abs(fixedDelta / 50), -2.5, 0)
        )
        easing.damp3(group.position, mouseTarget, scrollSmoothTime * 4, dt)
      }

      const imageParent = [...group.children]
      imageParent.forEach((image, i) => {
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
        // easing.damp3(image.position, p1, scrollSmoothTime * 2, dt)

        const roundedPlane = image.children[0]
        const scaleY = clamp(1 - Math.abs(fixedDelta / 50), 0.9, 1)
        const s2 = new THREE.Vector3(scaleY, scaleY, 1)
        easing.damp3(roundedPlane.scale, s2, scrollSmoothTime * 4, dt)

        const rot = 2 * clamp(fixedDelta / 50, -0.15, 0.15)
        const r = new THREE.Euler(rot, rot, 0)
        easing.dampE(roundedPlane.rotation, r, scrollSmoothTime * 4, dt)
      })
    }
  })

  return <Cards isMobile={isMobile} />
}

function Cards({}) {
  const { camera } = useThree()
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const { pixelWidth, pixelHeight } = pixelToSceneUnits(
        window.innerWidth,
        window.innerHeight,
        camera,
        1
      )
      setWidth(1000 * pixelWidth)
    }
  }, [])
  return (
    <group position={[0, 0, 0]}>
      {images.map((image, i) => {
        return (
          <group key={i}>
            <mesh position={[0, -i, 0]}>
              {/* @ts-ignore */}
              <roundedPlaneGeometry
                args={[width, (width * 9) / 16, 0.1]}
                radius={2}
                segments={4}
              />
              <MeshPortalMaterial side={THREE.DoubleSide}>
                <Image
                  url={image}
                  position={[0, 0, -1]}
                  scale={[width * 2.75, (width * 2.75 * 9) / 16]}
                />
              </MeshPortalMaterial>
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

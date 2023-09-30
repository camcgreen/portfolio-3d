'use client'

import { useEffect, useState, useRef } from 'react'
import NextImage from 'next/image'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, Image } from '@react-three/drei'
import { easing } from 'maath'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import Overlay from './components/overlay'

/**
 * Calculate positions for items along the circumference of an ellipse (modified semi-circle).
 *
 * @param {number} radius - The radius of the base semi-circle before modifications.
 * @param {number} itemCount - The total number of items.
 * @returns {Array<[number, number, number]>} An array of [x, y, z] positions for each item.
 */
function positionsOnEllipse(
  radius: number,
  itemCount: number
): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = []

  // The angle between each item (in radians).
  const deltaTheta = Math.PI / (itemCount - 1)

  for (let i = 0; i < itemCount; i++) {
    const theta = -Math.PI / 2 + i * deltaTheta

    // Calculate position on a regular semi-circle
    const baseX = radius * Math.cos(theta)
    const baseY = radius * Math.sin(theta)

    // Adjust for the squash and stretch
    // const x = baseX * 1 // Squash width-wise by a factor of 4
    const x = 0 // Squash width-wise by a factor of 4
    const y = baseY * 1 // Stretch length-wise by a factor of 4
    const z = -baseX * 1

    positions.push([x, y, z])
  }

  return positions
}

export default function Home() {
  return (
    <>
      <main className='relative w-full min-h-screen'>
        <Overlay />
      </main>
      <div className='fixed left-0 top-0 w-full h-screen'>
        <Canvas
          camera={{
            fov: 48,
            // position: [0, -60, 5],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
          }}
          shadows
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
  const IMAGE_SIZE = 8
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
    // console.log(state.scene.children[0])
    // const p = new THREE.Vector3(0, scrollPos, 5)
    // easing.damp3(state.camera.position, p, scrollSmoothTime, dt)

    // const p = new THREE.Vector3(0, -scrollPos, 0)
    // easing.damp3(group.position, r, scrollSmoothTime, dt)
    const group = state.scene.children[0]
    const r = new THREE.Euler(-Math.PI / 2 - scrollPos, 0, 0)
    easing.damp3(group.rotation, r, scrollSmoothTime, dt)
    // easing.damp3(state.camera.position, p, scrollSmoothTime, dt)

    const images = [...group.children]
    images.forEach((image, i) => {
      // if (i === 0) console.log(image)
      image.lookAt(new THREE.Vector3(0, 0, 0))
    })
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {images.map((image, i) => {
        return (
          <Image
            url={image}
            // position={[0, -3 * i, 0]}
            position={[...imagePositions[i]]}
            scale={[IMAGE_SIZE, (IMAGE_SIZE * 9) / 16]}
          />
        )
      })}
    </group>
  )
}

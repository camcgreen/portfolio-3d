'use client'

// TRY USING JUST ONE PORTAL AND PUTTING ALL OF THE CARDS BEHIND IT
// https://codesandbox.io/s/image-portals-parallax-fn5d6c?file=/src/App.js

import { useEffect, useState, useRef } from 'react'
import NextImage from 'next/image'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import {
  CameraControls,
  Image,
  MeshPortalMaterial,
  useGLTF,
} from '@react-three/drei'
import { easing, geometry } from 'maath'
import { dampLookAt } from 'maath/easing'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { positionsOnEllipse } from '../../utils/helpers'
import Overlay from '../components/overlay.tsx'
import gsap from 'gsap'

extend(geometry)

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
            position: [0, 0, 0],
            // position: [0, 0, 10],
            // rotation: [0, 0, -Math.PI / 32],
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
  // const delta = useScrollPosition()
  const [scrollSmoothTime, setScrollSmoothTime] = useState(0.4)
  const { camera } = useThree()
  const IMAGE_SIZE = 15
  let oldDelta = 0
  const images = [
    '/images/1.webp',
    '/images/2.webp',
    '/images/3.webp',
    '/images/4.webp',
    '/images/5.webp',
    '/images/6.webp',
    '/images/7.webp',
    '/images/9.webp',
    '/images/8.webp',
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
    function remap(val, oldMin, oldMax, newMin, newMax) {
      return newMin + ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)
    }
    const group = state.scene.children[0]
    let remappedRot = remap(scroll.delta, 0, 300, 0, Math.PI / 8)
    const r = new THREE.Euler(-Math.PI / 2 - scroll.scrollPos, 0, 0)
    easing.dampE(group.rotation, r, scrollSmoothTime, dt)
    let fixedDelta = 0
    if (oldDelta === scroll.delta) {
      fixedDelta = 0
    } else {
      fixedDelta = scroll.delta
    }
    const squish = new THREE.Vector3(
      1,
      1 + Math.abs(fixedDelta / 100),
      1 + Math.abs(fixedDelta / 100)
    )
    easing.damp3(group.scale, squish, scrollSmoothTime, dt)
    oldDelta = scroll.delta
    let remappedVal = remap(fixedDelta, 0, 300, 12, 16)
    const p = new THREE.Vector3(0, 0, remappedVal)
    easing.damp3(group.position, p, scrollSmoothTime, dt)
    // const children = [...group.children]
    // children.forEach((child, i) => {
    //   const img = child.children[0]
    //   const scalar = 1 + Math.abs(fixedDelta / 100)
    //   gsap.to(img.material, {
    //     zoom: scalar,
    //     duration: scrollSmoothTime * 10,
    //     ease: 'circ.out',
    //   })
    // })
    const images = [...group.children]
    // images.forEach((image, i) => {
    images.forEach((image, i) => {
      image.lookAt(new THREE.Vector3(0, 0, 0))
      const s = new THREE.Vector3(
        Math.abs(1 - fixedDelta / 100),
        1 - Math.abs(fixedDelta / 100),
        1
      )
      easing.damp3(image.scale, s, scrollSmoothTime * 2, dt)
      const p1 = new THREE.Vector3(
        imagePositions[i][0] - fixedDelta / 50,
        imagePositions[i][1] - fixedDelta / 50,
        imagePositions[i][2] - fixedDelta / 50
      )
      easing.damp3(image.position, p1, scrollSmoothTime * 2, dt)
    })
  })

  return (
    // <Model />
    <group position={[0, 0, 12]} rotation={[Math.PI / 2, 0, 0]}>
      {images.map((image, i) => {
        return (
          <group position={[...imagePositions[i]]}>
            {/* <mesh>
              <roundedPlaneGeometry
                args={[IMAGE_SIZE, (IMAGE_SIZE * 9) / 16]}
              />
              <meshBasicMaterial color='white ' side={THREE.DoubleSide} />
            </mesh> */}
            {/* <Model /> */}
            <Image
              key={i}
              url={image}
              position={[0, 0, -1]}
              scale={[IMAGE_SIZE, (IMAGE_SIZE * 9) / 16]}
            />
          </group>
        )
      })}
    </group>
  )
}

function Model(props) {
  const { nodes, materials } = useGLTF('/models/rounded2.glb')
  return (
    <group
      {...props}
      dispose={null}
      rotation={[-Math.PI / 2, Math.PI / 2, 0]}
      position={[0, 0, 1]}
      scale={[5.5, 1, 5.5]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane005.geometry}
        material={materials['Material.004']}
      >
        {/* <meshStandardMaterial color='green' /> */}
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/rounded2.glb')

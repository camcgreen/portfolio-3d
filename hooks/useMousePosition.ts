import { useState, useEffect, useRef } from 'react'

export const useMousePosition = () => {
  // const [mousePosX, setMousePosX] = useState<number>(0)
  // const [mousePosY, setMousePosY] = useState<number>(0)

  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let x: number
    let y: number

    const handleMouseMove = (e: MouseEvent) => {
      // e.preventDefault()
      // for some reason this changes delta??
      // x = e.clientX
      // y = e.clientY
      // setMousePosX(x)
      // setMousePosY(y)
      mousePosRef.current.x = e.clientX
      mousePosRef.current.y = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // return {
  //   x: mousePosX,
  //   y: mousePosY,
  // }

  return mousePosRef.current
}

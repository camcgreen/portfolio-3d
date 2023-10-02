import { useEffect, useRef } from 'react'

export const useMousePosition = () => {
  const mousePosRef = useRef({ x: 0, y: 0 })

  function getNormalizedCoordinates(width, height) {
    // Calculate the normalized coordinates of the screen
    const x = 2 * (width / window.innerWidth) - 1
    const y = 1 - 2 * (height / window.innerHeight)

    return { x, y }
  }

  useEffect(() => {
    let x: number
    let y: number

    const handleMouseMove = (e: MouseEvent) => {
      // mousePosRef.current.x = e.clientX
      // mousePosRef.current.y = e.clientY
      const coords = getNormalizedCoordinates(e.clientX, e.clientY)
      mousePosRef.current.x = coords.x
      mousePosRef.current.y = coords.y
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return mousePosRef.current
}

import { useState, useEffect } from 'react'

export const useMousePosition = () => {
  const [mousePosX, setMousePosX] = useState<number>(0)
  const [mousePosY, setMousePosY] = useState<number>(0)

  useEffect(() => {
    let x: number
    let y: number

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()

      x = e.clientX
      y = e.clientY

      setMousePosX(x)
      setMousePosY(y)
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return {
    x: mousePosX,
    y: mousePosY,
  }
}

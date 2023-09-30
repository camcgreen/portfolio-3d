import { useState, useEffect } from 'react'

export const useScrollPosition = () => {
  const [scrollPos, setScrollPos] = useState(0)
  let scrollPosTmp = 0

  useEffect(() => {
    let lastKnownScrollPosition = 0
    let deltaY = 0

    const handleScroll = () => {
      deltaY = window.scrollY - lastKnownScrollPosition
      lastKnownScrollPosition = window.scrollY
      scrollPosTmp -= deltaY / 300
      setScrollPos(scrollPosTmp)
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollPos
}

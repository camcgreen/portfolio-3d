import { useState, useEffect } from 'react'

export const useScrollPosition = () => {
  const [scrollPos, setScrollPos] = useState(0)
  const [delta, setDelta] = useState(0)
  let scrollPosTmp = 0

  useEffect(() => {
    let lastKnownScrollPosition = 0
    let deltaY = 0

    const scrollSpeed = window.innerWidth < 1100 ? 1000 : 300

    const handleScroll = () => {
      deltaY = window.scrollY - lastKnownScrollPosition
      lastKnownScrollPosition = window.scrollY
      scrollPosTmp -= deltaY / scrollSpeed
      setDelta(deltaY)
      setScrollPos(scrollPosTmp)
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return {
    scrollPos,
    delta,
  }
}

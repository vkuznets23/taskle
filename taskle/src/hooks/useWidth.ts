import { useEffect, useState } from 'react'

// export default function useWidth() {
//   const [width, setWidth] = useState(
//     typeof window !== 'undefined' ? window.innerWidth : 0
//   )

//   useEffect(() => {
//     const handleResize = () => {
//       if (typeof window === 'undefined') return
//       setWidth(window.innerWidth)
//     }

//     handleResize()

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   })

//   return width
// }

export default function useBreakpoint(query: string) {
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

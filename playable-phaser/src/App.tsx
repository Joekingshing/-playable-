import { useEffect, useRef } from 'react'
import { createGame } from './game'

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const game = createGame(containerRef.current)

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div className="app">
      <div className="phaser-container" ref={containerRef} />
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'

export function useTimer(running: boolean, startTime: number | null, pausedElapsed: number): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!running || startTime === null) {
      setElapsed(pausedElapsed)
      return
    }

    const update = () => {
      setElapsed(Date.now() - startTime + pausedElapsed)
    }

    update()
    const interval = setInterval(update, 100)
    return () => clearInterval(interval)
  }, [running, startTime, pausedElapsed])

  return elapsed
}

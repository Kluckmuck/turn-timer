import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../../src/hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when not running', () => {
    const { result } = renderHook(() => useTimer(false, null, 0))
    expect(result.current).toBe(0)
  })

  it('counts up when running', () => {
    const startTime = Date.now()
    const { result } = renderHook(() => useTimer(true, startTime, 0))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBeGreaterThanOrEqual(1000)
  })

  it('includes pausedElapsed in the total', () => {
    const startTime = Date.now()
    const { result } = renderHook(() => useTimer(true, startTime, 5000))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBeGreaterThanOrEqual(6000)
  })

  it('stops counting when not running', () => {
    const startTime = Date.now()
    const { result, rerender } = renderHook(
      ({ running, start, paused }) => useTimer(running, start, paused),
      { initialProps: { running: true, start: startTime, paused: 0 } }
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    rerender({ running: false, start: startTime, paused: 0 })

    const valueAfterStop = result.current

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe(valueAfterStop)
  })
})

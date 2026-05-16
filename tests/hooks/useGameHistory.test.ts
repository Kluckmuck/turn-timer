import { renderHook, act } from '@testing-library/react'
import { useGameHistory } from '../../src/hooks/useGameHistory'
import { GameSession } from '../../src/types/game'

const STORAGE_KEY = 'turn-timer-history'

describe('useGameHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no history exists', () => {
    const { result } = renderHook(() => useGameHistory())
    expect(result.current.sessions).toEqual([])
  })

  it('loads existing history from localStorage', () => {
    const sessions: GameSession[] = [{
      id: '1',
      startedAt: 1000,
      endedAt: 5000,
      players: [{ id: 'p1', name: 'Alice', color: '#EF4444' }],
      turns: [],
    }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))

    const { result } = renderHook(() => useGameHistory())
    expect(result.current.sessions).toEqual(sessions)
  })

  it('saves a session to history', () => {
    const { result } = renderHook(() => useGameHistory())
    const session: GameSession = {
      id: '1',
      startedAt: 1000,
      endedAt: 5000,
      players: [{ id: 'p1', name: 'Alice', color: '#EF4444' }],
      turns: [],
    }

    act(() => {
      result.current.saveSession(session)
    })

    expect(result.current.sessions).toHaveLength(1)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
  })

  it('clears all history', () => {
    const session: GameSession = {
      id: '1',
      startedAt: 1000,
      endedAt: 5000,
      players: [{ id: 'p1', name: 'Alice', color: '#EF4444' }],
      turns: [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([session]))

    const { result } = renderHook(() => useGameHistory())

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.sessions).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]')
  })
})

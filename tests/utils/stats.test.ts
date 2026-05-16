import { computePlayerStats } from '../../src/utils/stats'
import { Turn } from '../../src/types/game'

describe('computePlayerStats', () => {
  const turns: Turn[] = [
    { playerId: 'p1', startTime: 0, duration: 5000 },
    { playerId: 'p2', startTime: 5000, duration: 3000 },
    { playerId: 'p1', startTime: 8000, duration: 7000 },
    { playerId: 'p2', startTime: 15000, duration: 2000 },
    { playerId: 'p1', startTime: 17000, duration: 3000 },
  ]

  it('computes total time for a player', () => {
    const stats = computePlayerStats('p1', turns)
    expect(stats.totalTime).toBe(15000)
  })

  it('computes average turn time', () => {
    const stats = computePlayerStats('p1', turns)
    expect(stats.averageTurnTime).toBe(5000)
  })

  it('computes longest turn', () => {
    const stats = computePlayerStats('p1', turns)
    expect(stats.longestTurn).toBe(7000)
  })

  it('computes shortest turn', () => {
    const stats = computePlayerStats('p1', turns)
    expect(stats.shortestTurn).toBe(3000)
  })

  it('computes turn count', () => {
    const stats = computePlayerStats('p1', turns)
    expect(stats.turnCount).toBe(3)
  })

  it('returns zeros for a player with no turns', () => {
    const stats = computePlayerStats('p3', turns)
    expect(stats.totalTime).toBe(0)
    expect(stats.turnCount).toBe(0)
    expect(stats.averageTurnTime).toBe(0)
    expect(stats.longestTurn).toBe(0)
    expect(stats.shortestTurn).toBe(0)
  })
})

import type { Turn, PlayerStats } from '../types/game'

export function computePlayerStats(playerId: string, turns: Turn[]): PlayerStats {
  const playerTurns = turns.filter(t => t.playerId === playerId)

  if (playerTurns.length === 0) {
    return {
      playerId,
      totalTime: 0,
      averageTurnTime: 0,
      longestTurn: 0,
      shortestTurn: 0,
      turnCount: 0,
    }
  }

  const totalTime = playerTurns.reduce((sum, t) => sum + t.duration, 0)
  const turnCount = playerTurns.length
  const averageTurnTime = Math.round(totalTime / turnCount)
  const longestTurn = Math.max(...playerTurns.map(t => t.duration))
  const shortestTurn = Math.min(...playerTurns.map(t => t.duration))

  return { playerId, totalTime, averageTurnTime, longestTurn, shortestTurn, turnCount }
}

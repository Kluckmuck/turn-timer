export interface Player {
  id: string
  name: string
  color: string
}

export interface Turn {
  playerId: string
  startTime: number
  duration: number
}

export interface GameSession {
  id: string
  startedAt: number
  endedAt: number | null
  players: Player[]
  turns: Turn[]
}

export interface PlayerStats {
  playerId: string
  totalTime: number
  averageTurnTime: number
  longestTurn: number
  shortestTurn: number
  turnCount: number
}

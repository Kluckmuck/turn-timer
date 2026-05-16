import type { Player, Turn } from '../types/game'

export interface GameState {
  players: Player[]
  isActive: boolean
  isPaused: boolean
  startedAt: number | null
  endedAt: number | null
  activePlayerId: string | null
  currentTurnStart: number | null
  pausedElapsed: number
  turns: Turn[]
}

export const initialGameState: GameState = {
  players: [],
  isActive: false,
  isPaused: false,
  startedAt: null,
  endedAt: null,
  activePlayerId: null,
  currentTurnStart: null,
  pausedElapsed: 0,
  turns: [],
}

export type GameAction =
  | { type: 'START_GAME'; players: Player[]; timestamp: number }
  | { type: 'CLAIM_TURN'; playerId: string; timestamp: number }
  | { type: 'PAUSE'; timestamp: number }
  | { type: 'RESUME'; timestamp: number }
  | { type: 'END_GAME'; timestamp: number }
  | { type: 'RESET' }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialGameState,
        players: action.players,
        isActive: true,
        startedAt: action.timestamp,
      }

    case 'CLAIM_TURN': {
      if (state.activePlayerId === action.playerId) return state

      const turns = [...state.turns]
      if (state.activePlayerId && state.currentTurnStart !== null) {
        const duration =
          state.pausedElapsed > 0
            ? state.pausedElapsed
            : action.timestamp - state.currentTurnStart
        turns.push({
          playerId: state.activePlayerId,
          startTime: state.currentTurnStart,
          duration,
        })
      }

      return {
        ...state,
        activePlayerId: action.playerId,
        currentTurnStart: action.timestamp,
        pausedElapsed: 0,
        turns,
      }
    }

    case 'PAUSE': {
      if (!state.activePlayerId || state.currentTurnStart === null) return state
      const elapsed = action.timestamp - state.currentTurnStart + state.pausedElapsed
      return {
        ...state,
        isPaused: true,
        pausedElapsed: elapsed,
      }
    }

    case 'RESUME':
      return {
        ...state,
        isPaused: false,
        currentTurnStart: action.timestamp,
        pausedElapsed: 0,
      }

    case 'END_GAME': {
      const turns = [...state.turns]
      if (state.activePlayerId && state.currentTurnStart !== null) {
        const duration = state.isPaused
          ? state.pausedElapsed
          : action.timestamp - state.currentTurnStart + state.pausedElapsed
        turns.push({
          playerId: state.activePlayerId,
          startTime: state.currentTurnStart,
          duration,
        })
      }
      return {
        ...state,
        isActive: false,
        endedAt: action.timestamp,
        activePlayerId: null,
        turns,
      }
    }

    case 'RESET':
      return initialGameState

    default:
      return state
  }
}

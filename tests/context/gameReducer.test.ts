import { gameReducer, initialGameState, GameState } from '../../src/context/gameReducer'

describe('gameReducer', () => {
  const players = [
    { id: 'p1', name: 'Alice', color: '#EF4444' },
    { id: 'p2', name: 'Bob', color: '#3B82F6' },
  ]

  describe('START_GAME', () => {
    it('sets players and marks game as active', () => {
      const state = gameReducer(initialGameState, {
        type: 'START_GAME',
        players,
        timestamp: 1000,
      })
      expect(state.players).toEqual(players)
      expect(state.isActive).toBe(true)
      expect(state.startedAt).toBe(1000)
      expect(state.activePlayerId).toBeNull()
    })
  })

  describe('CLAIM_TURN', () => {
    it('sets active player and starts their turn', () => {
      const started: GameState = {
        ...initialGameState,
        players,
        isActive: true,
        startedAt: 1000,
        activePlayerId: null,
      }
      const state = gameReducer(started, {
        type: 'CLAIM_TURN',
        playerId: 'p1',
        timestamp: 2000,
      })
      expect(state.activePlayerId).toBe('p1')
      expect(state.currentTurnStart).toBe(2000)
    })

    it('records previous turn when switching players', () => {
      const inProgress: GameState = {
        ...initialGameState,
        players,
        isActive: true,
        startedAt: 1000,
        activePlayerId: 'p1',
        currentTurnStart: 2000,
        turns: [],
      }
      const state = gameReducer(inProgress, {
        type: 'CLAIM_TURN',
        playerId: 'p2',
        timestamp: 5000,
      })
      expect(state.activePlayerId).toBe('p2')
      expect(state.currentTurnStart).toBe(5000)
      expect(state.turns).toHaveLength(1)
      expect(state.turns[0]).toEqual({
        playerId: 'p1',
        startTime: 2000,
        duration: 3000,
      })
    })

    it('does nothing if same player taps again', () => {
      const inProgress: GameState = {
        ...initialGameState,
        players,
        isActive: true,
        startedAt: 1000,
        activePlayerId: 'p1',
        currentTurnStart: 2000,
        turns: [],
      }
      const state = gameReducer(inProgress, {
        type: 'CLAIM_TURN',
        playerId: 'p1',
        timestamp: 5000,
      })
      expect(state).toEqual(inProgress)
    })
  })

  describe('PAUSE', () => {
    it('pauses the game and records elapsed time on current turn', () => {
      const inProgress: GameState = {
        ...initialGameState,
        players,
        isActive: true,
        startedAt: 1000,
        activePlayerId: 'p1',
        currentTurnStart: 2000,
        isPaused: false,
        pausedElapsed: 0,
      }
      const state = gameReducer(inProgress, {
        type: 'PAUSE',
        timestamp: 4000,
      })
      expect(state.isPaused).toBe(true)
      expect(state.pausedElapsed).toBe(2000)
    })
  })

  describe('RESUME', () => {
    it('resumes the game and resets turn start', () => {
      const paused: GameState = {
        ...initialGameState,
        players,
        isActive: true,
        startedAt: 1000,
        activePlayerId: 'p1',
        currentTurnStart: 2000,
        isPaused: true,
        pausedElapsed: 2000,
      }
      const state = gameReducer(paused, {
        type: 'RESUME',
        timestamp: 6000,
      })
      expect(state.isPaused).toBe(false)
      expect(state.currentTurnStart).toBe(6000)
      expect(state.pausedElapsed).toBe(0)
    })
  })

  describe('END_GAME', () => {
    it('ends the game and records final turn', () => {
      const inProgress: GameState = {
        ...initialGameState,
        players,
        isActive: true,
        startedAt: 1000,
        activePlayerId: 'p1',
        currentTurnStart: 8000,
        turns: [{ playerId: 'p2', startTime: 5000, duration: 3000 }],
      }
      const state = gameReducer(inProgress, {
        type: 'END_GAME',
        timestamp: 10000,
      })
      expect(state.isActive).toBe(false)
      expect(state.endedAt).toBe(10000)
      expect(state.turns).toHaveLength(2)
      expect(state.turns[1]).toEqual({
        playerId: 'p1',
        startTime: 8000,
        duration: 2000,
      })
    })
  })

  describe('RESET', () => {
    it('returns to initial state', () => {
      const state = gameReducer({ ...initialGameState, isActive: true }, { type: 'RESET' })
      expect(state).toEqual(initialGameState)
    })
  })
})

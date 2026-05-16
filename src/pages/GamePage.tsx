import { useEffect, useState } from 'react'
import type { Player, Turn } from '../types/game'
import { useGame } from '../context/GameContext'
import { useTimer } from '../hooks/useTimer'
import { formatTime } from '../utils/time'
import { PlayerZone } from '../components/PlayerZone'
import { Timer } from '../components/Timer'

interface GamePageProps {
  players: Player[]
  onEnd: (turns: Turn[], startedAt: number, endedAt: number) => void
}

export function GamePage({ players, onEnd }: GamePageProps) {
  const { state, dispatch } = useGame()
  const [showTotals, setShowTotals] = useState(false)

  useEffect(() => {
    dispatch({ type: 'START_GAME', players, timestamp: Date.now() })
  }, [])

  const isRunning = state.isActive && !state.isPaused && state.activePlayerId !== null
  const turnElapsed = useTimer(isRunning, state.currentTurnStart, state.pausedElapsed)

  const gameElapsed = useTimer(
    state.isActive && !state.isPaused,
    state.startedAt,
    0
  )

  function claimTurn(playerId: string) {
    if (state.isPaused) return
    dispatch({ type: 'CLAIM_TURN', playerId, timestamp: Date.now() })
  }

  function togglePause() {
    if (state.isPaused) {
      dispatch({ type: 'RESUME', timestamp: Date.now() })
    } else {
      dispatch({ type: 'PAUSE', timestamp: Date.now() })
    }
  }

  function endGame() {
    const timestamp = Date.now()
    dispatch({ type: 'END_GAME', timestamp })
    const finalTurns = [...state.turns]
    if (state.activePlayerId && state.currentTurnStart !== null) {
      const duration = state.isPaused
        ? state.pausedElapsed
        : timestamp - state.currentTurnStart + state.pausedElapsed
      finalTurns.push({
        playerId: state.activePlayerId,
        startTime: state.currentTurnStart,
        duration,
      })
    }
    onEnd(finalTurns, state.startedAt!, timestamp)
  }

  function getPlayerTotal(playerId: string): number {
    const fromTurns = state.turns
      .filter(t => t.playerId === playerId)
      .reduce((sum, t) => sum + t.duration, 0)
    if (state.activePlayerId === playerId) {
      return fromTurns + turnElapsed
    }
    return fromTurns
  }

  const activePlayer = players.find(p => p.id === state.activePlayerId)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Top bar - game time */}
      <div className="text-center text-gray-400 text-sm mb-2">
        Game Time: <Timer elapsed={gameElapsed} className="font-mono" />
      </div>

      {/* Center - active player */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {activePlayer ? (
          <>
            <div
              data-testid="active-player-name"
              className="text-3xl font-bold mb-2"
              style={{ color: activePlayer.color }}
            >
              {activePlayer.name}
            </div>
            <Timer elapsed={turnElapsed} className="text-5xl font-mono font-bold" />
          </>
        ) : (
          <div className="text-gray-500 text-xl">Tap a player to start</div>
        )}
      </div>

      {/* Player zones */}
      <div className="space-y-2 mb-4">
        {players.map(player => (
          <PlayerZone
            key={player.id}
            name={player.name}
            color={player.color}
            isActive={state.activePlayerId === player.id}
            totalTime={showTotals ? formatTime(getPlayerTotal(player.id)) : undefined}
            onTap={() => claimTurn(player.id)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={togglePause}
          className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold transition"
        >
          {state.isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={() => setShowTotals(!showTotals)}
          className="py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
        >
          {showTotals ? 'Hide Totals' : 'Show Totals'}
        </button>
        <button
          type="button"
          onClick={endGame}
          className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 font-semibold transition"
        >
          End Game
        </button>
      </div>
    </div>
  )
}

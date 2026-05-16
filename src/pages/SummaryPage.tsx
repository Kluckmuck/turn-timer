import type { Player, Turn } from '../types/game'
import { computePlayerStats } from '../utils/stats'
import { formatTime } from '../utils/time'

interface SummaryPageProps {
  players: Player[]
  turns: Turn[]
  startedAt: number
  endedAt: number
  onSave: () => void
  onDiscard: () => void
}

export function SummaryPage({ players, turns, startedAt, endedAt, onSave, onDiscard }: SummaryPageProps) {
  const totalGameTime = endedAt - startedAt

  const playerStats = players.map(player => ({
    player,
    stats: computePlayerStats(player.id, turns),
  }))

  playerStats.sort((a, b) => b.stats.totalTime - a.stats.totalTime)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-2">Game Over</h1>
      <div className="text-center text-gray-400 mb-6">
        Total Game Time: <span className="font-mono text-white">{formatTime(totalGameTime)}</span>
      </div>

      <div className="flex-1 space-y-4">
        {playerStats.map(({ player, stats }, index) => (
          <div
            key={player.id}
            className="bg-gray-800 rounded-xl p-4"
            style={{ borderLeft: `4px solid ${player.color}` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">#{index + 1}</span>
              <span data-testid="player-rank-name" className="font-bold text-lg">{player.name}</span>
              <span className="font-mono">{formatTime(stats.totalTime)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-400">
              <div>
                <div className="text-gray-500">Avg turn</div>
                <div className="text-white font-mono">{formatTime(stats.averageTurnTime)}</div>
              </div>
              <div>
                <div className="text-gray-500">Longest</div>
                <div className="text-white font-mono">{formatTime(stats.longestTurn)}</div>
              </div>
              <div>
                <div className="text-gray-500">Turns</div>
                <div className="text-white font-mono">{stats.turnCount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onDiscard}
          className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
        >
          Save to History
        </button>
      </div>
    </div>
  )
}

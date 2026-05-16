import { useState } from 'react'
import { GameSession } from '../types/game'
import { computePlayerStats } from '../utils/stats'
import { formatTime } from '../utils/time'

interface HistoryPageProps {
  sessions: GameSession[]
  onBack: () => void
  onClear: () => void
}

export function HistoryPage({ sessions, onBack, onClear }: HistoryPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300"
        >
          Back
        </button>
        <h1 className="text-xl font-bold">History</h1>
        <div className="w-10" />
      </div>

      {sessions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No games yet
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {sessions.map(session => {
            const isExpanded = expandedId === session.id
            const duration = (session.endedAt ?? session.startedAt) - session.startedAt
            const playerNames = session.players.map(p => p.name).join(', ')
            const date = new Date(session.startedAt).toLocaleDateString()

            return (
              <div key={session.id} className="bg-gray-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{playerNames}</span>
                    <span className="font-mono text-gray-400">{formatTime(duration)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{date}</div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-700 pt-3">
                    {session.players.map(player => {
                      const stats = computePlayerStats(player.id, session.turns)
                      return (
                        <div key={player.id} className="flex justify-between text-sm">
                          <span style={{ color: player.color }}>{player.name}</span>
                          <span className="font-mono text-gray-300">
                            {formatTime(stats.totalTime)} ({stats.turnCount} turns)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {sessions.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 w-full py-3 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/30 transition"
        >
          Clear History
        </button>
      )}
    </div>
  )
}

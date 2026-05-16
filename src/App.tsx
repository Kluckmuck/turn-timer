import { useState } from 'react'
import type { Player, Turn, GameSession } from './types/game'
import { generateId } from './utils/id'
import { GameProvider } from './context/GameContext'
import { useGameHistory } from './hooks/useGameHistory'
import { SetupPage } from './pages/SetupPage'
import { GamePage } from './pages/GamePage'
import { SummaryPage } from './pages/SummaryPage'
import { HistoryPage } from './pages/HistoryPage'

type Page = 'setup' | 'game' | 'summary' | 'history'

interface GameResult {
  players: Player[]
  turns: Turn[]
  startedAt: number
  endedAt: number
}

function App() {
  const [page, setPage] = useState<Page>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const { sessions, saveSession, clearHistory } = useGameHistory()

  function handleStart(newPlayers: Player[]) {
    setPlayers(newPlayers)
    setPage('game')
  }

  function handleEnd(turns: Turn[], startedAt: number, endedAt: number) {
    setGameResult({ players, turns, startedAt, endedAt })
    setPage('summary')
  }

  function handleSave() {
    if (!gameResult) return
    const session: GameSession = {
      id: generateId(),
      startedAt: gameResult.startedAt,
      endedAt: gameResult.endedAt,
      players: gameResult.players,
      turns: gameResult.turns,
    }
    saveSession(session)
    setGameResult(null)
    setPage('setup')
  }

  function handleDiscard() {
    setGameResult(null)
    setPage('setup')
  }

  switch (page) {
    case 'setup':
      return <SetupPage onStart={handleStart} onHistory={() => setPage('history')} />
    case 'game':
      return (
        <GameProvider>
          <GamePage players={players} onEnd={handleEnd} />
        </GameProvider>
      )
    case 'summary':
      return gameResult ? (
        <SummaryPage
          players={gameResult.players}
          turns={gameResult.turns}
          startedAt={gameResult.startedAt}
          endedAt={gameResult.endedAt}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      ) : null
    case 'history':
      return (
        <HistoryPage
          sessions={sessions}
          onBack={() => setPage('setup')}
          onClear={clearHistory}
        />
      )
  }
}

export default App

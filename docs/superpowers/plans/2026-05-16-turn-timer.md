# Turn Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-friendly web app that tracks per-player turn times during in-person board games on a shared device.

**Architecture:** Pure client-side React SPA. Game state managed via Context + useReducer. Game history persisted to localStorage. No backend.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Vitest, React Testing Library, Vercel

---

## File Structure

```
src/
  types/game.ts                  # Player, Turn, GameSession interfaces
  utils/time.ts                  # formatTime helper
  utils/stats.ts                 # computePlayerStats, computeGameStats
  utils/colors.ts                # COLOR_PALETTE constant
  utils/id.ts                    # generateId helper
  hooks/useTimer.ts              # Interval-based elapsed time hook
  hooks/useGameHistory.ts        # localStorage read/write for history
  context/gameReducer.ts         # Reducer logic (pure function)
  context/GameContext.tsx         # Context provider + dispatch
  components/PlayerZone.tsx       # Tappable player button
  components/Timer.tsx            # Formatted time display
  components/ColorPicker.tsx      # Color selection in setup
  pages/SetupPage.tsx            # Player name/color entry
  pages/GamePage.tsx             # Active game screen
  pages/SummaryPage.tsx          # End-of-game stats
  pages/HistoryPage.tsx          # Past sessions list + detail
  App.tsx                        # Router / page state
  main.tsx                       # Entry point
  index.css                      # Tailwind imports
tests/
  utils/time.test.ts
  utils/stats.test.ts
  context/gameReducer.test.ts
  hooks/useTimer.test.ts
  hooks/useGameHistory.test.ts
  components/PlayerZone.test.tsx
  pages/SetupPage.test.tsx
  pages/GamePage.test.tsx
  pages/SummaryPage.test.tsx
  pages/HistoryPage.test.tsx
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Scaffold Vite React TypeScript project**

```bash
cd /Users/viktorviktorviktor/repos/turn-timer
npm create vite@latest . -- --template react-ts
```

Accept overwrite if prompted for the existing directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Configure Tailwind**

Replace `src/index.css` with:

```css
@import "tailwindcss";
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest'
```

Add to `tsconfig.json` compilerOptions:

```json
"types": ["vitest/globals"]
```

- [ ] **Step 5: Create minimal App to verify setup**

Replace `src/App.tsx`:

```tsx
function App() {
  return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <h1 className="text-3xl font-bold">Turn Timer</h1>
  </div>
}

export default App
```

- [ ] **Step 6: Verify build and dev server**

```bash
npm run build
npm run dev -- --open
```

Expected: App renders dark background with "Turn Timer" heading.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript + Tailwind + Vitest"
```

---

## Task 2: Types & Utility Functions

**Files:**
- Create: `src/types/game.ts`, `src/utils/time.ts`, `src/utils/colors.ts`, `src/utils/id.ts`, `src/utils/stats.ts`
- Test: `tests/utils/time.test.ts`, `tests/utils/stats.test.ts`

- [ ] **Step 1: Create type definitions**

Create `src/types/game.ts`:

```typescript
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
```

- [ ] **Step 2: Write failing tests for time utility**

Create `tests/utils/time.test.ts`:

```typescript
import { formatTime } from '../../src/utils/time'

describe('formatTime', () => {
  it('formats zero milliseconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats seconds correctly', () => {
    expect(formatTime(5000)).toBe('00:05')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(65000)).toBe('01:05')
  })

  it('formats hours when over 60 minutes', () => {
    expect(formatTime(3661000)).toBe('1:01:01')
  })

  it('pads single digit minutes and seconds', () => {
    expect(formatTime(61000)).toBe('01:01')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx vitest run tests/utils/time.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement time utility**

Create `src/utils/time.ts`:

```typescript
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run tests/utils/time.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 6: Create color palette**

Create `src/utils/colors.ts`:

```typescript
export const COLOR_PALETTE = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Orange', hex: '#F97316' },
] as const
```

- [ ] **Step 7: Create ID utility**

Create `src/utils/id.ts`:

```typescript
export function generateId(): string {
  return crypto.randomUUID()
}
```

- [ ] **Step 8: Write failing tests for stats utility**

Create `tests/utils/stats.test.ts`:

```typescript
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
```

- [ ] **Step 9: Run test to verify it fails**

```bash
npx vitest run tests/utils/stats.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 10: Implement stats utility**

Create `src/utils/stats.ts`:

```typescript
import { Turn, PlayerStats } from '../types/game'

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
```

- [ ] **Step 11: Run test to verify it passes**

```bash
npx vitest run tests/utils/stats.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add types, time formatting, color palette, stats utilities"
```

---

## Task 3: Game Reducer

**Files:**
- Create: `src/context/gameReducer.ts`
- Test: `tests/context/gameReducer.test.ts`

- [ ] **Step 1: Write failing tests for the game reducer**

Create `tests/context/gameReducer.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/context/gameReducer.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement game reducer**

Create `src/context/gameReducer.ts`:

```typescript
import { Player, Turn } from '../types/game'

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
        const duration = state.pausedElapsed > 0
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/context/gameReducer.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement game state reducer with full turn tracking"
```

---

## Task 4: Game Context Provider

**Files:**
- Create: `src/context/GameContext.tsx`

- [ ] **Step 1: Implement the context provider**

Create `src/context/GameContext.tsx`:

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react'
import { gameReducer, initialGameState, GameState, GameAction } from './gameReducer'

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add GameContext provider and useGame hook"
```

---

## Task 5: useTimer Hook

**Files:**
- Create: `src/hooks/useTimer.ts`
- Test: `tests/hooks/useTimer.test.ts`

- [ ] **Step 1: Write failing test for useTimer**

Create `tests/hooks/useTimer.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../../src/hooks/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when not running', () => {
    const { result } = renderHook(() => useTimer(false, null, 0))
    expect(result.current).toBe(0)
  })

  it('counts up when running', () => {
    const startTime = Date.now()
    const { result } = renderHook(() => useTimer(true, startTime, 0))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBeGreaterThanOrEqual(1000)
  })

  it('includes pausedElapsed in the total', () => {
    const startTime = Date.now()
    const { result } = renderHook(() => useTimer(true, startTime, 5000))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBeGreaterThanOrEqual(6000)
  })

  it('stops counting when not running', () => {
    const startTime = Date.now()
    const { result, rerender } = renderHook(
      ({ running, start, paused }) => useTimer(running, start, paused),
      { initialProps: { running: true, start: startTime, paused: 0 } }
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    rerender({ running: false, start: startTime, paused: 0 })

    const valueAfterStop = result.current

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe(valueAfterStop)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/hooks/useTimer.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement useTimer**

Create `src/hooks/useTimer.ts`:

```typescript
import { useState, useEffect } from 'react'

export function useTimer(running: boolean, startTime: number | null, pausedElapsed: number): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!running || startTime === null) {
      setElapsed(pausedElapsed)
      return
    }

    const update = () => {
      setElapsed(Date.now() - startTime + pausedElapsed)
    }

    update()
    const interval = setInterval(update, 100)
    return () => clearInterval(interval)
  }, [running, startTime, pausedElapsed])

  return elapsed
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/hooks/useTimer.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useTimer hook for elapsed time tracking"
```

---

## Task 6: useGameHistory Hook

**Files:**
- Create: `src/hooks/useGameHistory.ts`
- Test: `tests/hooks/useGameHistory.test.ts`

- [ ] **Step 1: Write failing test for useGameHistory**

Create `tests/hooks/useGameHistory.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/hooks/useGameHistory.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement useGameHistory**

Create `src/hooks/useGameHistory.ts`:

```typescript
import { useState } from 'react'
import { GameSession } from '../types/game'

const STORAGE_KEY = 'turn-timer-history'

function loadSessions(): GameSession[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  return JSON.parse(raw)
}

function persistSessions(sessions: GameSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function useGameHistory() {
  const [sessions, setSessions] = useState<GameSession[]>(loadSessions)

  function saveSession(session: GameSession) {
    const updated = [session, ...sessions]
    setSessions(updated)
    persistSessions(updated)
  }

  function clearHistory() {
    setSessions([])
    persistSessions([])
  }

  return { sessions, saveSession, clearHistory }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/hooks/useGameHistory.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useGameHistory hook for localStorage persistence"
```

---

## Task 7: Setup Page

**Files:**
- Create: `src/pages/SetupPage.tsx`, `src/components/ColorPicker.tsx`
- Test: `tests/pages/SetupPage.test.tsx`

- [ ] **Step 1: Write failing tests for SetupPage**

Create `tests/pages/SetupPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SetupPage } from '../../src/pages/SetupPage'

describe('SetupPage', () => {
  const mockOnStart = vi.fn()
  const mockOnHistory = vi.fn()

  beforeEach(() => {
    mockOnStart.mockClear()
    mockOnHistory.mockClear()
  })

  it('renders with one empty player row by default', () => {
    render(<SetupPage onStart={mockOnStart} onHistory={mockOnHistory} />)
    expect(screen.getByPlaceholderText('Player 1')).toBeInTheDocument()
  })

  it('adds a player when clicking Add Player', async () => {
    const user = userEvent.setup()
    render(<SetupPage onStart={mockOnStart} onHistory={mockOnHistory} />)

    await user.click(screen.getByText('Add Player'))
    expect(screen.getByPlaceholderText('Player 2')).toBeInTheDocument()
  })

  it('does not allow more than 6 players', async () => {
    const user = userEvent.setup()
    render(<SetupPage onStart={mockOnStart} onHistory={mockOnHistory} />)

    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByText('Add Player'))
    }

    expect(screen.queryByText('Add Player')).not.toBeInTheDocument()
  })

  it('does not start with fewer than 2 players with names', async () => {
    const user = userEvent.setup()
    render(<SetupPage onStart={mockOnStart} onHistory={mockOnHistory} />)

    await user.type(screen.getByPlaceholderText('Player 1'), 'Alice')
    await user.click(screen.getByText('Start Game'))

    expect(mockOnStart).not.toHaveBeenCalled()
  })

  it('starts game when at least 2 players have names', async () => {
    const user = userEvent.setup()
    render(<SetupPage onStart={mockOnStart} onHistory={mockOnHistory} />)

    await user.type(screen.getByPlaceholderText('Player 1'), 'Alice')
    await user.click(screen.getByText('Add Player'))
    await user.type(screen.getByPlaceholderText('Player 2'), 'Bob')
    await user.click(screen.getByText('Start Game'))

    expect(mockOnStart).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Alice' }),
        expect.objectContaining({ name: 'Bob' }),
      ])
    )
  })

  it('shows History button', () => {
    render(<SetupPage onStart={mockOnStart} onHistory={mockOnHistory} />)
    expect(screen.getByText('History')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/pages/SetupPage.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ColorPicker**

Create `src/components/ColorPicker.tsx`:

```tsx
import { COLOR_PALETTE } from '../utils/colors'

interface ColorPickerProps {
  selected: string
  usedColors: string[]
  onChange: (color: string) => void
}

export function ColorPicker({ selected, usedColors, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {COLOR_PALETTE.map(({ hex }) => {
        const isUsed = usedColors.includes(hex) && hex !== selected
        return (
          <button
            key={hex}
            type="button"
            disabled={isUsed}
            onClick={() => onChange(hex)}
            className={`w-8 h-8 rounded-full border-2 transition-transform ${
              hex === selected ? 'border-white scale-110' : 'border-transparent'
            } ${isUsed ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            style={{ backgroundColor: hex }}
            aria-label={`Select color ${hex}`}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Implement SetupPage**

Create `src/pages/SetupPage.tsx`:

```tsx
import { useState } from 'react'
import { Player } from '../types/game'
import { COLOR_PALETTE } from '../utils/colors'
import { generateId } from '../utils/id'
import { ColorPicker } from '../components/ColorPicker'

interface PlayerRow {
  id: string
  name: string
  color: string
}

interface SetupPageProps {
  onStart: (players: Player[]) => void
  onHistory: () => void
}

export function SetupPage({ onStart, onHistory }: SetupPageProps) {
  const [rows, setRows] = useState<PlayerRow[]>([
    { id: generateId(), name: '', color: COLOR_PALETTE[0].hex },
  ])

  const usedColors = rows.map(r => r.color)

  function addPlayer() {
    const nextColor = COLOR_PALETTE.find(c => !usedColors.includes(c.hex))?.hex ?? COLOR_PALETTE[0].hex
    setRows([...rows, { id: generateId(), name: '', color: nextColor }])
  }

  function removePlayer(id: string) {
    setRows(rows.filter(r => r.id !== id))
  }

  function updateName(id: string, name: string) {
    setRows(rows.map(r => (r.id === id ? { ...r, name } : r)))
  }

  function updateColor(id: string, color: string) {
    setRows(rows.map(r => (r.id === id ? { ...r, color } : r)))
  }

  function handleStart() {
    const players = rows.filter(r => r.name.trim() !== '')
    if (players.length < 2) return
    onStart(players.map(r => ({ id: r.id, name: r.name.trim(), color: r.color })))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-6">Turn Timer</h1>

      <div className="flex-1 space-y-4">
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Player ${index + 1}`}
              value={row.name}
              onChange={e => updateName(row.id, e.target.value)}
              className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ColorPicker
              selected={row.color}
              usedColors={usedColors}
              onChange={color => updateColor(row.id, color)}
            />
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removePlayer(row.id)}
                className="text-gray-500 hover:text-red-400 text-xl"
                aria-label={`Remove player ${index + 1}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {rows.length < 6 && (
          <button
            type="button"
            onClick={addPlayer}
            className="w-full py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
          >
            Add Player
          </button>
        )}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
        >
          Start Game
        </button>
        <button
          type="button"
          onClick={onHistory}
          className="w-full py-3 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
        >
          History
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run tests/pages/SetupPage.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add SetupPage with player name entry and color picking"
```

---

## Task 8: Game Page

**Files:**
- Create: `src/pages/GamePage.tsx`, `src/components/PlayerZone.tsx`, `src/components/Timer.tsx`
- Test: `tests/pages/GamePage.test.tsx`

- [ ] **Step 1: Write failing tests for GamePage**

Create `tests/pages/GamePage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GamePage } from '../../src/pages/GamePage'
import { GameProvider } from '../../src/context/GameContext'

const players = [
  { id: 'p1', name: 'Alice', color: '#EF4444' },
  { id: 'p2', name: 'Bob', color: '#3B82F6' },
]

function renderGamePage() {
  return render(
    <GameProvider>
      <GamePage players={players} onEnd={vi.fn()} />
    </GameProvider>
  )
}

describe('GamePage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders all player zones', () => {
    renderGamePage()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows game time', () => {
    renderGamePage()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('highlights active player when zone is tapped', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    renderGamePage()

    await user.click(screen.getByText('Alice'))
    expect(screen.getByTestId('active-player-name')).toHaveTextContent('Alice')
  })

  it('shows pause button', () => {
    renderGamePage()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('shows end game button', () => {
    renderGamePage()
    expect(screen.getByText('End Game')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/pages/GamePage.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Timer component**

Create `src/components/Timer.tsx`:

```tsx
import { formatTime } from '../utils/time'

interface TimerProps {
  elapsed: number
  className?: string
}

export function Timer({ elapsed, className = '' }: TimerProps) {
  return <span className={className}>{formatTime(elapsed)}</span>
}
```

- [ ] **Step 4: Implement PlayerZone component**

Create `src/components/PlayerZone.tsx`:

```tsx
interface PlayerZoneProps {
  name: string
  color: string
  isActive: boolean
  totalTime?: string
  onTap: () => void
}

export function PlayerZone({ name, color, isActive, totalTime, onTap }: PlayerZoneProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all ${
        isActive ? 'ring-4 ring-white scale-105' : 'opacity-70 hover:opacity-90'
      }`}
      style={{ backgroundColor: color }}
    >
      <div>{name}</div>
      {totalTime && <div className="text-sm font-normal opacity-80">{totalTime}</div>}
    </button>
  )
}
```

- [ ] **Step 5: Implement GamePage**

Create `src/pages/GamePage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Player, Turn } from '../types/game'
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
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run tests/pages/GamePage.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add GamePage with player zones, timer display, and controls"
```

---

## Task 9: Summary Page

**Files:**
- Create: `src/pages/SummaryPage.tsx`
- Test: `tests/pages/SummaryPage.test.tsx`

- [ ] **Step 1: Write failing tests for SummaryPage**

Create `tests/pages/SummaryPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SummaryPage } from '../../src/pages/SummaryPage'
import { Player, Turn } from '../../src/types/game'

const players: Player[] = [
  { id: 'p1', name: 'Alice', color: '#EF4444' },
  { id: 'p2', name: 'Bob', color: '#3B82F6' },
]

const turns: Turn[] = [
  { playerId: 'p1', startTime: 0, duration: 5000 },
  { playerId: 'p2', startTime: 5000, duration: 3000 },
  { playerId: 'p1', startTime: 8000, duration: 7000 },
  { playerId: 'p2', startTime: 15000, duration: 2000 },
]

describe('SummaryPage', () => {
  const mockOnSave = vi.fn()
  const mockOnDiscard = vi.fn()

  beforeEach(() => {
    mockOnSave.mockClear()
    mockOnDiscard.mockClear()
  })

  it('shows total game time', () => {
    render(
      <SummaryPage
        players={players}
        turns={turns}
        startedAt={0}
        endedAt={17000}
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
      />
    )
    expect(screen.getByText('00:17')).toBeInTheDocument()
  })

  it('shows player stats', () => {
    render(
      <SummaryPage
        players={players}
        turns={turns}
        startedAt={0}
        endedAt={17000}
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
      />
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('ranks players by total time descending', () => {
    render(
      <SummaryPage
        players={players}
        turns={turns}
        startedAt={0}
        endedAt={17000}
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
      />
    )
    const names = screen.getAllByTestId('player-rank-name')
    expect(names[0]).toHaveTextContent('Alice')
    expect(names[1]).toHaveTextContent('Bob')
  })

  it('calls onSave when Save is clicked', async () => {
    const user = userEvent.setup()
    render(
      <SummaryPage
        players={players}
        turns={turns}
        startedAt={0}
        endedAt={17000}
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
      />
    )
    await user.click(screen.getByText('Save to History'))
    expect(mockOnSave).toHaveBeenCalled()
  })

  it('calls onDiscard when Discard is clicked', async () => {
    const user = userEvent.setup()
    render(
      <SummaryPage
        players={players}
        turns={turns}
        startedAt={0}
        endedAt={17000}
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
      />
    )
    await user.click(screen.getByText('Discard'))
    expect(mockOnDiscard).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/pages/SummaryPage.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement SummaryPage**

Create `src/pages/SummaryPage.tsx`:

```tsx
import { Player, Turn } from '../types/game'
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/pages/SummaryPage.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SummaryPage with player rankings and game stats"
```

---

## Task 10: History Page

**Files:**
- Create: `src/pages/HistoryPage.tsx`
- Test: `tests/pages/HistoryPage.test.tsx`

- [ ] **Step 1: Write failing tests for HistoryPage**

Create `tests/pages/HistoryPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryPage } from '../../src/pages/HistoryPage'
import { GameSession } from '../../src/types/game'

const sessions: GameSession[] = [
  {
    id: '1',
    startedAt: new Date('2026-05-10T19:00:00').getTime(),
    endedAt: new Date('2026-05-10T19:30:00').getTime(),
    players: [
      { id: 'p1', name: 'Alice', color: '#EF4444' },
      { id: 'p2', name: 'Bob', color: '#3B82F6' },
    ],
    turns: [
      { playerId: 'p1', startTime: 0, duration: 10000 },
      { playerId: 'p2', startTime: 10000, duration: 8000 },
    ],
  },
]

describe('HistoryPage', () => {
  const mockOnBack = vi.fn()
  const mockOnClear = vi.fn()

  beforeEach(() => {
    mockOnBack.mockClear()
    mockOnClear.mockClear()
  })

  it('shows message when no history exists', () => {
    render(<HistoryPage sessions={[]} onBack={mockOnBack} onClear={mockOnClear} />)
    expect(screen.getByText('No games yet')).toBeInTheDocument()
  })

  it('shows session list with player names', () => {
    render(<HistoryPage sessions={sessions} onBack={mockOnBack} onClear={mockOnClear} />)
    expect(screen.getByText('Alice, Bob')).toBeInTheDocument()
  })

  it('shows game duration', () => {
    render(<HistoryPage sessions={sessions} onBack={mockOnBack} onClear={mockOnClear} />)
    expect(screen.getByText('30:00')).toBeInTheDocument()
  })

  it('expands session detail on tap', async () => {
    const user = userEvent.setup()
    render(<HistoryPage sessions={sessions} onBack={mockOnBack} onClear={mockOnClear} />)

    await user.click(screen.getByText('Alice, Bob'))
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('calls onBack when Back is clicked', async () => {
    const user = userEvent.setup()
    render(<HistoryPage sessions={sessions} onBack={mockOnBack} onClear={mockOnClear} />)

    await user.click(screen.getByText('Back'))
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('calls onClear when Clear History is clicked', async () => {
    const user = userEvent.setup()
    render(<HistoryPage sessions={sessions} onBack={mockOnBack} onClear={mockOnClear} />)

    await user.click(screen.getByText('Clear History'))
    expect(mockOnClear).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/pages/HistoryPage.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement HistoryPage**

Create `src/pages/HistoryPage.tsx`:

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/pages/HistoryPage.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add HistoryPage with session list and expandable details"
```

---

## Task 11: Wire Up App Router

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Implement App with page routing via state**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react'
import { Player, Turn, GameSession } from './types/game'
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
```

- [ ] **Step 2: Update main.tsx**

Replace `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 3: Verify the app builds**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire up App router connecting all pages"
```

---

## Task 12: Final Verification & Cleanup

**Files:**
- Modify: `package.json` (add test script if missing)

- [ ] **Step 1: Ensure package.json has test script**

Verify `package.json` has:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: Clean build, no warnings.

- [ ] **Step 4: Manual smoke test**

```bash
npm run dev
```

Verify:
1. Setup page loads with player input and color picker
2. Adding 2 players and starting game works
3. Tapping player zones switches active player
4. Timer counts up
5. Pause/Resume works
6. End Game shows summary with stats
7. Save to History persists
8. History page shows the saved game

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

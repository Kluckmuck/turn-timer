# Turn Timer — Design Spec

A web app for tracking turn times during in-person board game nights. One shared device on the table; players tap their zone to claim their turn.

## Goals

- Track how long each player takes per turn (no enforced time limits)
- Provide end-of-game stats and saved history
- Fast, simple, mobile-friendly UI for a shared device

## Non-Goals (for now)

- Remote/online multiplayer (future feature)
- Enforced time limits or chess-clock mode
- User accounts or authentication
- Offline support (PWA)

## Tech Stack

| Layer         | Choice                          |
| ------------- | ------------------------------- |
| Framework     | React (Vite)                    |
| Language      | TypeScript                      |
| Styling       | Tailwind CSS                    |
| State         | React Context + useReducer      |
| Persistence   | localStorage                    |
| Testing       | Vitest + React Testing Library  |
| Deployment    | Vercel (static site)            |

## Project Structure

```
src/
  components/    # UI components (PlayerZone, Timer, SetupForm, etc.)
  context/       # Game state context + reducer
  hooks/         # Custom hooks (useTimer, useGameHistory)
  pages/         # Setup, Game, Summary, History
  types/         # TypeScript interfaces
  utils/         # Time formatting, color helpers
```

## Screens

### 1. Setup

- Enter 2-6 player names
- Assign a color to each player from a preset palette
- Start game button

### 2. Game (Core Experience)

- **Top bar:** Total game time (always visible)
- **Center:** Active player's name, color, and current turn elapsed time (large, prominent)
- **Bottom:** All player zones as tappable buttons — tapping a zone claims the turn
- **Settings toggle:** Show/hide accumulated total time per player on the zones
- **Controls:** Pause button, End Game button

**Turn mechanics:**
- Tapping a player zone stops the current player's timer and starts the tapped player's timer
- Any player can be tapped at any time (no enforced order)
- Pause freezes all timers; resume continues the active player's timer

### 3. Summary

Shown when host taps "End Game":

- Total game time
- Per-player stats: total time, average turn time, number of turns, longest turn
- Players ranked by total time spent (slowest first)
- Option to save to history or discard

### 4. History

- List of past game sessions (date, players, total game time)
- Tap a session to see the full summary stats
- Option to clear history

**Navigation:** Setup → Game → Summary → Setup/History. History accessible from Setup screen.

## Data Model

```typescript
interface Player {
  id: string
  name: string
  color: string // hex value from preset palette
}

interface Turn {
  playerId: string
  startTime: number   // timestamp (ms)
  duration: number    // milliseconds
}

interface GameSession {
  id: string
  startedAt: number   // timestamp (ms)
  endedAt: number | null
  players: Player[]
  turns: Turn[]
}
```

### Derived Stats (computed from turns array)

- Total time per player: sum of all their turn durations
- Average turn time per player
- Longest/shortest turn per player
- Number of turns per player
- Total game time: `endedAt - startedAt`

## Color Palette

A preset palette of 6 distinct, accessible colors. Players pick from available (unassigned) colors during setup.

## Persistence

- Game history stored in localStorage under a single key (`turn-timer-history`)
- Stored as a JSON array of `GameSession` objects
- No size management needed initially (timer data is small)

## Future Considerations

- Remote play: would require adding a backend (WebSocket or real-time DB) and player authentication
- Additional timer modes (chess clock, per-turn limits) as configurable options
- Game profiles / saved player presets

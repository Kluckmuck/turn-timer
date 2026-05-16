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

import { useState } from 'react'
import type { Player } from '../types/game'
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
          <div key={row.id} className="bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder={`Player ${index + 1}`}
                value={row.name}
                onChange={e => updateName(row.id, e.target.value)}
                className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
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
            <ColorPicker
              selected={row.color}
              usedColors={usedColors}
              onChange={color => updateColor(row.id, color)}
            />
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

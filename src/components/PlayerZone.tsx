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

import { COLOR_PALETTE } from '../utils/colors'

interface ColorPickerProps {
  selected: string
  usedColors: string[]
  onChange: (color: string) => void
}

export function ColorPicker({ selected, usedColors, onChange }: ColorPickerProps) {
  const isCustomColor = !COLOR_PALETTE.some(c => c.hex === selected)

  return (
    <div className="flex gap-2 items-center">
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
      <label
        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-105 ${
          isCustomColor ? 'border-white scale-110' : 'border-transparent'
        } overflow-hidden relative`}
        style={{
          background: isCustomColor
            ? selected
            : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
        }}
        aria-label="Pick custom color"
      >
        <input
          type="color"
          value={selected}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  )
}

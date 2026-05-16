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

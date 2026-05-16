import { formatTime } from '../utils/time'

interface TimerProps {
  elapsed: number
  className?: string
}

export function Timer({ elapsed, className = '' }: TimerProps) {
  return <span className={className}>{formatTime(elapsed)}</span>
}

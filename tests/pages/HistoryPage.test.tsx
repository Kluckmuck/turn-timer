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
    // After expanding, individual player stats should be visible
    // Alice has 10000ms total, Bob has 8000ms total
    expect(screen.getAllByText(/1 turns/)).toHaveLength(2)
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

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

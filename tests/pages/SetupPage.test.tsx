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

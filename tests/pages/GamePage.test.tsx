import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GamePage } from '../../src/pages/GamePage'
import { GameProvider } from '../../src/context/GameContext'

const players = [
  { id: 'p1', name: 'Alice', color: '#EF4444' },
  { id: 'p2', name: 'Bob', color: '#3B82F6' },
]

function renderGamePage() {
  return render(
    <GameProvider>
      <GamePage players={players} onEnd={vi.fn()} />
    </GameProvider>
  )
}

describe('GamePage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders all player zones', () => {
    renderGamePage()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows game time', () => {
    renderGamePage()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('highlights active player when zone is tapped', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    renderGamePage()

    await user.click(screen.getByText('Alice'))
    expect(screen.getByTestId('active-player-name')).toHaveTextContent('Alice')
  })

  it('shows pause button', () => {
    renderGamePage()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('shows end game button', () => {
    renderGamePage()
    expect(screen.getByText('End Game')).toBeInTheDocument()
  })
})

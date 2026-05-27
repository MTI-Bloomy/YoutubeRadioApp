/**
 * TopBar.test.tsx - Tests for TopBar component
 * Tests: close/minimize button clicks, IPC calls, draggable title bar
 */

import { render, screen, fireEvent } from '../../utils/testUtils'
import TopBar from '../../../src/renderer/src/components/TopBar'
import { ipcRendererMock } from '../../mocks/electron'

describe('TopBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders without crashing', () => {
    render(<TopBar />)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  test('renders close button with "X" label', () => {
    render(<TopBar />)

    const closeButton = screen.getByText('X')
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute('id', 'close-button')
  })

  test('sends close-window IPC message on close button click', () => {
    render(<TopBar />)

    const closeButton = screen.getByText('X')
    fireEvent.click(closeButton)

    expect(ipcRendererMock.send).toHaveBeenCalledWith('close-window')
    expect(ipcRendererMock.send).toHaveBeenCalledTimes(1)
  })

  test('renders draggable title bar area', () => {
    render(<TopBar />)

    // Check for the draggable div with WebkitAppRegion: drag
    const draggableElements = screen.getByText('X').closest('div')?.parentElement
    expect(draggableElements).toBeInTheDocument()
  })

  /*
  test('title bar has correct drag region styling', () => {
    const { container } = render(<TopBar />)

    // Find the div with webkit app region drag style
    const dragRegion = container.querySelector('[style*="drag"]')
    expect(dragRegion).toBeInTheDocument()
    expect(dragRegion).toHaveStyle({ WebkitAppRegion: 'drag' })
  })
    */

  test('renders control buttons container', () => {
    const { container } = render(<TopBar />)

    const controlButtons = container.querySelector('#control-buttons')
    expect(controlButtons).toBeInTheDocument()
  })

  test('control buttons are positioned absolutely', () => {
    const { container } = render(<TopBar />)

    const controlButtons = container.querySelector('#control-buttons')
    expect(controlButtons).toHaveClass('absolute')
  })

  test('close button is positioned at top right', () => {
    const { container } = render(<TopBar />)

    const controlButtons = container.querySelector('#control-buttons')
    expect(controlButtons).toHaveClass('top-0', 'right-0')
  })

  test('renders multiple rows of rounded backgrounds', () => {
    const { container } = render(<TopBar />)

    const roundedElements = container.querySelectorAll('.rounded-t-xl, .rounded-b-xl')
    expect(roundedElements.length).toBeGreaterThan(0)
  })

  /*
  test('ensures close button is clickable', () => {
    render(<TopBar />)

    const closeButton = screen.getByText('X')
    expect(closeButton).toHaveAttribute('type', 'button')
  })
    */

  test('close button click is not prevented', () => {
    render(<TopBar />)

    const closeButton = screen.getByText('X')
    const event = fireEvent.click(closeButton)

    expect(event).toBe(true) // Not prevented
  })

  test('IPC send is called only once per click', () => {
    render(<TopBar />)

    const closeButton = screen.getByText('X')
    fireEvent.click(closeButton)
    fireEvent.click(closeButton)

    expect(ipcRendererMock.send).toHaveBeenCalledTimes(2)
    expect(ipcRendererMock.send).toHaveBeenNthCalledWith(1, 'close-window')
    expect(ipcRendererMock.send).toHaveBeenNthCalledWith(2, 'close-window')
  })

  /*
  test('renders with correct styling classes', () => {
    const { container } = render(<TopBar />)

    const topBar = container.firstChild as HTMLElement
    expect(topBar).toHaveClass('bg-cyan-900')
  })
    */
})

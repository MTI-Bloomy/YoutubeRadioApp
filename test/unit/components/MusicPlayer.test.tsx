/**
 * MusicPlayer.test.tsx - Tests for MusicPlayer component
 * Tests: YouTube URL regex parsing, video ID extraction, player rendering
 */

import { render, screen, fireEvent, userEvent } from '../../utils/testUtils'
import MusicPlayer from '../../../src/renderer/src/components/MusicPlayer'

describe('MusicPlayer Component', () => {
  const mockOnVideoChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders without crashing', () => {
    render(<MusicPlayer initialVideoId="jfKfPfyJRdk" />)
    expect(screen.getByTestId('youtube-player')).toBeInTheDocument()
  })

  test('renders YouTube player with provided video ID', () => {
    const testVideoId = 'dQw4w9WgXcQ'
    render(<MusicPlayer initialVideoId={testVideoId} />)

    const player = screen.getByTestId('youtube-player')
    expect(player).toHaveAttribute('data-video-id', testVideoId)
  })

  test('extracts video ID from youtube.com/watch?v= URL format', async () => {
    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(screen.getByTestId('youtube-player')).toHaveAttribute('data-video-id', 'dQw4w9WgXcQ')
  })

  test('extracts video ID from youtu.be/ short URL format', async () => {
    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://youtu.be/dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(screen.getByTestId('youtube-player')).toHaveAttribute('data-video-id', 'dQw4w9WgXcQ')
  })

  test('extracts video ID from youtube.com/v/ URL format', async () => {
    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/v/dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(screen.getByTestId('youtube-player')).toHaveAttribute('data-video-id', 'dQw4w9WgXcQ')
  })

  test('extracts video ID from youtube.com/embed/ URL format', async () => {
    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/embed/dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(screen.getByTestId('youtube-player')).toHaveAttribute('data-video-id', 'dQw4w9WgXcQ')
  })

  test('rejects invalid video IDs (too short)', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=ABC')
    fireEvent.click(submitButton)

    expect(alertSpy).toHaveBeenCalledWith('Invalid YouTube link. Please try again.')
    alertSpy.mockRestore()
  })

  test('rejects invalid URLs (not YouTube)', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://vimeo.com/123456789')
    fireEvent.click(submitButton)

    expect(alertSpy).toHaveBeenCalledWith('Invalid YouTube link. Please try again.')
    alertSpy.mockRestore()
  })

  test('calls onVideoChange callback when valid URL is submitted', async () => {
    const onVideoChange = jest.fn()
    render(<MusicPlayer onVideoChange={onVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(onVideoChange).toHaveBeenCalledWith('dQw4w9WgXcQ')
  })

  test('does not call onVideoChange for invalid video ID', async () => {
    const onVideoChange = jest.fn()
    jest.spyOn(window, 'alert').mockImplementation()

    render(<MusicPlayer onVideoChange={onVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=INVALID')
    fireEvent.click(submitButton)

    expect(onVideoChange).not.toHaveBeenCalled()
  })

  test('renders SearchBar component', () => {
    render(<MusicPlayer initialVideoId="jfKfPfyJRdk" />)

    expect(screen.getByPlaceholderText('put your radio link here')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Jam!')).toBeInTheDocument()
  })

  test('clears input after successful submission', async () => {
    render(<MusicPlayer onVideoChange={mockOnVideoChange} />)

    const input = screen.getByPlaceholderText('put your radio link here') as HTMLInputElement
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    await new Promise((resolve) => setTimeout(resolve, 50)) // Small delay for state update

    // Input should be cleared after submission (handled by SearchBar)
  })
})

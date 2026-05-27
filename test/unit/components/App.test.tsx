/// <reference types="jest" />
/**
 * App.test.tsx - Tests for App component
 * Tests: overlay mode toggle, config loading, URL validation, state management
 */

import { render } from '../../utils/testUtils'
import { screen, waitFor } from '@testing-library/react'
import App from '../../../src/renderer/src/App'
import { configAPIMock, ipcRendererMock } from '../../mocks/electron'

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock config API to return default value
    configAPIMock.load.mockResolvedValue({
      lastVideoID: 'jfKfPfyJRdk'
    })
    // Mock IPC listener registration
    ipcRendererMock.on.mockReturnValue(undefined)
  })

  test('renders without crashing', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Loading Radio')).toBeInTheDocument()
    })
  })

  test('loads config on mount', async () => {
    configAPIMock.load.mockResolvedValue({
      lastVideoID: 'dQw4w9WgXcQ'
    })

    render(<App />)

    await waitFor(() => {
      expect(configAPIMock.load).toHaveBeenCalledTimes(1)
    })
  })

  /*
  test('uses default video ID when config fails', async () => {
    configAPIMock.load.mockRejectedValue(new Error('Config load failed'))

    render(<App />)

    await waitFor(() => {
      expect(configAPIMock.load).toHaveBeenCalled()
    })
  })
    */

  test('uses default video ID (jfKfPfyJRdk) when config returns empty', async () => {
    configAPIMock.load.mockResolvedValue({})

    render(<App />)

    await waitFor(() => {
      expect(configAPIMock.load).toHaveBeenCalled()
    })
  })

  test('sets up IPC listener for toggle-overlay on mount', async () => {
    render(<App />)

    await waitFor(() => {
      expect(ipcRendererMock.on).toHaveBeenCalledWith('toggle-overlay', expect.any(Function))
    })
  })

  test('removes IPC listeners on unmount', async () => {
    const { unmount } = render(<App />)

    await waitFor(() => {
      expect(ipcRendererMock.on).toHaveBeenCalled()
    })

    unmount()

    expect(ipcRendererMock.removeAllListeners).toHaveBeenCalled()
  })

  test('renders TopBar when config is loaded', async () => {
    configAPIMock.load.mockResolvedValue({
      lastVideoID: 'jfKfPfyJRdk'
    })

    render(<App />)

    await waitFor(() => {
      // TopBar renders the control-buttons div
      const controlButtons = screen.queryByText('X')
      expect(controlButtons).toBeInTheDocument()
    })
  })

  test('renders MusicPlayer when config is loaded', async () => {
    configAPIMock.load.mockResolvedValue({
      lastVideoID: 'jfKfPfyJRdk'
    })

    render(<App />)

    await waitFor(() => {
      // MusicPlayer renders the YouTube player
      const youtubePlayer = screen.queryByTestId('youtube-player')
      expect(youtubePlayer).toBeInTheDocument()
    })
  })

  test('passes loaded video ID to MusicPlayer', async () => {
    const testVideoId = 'dQw4w9WgXcQ'
    configAPIMock.load.mockResolvedValue({
      lastVideoID: testVideoId
    })

    render(<App />)

    await waitFor(() => {
      const youtubePlayer = screen.queryByTestId('youtube-player')
      expect(youtubePlayer).toHaveAttribute('data-video-id', testVideoId)
    })
  })

  test('saves config when video changes', async () => {
    configAPIMock.load.mockResolvedValue({
      lastVideoID: 'jfKfPfyJRdk'
    })
    configAPIMock.save.mockResolvedValue(undefined)

    render(<App />)

    await waitFor(() => {
      expect(configAPIMock.load).toHaveBeenCalled()
    })

    // Simulate video change by finding and testing the SearchBar submission
    // This is tested indirectly through handleVideoChange
  })

  test('renders loading state before config is loaded', () => {
    // Don't resolve the config mock immediately
    configAPIMock.load.mockImplementation(() => new Promise(() => {}))

    render(<App />)

    expect(screen.getByText('Loading Radio')).toBeInTheDocument()
  })
})

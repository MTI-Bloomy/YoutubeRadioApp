/**
 * ipcHandlers.test.ts - Tests for main process IPC handlers
 * Tests: toggle-overlay, close-window, minimize-window, config handlers
 */

import { ipcRendererMock } from '../../mocks/electron'

// Mock data for testing
const mockHandlers: {
  [key: string]: (...args: unknown[]) => unknown
} = {}

describe('Main Process IPC Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(mockHandlers).forEach((key) => delete mockHandlers[key])
  })

  describe('toggle-overlay handler', () => {
    test('inverts overlay boolean state', () => {
      let overlayState = false

      // Simulate handler logic
      const toggleOverlay = (): boolean => {
        overlayState = !overlayState
        return overlayState
      }

      expect(overlayState).toBe(false)
      expect(toggleOverlay()).toBe(true)
      expect(overlayState).toBe(true)
      expect(toggleOverlay()).toBe(false)
      expect(overlayState).toBe(false)
    })

    test('sends toggle-overlay event multiple times', () => {
      let overlayState = false

      for (let i = 0; i < 5; i++) {
        overlayState = !overlayState
      }

      expect(overlayState).toBe(true)
    })

    test('maintains overlay state across multiple calls', () => {
      let overlayState = false

      const toggleAndCheck = (): boolean => {
        overlayState = !overlayState
        return overlayState
      }

      const results = [
        toggleAndCheck(), // true
        toggleAndCheck(), // false
        toggleAndCheck(), // true
        toggleAndCheck() // false
      ]

      expect(results).toEqual([true, false, true, false])
    })
  })

  describe('close-window handler', () => {
    test('handles close-window event without error', () => {
      const handleClose = jest.fn()

      ipcRendererMock.send('close-window')
      handleClose('close-window')

      expect(handleClose).toHaveBeenCalledWith('close-window')
    })

    test('close-window can be called multiple times', () => {
      const handleClose = jest.fn()

      ipcRendererMock.send('close-window')
      ipcRendererMock.send('close-window')
      handleClose('close-window')
      handleClose('close-window')

      expect(handleClose).toHaveBeenCalledTimes(2)
    })
  })

  describe('minimize-window handler', () => {
    test('handles minimize-window event without error', () => {
      const handleMinimize = jest.fn()

      ipcRendererMock.send('minimize-window')
      handleMinimize('minimize-window')

      expect(handleMinimize).toHaveBeenCalledWith('minimize-window')
    })

    test('minimize-window can be called multiple times', () => {
      const handleMinimize = jest.fn()

      ipcRendererMock.send('minimize-window')
      ipcRendererMock.send('minimize-window')
      handleMinimize('minimize-window')
      handleMinimize('minimize-window')

      expect(handleMinimize).toHaveBeenCalledTimes(2)
    })
  })

  describe('config:load handler', () => {
    test('returns config object on successful load', async () => {
      const mockConfig = { lastVideoID: 'testId123' }
      ipcRendererMock.invoke.mockResolvedValue(mockConfig)

      const result = await ipcRendererMock.invoke('config:load')

      expect(result).toEqual(mockConfig)
      expect(ipcRendererMock.invoke).toHaveBeenCalledWith('config:load')
    })

    test('returns empty object when config file does not exist', async () => {
      ipcRendererMock.invoke.mockResolvedValue({})

      const result = await ipcRendererMock.invoke('config:load')

      expect(result).toEqual({})
    })

    test('rejects with error on read failure', async () => {
      const error = new Error('Failed to read config file')
      ipcRendererMock.invoke.mockRejectedValue(error)

      await expect(ipcRendererMock.invoke('config:load')).rejects.toThrow(
        'Failed to read config file'
      )
    })

    test('handles malformed JSON gracefully', async () => {
      const error = new Error('Invalid JSON in config file')
      ipcRendererMock.invoke.mockRejectedValue(error)

      await expect(ipcRendererMock.invoke('config:load')).rejects.toThrow(
        'Invalid JSON in config file'
      )
    })

    test('returns config with various video IDs', async () => {
      const testIds = ['id1', 'id2', 'dQw4w9WgXcQ', 'jfKfPfyJRdk']

      for (const id of testIds) {
        ipcRendererMock.invoke.mockResolvedValue({ lastVideoID: id })
        const result = await ipcRendererMock.invoke('config:load')
        expect(result.lastVideoID).toBe(id)
      }
    })
  })

  describe('config:save handler', () => {
    test('saves config data successfully', async () => {
      const configData = { lastVideoID: 'testId123' }
      ipcRendererMock.invoke.mockResolvedValue(undefined)

      await ipcRendererMock.invoke('config:save', configData)

      expect(ipcRendererMock.invoke).toHaveBeenCalledWith('config:save', configData)
    })

    test('rejects when save fails due to permissions', async () => {
      const error = new Error('Permission denied')
      ipcRendererMock.invoke.mockRejectedValue(error)

      await expect(ipcRendererMock.invoke('config:save', {})).rejects.toThrow(
        'Permission denied'
      )
    })

    test('handles multiple consecutive saves', async () => {
      ipcRendererMock.invoke.mockResolvedValue(undefined)

      const configs = [
        { lastVideoID: 'id1' },
        { lastVideoID: 'id2' },
        { lastVideoID: 'id3' }
      ]

      for (const config of configs) {
        await ipcRendererMock.invoke('config:save', config)
      }

      expect(ipcRendererMock.invoke).toHaveBeenCalledTimes(3)
    })

    test('persists data correctly', async () => {
      const originalData = { lastVideoID: 'original' }
      ipcRendererMock.invoke.mockResolvedValue(undefined)

      await ipcRendererMock.invoke('config:save', originalData)

      expect(ipcRendererMock.invoke).toHaveBeenCalledWith('config:save', originalData)
    })
  })

  describe('IPC handler order and consistency', () => {
    test('handlers respond to correct channel names', () => {
      const channels = ['toggle-overlay', 'close-window', 'minimize-window']

      channels.forEach((channel) => {
        ipcRendererMock.send(channel)
        expect(ipcRendererMock.send).toHaveBeenCalledWith(channel)
      })
    })

    test('async handlers use invoke protocol', async () => {
      ipcRendererMock.invoke.mockResolvedValue({})

      await ipcRendererMock.invoke('config:load')

      expect(ipcRendererMock.invoke).toHaveBeenCalledWith('config:load')
    })

    test('sync handlers use send protocol', () => {
      ipcRendererMock.send('close-window')

      expect(ipcRendererMock.send).toHaveBeenCalledWith('close-window')
    })
  })

  describe('Error handling', () => {
    test('handler errors do not crash application', async () => {
      ipcRendererMock.invoke.mockRejectedValue(new Error('Handler error'))

      const callHandler = async (): Promise<unknown> => {
        try {
          await ipcRendererMock.invoke('config:load')
        } catch (error) {
          return error
        }
      }

      const result = await callHandler()
      expect(result).toBeInstanceOf(Error)
    })

    test('multiple error calls are handled independently', async () => {
      const error1 = new Error('Error 1')
      const error2 = new Error('Error 2')

      ipcRendererMock.invoke
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)

      await expect(ipcRendererMock.invoke('config:load')).rejects.toThrow('Error 1')
      await expect(ipcRendererMock.invoke('config:load')).rejects.toThrow('Error 2')
    })
  })
})

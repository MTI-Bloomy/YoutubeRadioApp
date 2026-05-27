/**
 * config.test.ts - Tests for config service
 * Tests: IPC calls, config save/load, error handling
 */

import { beforeEach, describe } from 'node:test'
import { configService, AppConfig } from '../../../src/renderer/src/services/config'
import { configAPIMock } from '../../mocks/electron'
import '@testing-library/jest-dom'

describe('Config Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loadConfig', () => {
    test('calls window.configAPI.load()', async () => {
      configAPIMock.load.mockResolvedValue({
        lastVideoID: 'jfKfPfyJRdk'
      })

      await configService.loadConfig()

      expect(configAPIMock.load).toHaveBeenCalledTimes(1)
    })

    test('returns config object on success', async () => {
      const expectedConfig: AppConfig = {
        lastVideoID: 'dQw4w9WgXcQ'
      }

      configAPIMock.load.mockResolvedValue(expectedConfig)

      const result = await configService.loadConfig()

      expect(result).toEqual(expectedConfig)
    })

    test('returns config with correct lastVideoID', async () => {
      const testVideoId = 'abc123xyz789_test'
      configAPIMock.load.mockResolvedValue({
        lastVideoID: testVideoId
      })

      const result = await configService.loadConfig()

      expect(result.lastVideoID).toBe(testVideoId)
    })

    test('handles empty config', async () => {
      configAPIMock.load.mockResolvedValue({})

      const result = await configService.loadConfig()

      expect(result).toBeDefined()
    })

    test('rejects when IPC call fails', async () => {
      const error = new Error('IPC communication failed')
      configAPIMock.load.mockRejectedValue(error)

      await expect(configService.loadConfig()).rejects.toThrow(
        'IPC communication failed'
      )
    })

    test('rejects with TypeError when API returns invalid data', async () => {
      configAPIMock.load.mockRejectedValue(new TypeError('Invalid data format'))

      await expect(configService.loadConfig()).rejects.toThrow('Invalid data format')
    })

    test('handles null response gracefully', async () => {
      configAPIMock.load.mockResolvedValue(null)

      const result = await configService.loadConfig()

      expect(result).toBeNull()
    })

    test('handles undefined response gracefully', async () => {
      configAPIMock.load.mockResolvedValue(undefined)

      const result = await configService.loadConfig()

      expect(result).toBeUndefined()
    })
  })

  describe('saveConfig', () => {
    test('calls window.configAPI.save() with data', async () => {
      const config: AppConfig = {
        lastVideoID: 'testVideoId123'
      }

      configAPIMock.save.mockResolvedValue(undefined)

      await configService.saveConfig(config)

      expect(configAPIMock.save).toHaveBeenCalledWith(config)
      expect(configAPIMock.save).toHaveBeenCalledTimes(1)
    })

    test('saves config with correct video ID', async () => {
      const config: AppConfig = {
        lastVideoID: 'dQw4w9WgXcQ'
      }

      configAPIMock.save.mockResolvedValue(undefined)

      await configService.saveConfig(config)

      expect(configAPIMock.save).toHaveBeenCalledWith(config)
    })

    test('passes entire config object to save', async () => {
      const config: AppConfig = {
        lastVideoID: 'abc123'
      }

      configAPIMock.save.mockResolvedValue(undefined)

      await configService.saveConfig(config)

      expect(configAPIMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          lastVideoID: 'abc123'
        })
      )
    })

    test('resolves when save succeeds', async () => {
      const config: AppConfig = {
        lastVideoID: 'jfKfPfyJRdk'
      }

      configAPIMock.save.mockResolvedValue(undefined)

      await expect(configService.saveConfig(config)).resolves.toBeUndefined()
    })

    test('rejects when IPC call fails', async () => {
      const config: AppConfig = {
        lastVideoID: 'testId'
      }
      const error = new Error('Save failed')

      configAPIMock.save.mockRejectedValue(error)

      await expect(configService.saveConfig(config)).rejects.toThrow('Save failed')
    })

    test('rejects with permission error when write fails', async () => {
      const config: AppConfig = {
        lastVideoID: 'testId'
      }
      const error = new Error('Permission denied')

      configAPIMock.save.mockRejectedValue(error)

      await expect(configService.saveConfig(config)).rejects.toThrow('Permission denied')
    })

    test('handles multiple saves in sequence', async () => {
      configAPIMock.save.mockResolvedValue(undefined)

      const config1: AppConfig = { lastVideoID: 'id1' }
      const config2: AppConfig = { lastVideoID: 'id2' }

      await configService.saveConfig(config1)
      await configService.saveConfig(config2)

      expect(configAPIMock.save).toHaveBeenCalledTimes(2)
      expect(configAPIMock.save).toHaveBeenNthCalledWith(1, config1)
      expect(configAPIMock.save).toHaveBeenNthCalledWith(2, config2)
    })
  })

  describe('Config Service Integration', () => {
    test('load and save cycle', async () => {
      const originalConfig: AppConfig = {
        lastVideoID: 'originalId'
      }

      configAPIMock.load.mockResolvedValue(originalConfig)
      configAPIMock.save.mockResolvedValue(undefined)

      const loadedConfig = await configService.loadConfig()
      expect(loadedConfig).toEqual(originalConfig)

      const newConfig: AppConfig = {
        lastVideoID: 'newId'
      }

      await configService.saveConfig(newConfig)
      expect(configAPIMock.save).toHaveBeenCalledWith(newConfig)
    })

    test('saves modified config after loading', async () => {
      const initialConfig: AppConfig = {
        lastVideoID: 'initial'
      }

      configAPIMock.load.mockResolvedValue(initialConfig)
      configAPIMock.save.mockResolvedValue(undefined)

      const loaded = await configService.loadConfig()
      const modified: AppConfig = {
        ...loaded,
        lastVideoID: 'modified'
      }

      await configService.saveConfig(modified)

      expect(configAPIMock.save).toHaveBeenCalledWith(
        expect.objectContaining({ lastVideoID: 'modified' })
      )
    })
  })
})

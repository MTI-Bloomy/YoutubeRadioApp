/// <reference types="jest" />
/**
 * Jest setup file
 * Configures global test environment, mocks, and matchers
 */

import '@testing-library/jest-dom'
import electronMock, { ipcRendererMock, configAPIMock } from './mocks/electron'

// Set environment to test
process.env.NODE_ENV = 'test'

// Mock window.electron
Object.defineProperty(window, 'electron', {
  value: electronMock,
  writable: true
})

// Mock window.configAPI
Object.defineProperty(window, 'configAPI', {
  value: configAPIMock,
  writable: true
})

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
  ipcRendererMock.send.mockClear()
  ipcRendererMock.invoke.mockClear()
  ipcRendererMock.on.mockClear()
  ipcRendererMock.removeAllListeners.mockClear()
  configAPIMock.load.mockClear()
  configAPIMock.save.mockClear()
})

// Suppress console errors during tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

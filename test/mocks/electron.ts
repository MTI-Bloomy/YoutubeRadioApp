/**
 * Mock for Electron APIs (ipcRenderer)
 * Used in renderer process tests
 */

export const ipcRendererMock = {
  send: jest.fn(),
  invoke: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn()
}

export const configAPIMock = {
  load: jest.fn(),
  save: jest.fn()
}

export default {
  ipcRenderer: ipcRendererMock,
  configAPI: configAPIMock
}

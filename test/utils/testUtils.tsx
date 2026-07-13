/**
 * Test utilities and custom render function
 * Provides helpers for rendering components with mocked contexts
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import * as testingLibrary from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Custom render function that provides mocked providers
 * Usage: renderWithProviders(<Component />)
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): ReturnType<typeof render> => {
  const Wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    return <>{children}</>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

export { customRender as render, userEvent }
// Explicitly re-export commonly used testing utilities
export const screen = testingLibrary.screen
export const waitFor = testingLibrary.waitFor
export const within = testingLibrary.within
export const fireEvent = testingLibrary.fireEvent

/**
 * RadioSearchBar.test.tsx - Tests for RadioSearchBar component
 * Tests: form submission, input handling, callback propagation, empty field handling
 */

import React from 'react'
import { render, screen, fireEvent, userEvent } from '../../utils/testUtils'
import RadioSearchBar from '../../../src/renderer/src/components/RadioSearchBar'

describe('RadioSearchBar Component', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders without crashing', () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)
    expect(screen.getByPlaceholderText('put your radio link here')).toBeInTheDocument()
  })

  test('renders input field with placeholder', () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  test('renders submit button with label "Jam!"', () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const submitButton = screen.getByDisplayValue('Jam!')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  test('accepts user input in text field', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here') as HTMLInputElement
    await userEvent.type(input, 'https://www.youtube.com/watch?v=test')

    expect(input.value).toBe('https://www.youtube.com/watch?v=test')
  })

  test('calls onSearch callback when form is submitted via button click', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(mockOnSearch).toHaveBeenCalledWith('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  test('calls onSearch callback when Enter key is pressed', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ{Enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  })

  test('clears input field after successful submission via button', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here') as HTMLInputElement
    const submitButton = screen.getByDisplayValue('Jam!')

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    fireEvent.click(submitButton)

    expect(input.value).toBe('')
  })

  test('clears input field after successful submission via Enter key', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here') as HTMLInputElement

    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ{Enter}')

    expect(input.value).toBe('')
  })

  test('allows submitting multiple URLs in sequence', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    // First submission
    await userEvent.type(input, 'https://www.youtube.com/watch?v=first')
    fireEvent.click(submitButton)

    expect(mockOnSearch).toHaveBeenCalledWith('https://www.youtube.com/watch?v=first')

    // Second submission
    await userEvent.type(input, 'https://www.youtube.com/watch?v=second')
    fireEvent.click(submitButton)

    expect(mockOnSearch).toHaveBeenCalledWith('https://www.youtube.com/watch?v=second')
    expect(mockOnSearch).toHaveBeenCalledTimes(2)
  })

  test('preserves whitespace in input', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    const urlWithWhitespace = '  https://www.youtube.com/watch?v=test  '
    await userEvent.type(input, urlWithWhitespace)
    fireEvent.click(submitButton)

    expect(mockOnSearch).toHaveBeenCalledWith(urlWithWhitespace)
  })

  test('updates input value as user types', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here') as HTMLInputElement

    expect(input.value).toBe('')

    await userEvent.type(input, 'h')
    expect(input.value).toBe('h')

    await userEvent.type(input, 'ttps')
    expect(input.value).toBe('https')
  })

  test('handles special characters in input', async () => {
    render(<RadioSearchBar onSearch={mockOnSearch} />)

    const input = screen.getByPlaceholderText('put your radio link here')
    const submitButton = screen.getByDisplayValue('Jam!')

    const specialUrl = 'https://www.youtube.com/watch?v=abc&t=10s&list=PLxxx'
    await userEvent.type(input, specialUrl)
    fireEvent.click(submitButton)

    expect(mockOnSearch).toHaveBeenCalledWith(specialUrl)
  })
})

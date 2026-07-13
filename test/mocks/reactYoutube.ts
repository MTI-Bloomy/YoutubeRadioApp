/**
 * Mock for react-youtube component
 * Simplified to avoid download and initialization issues in tests
 */

import React from 'react'

interface YouTubeProps {
  videoId?: string
  opts?: unknown
  className?: string
  onReady?: (event: unknown) => void
  onError?: (event: unknown) => void
  onStateChange?: (event: unknown) => void
}

const YouTube: React.FC<YouTubeProps> = ({ videoId, className }) => {
  return React.createElement('div', {
    className: className || 'youtube-player',
    'data-testid': 'youtube-player',
    'data-video-id': videoId
  })
}

export default YouTube

/**
 * Mock for react-youtube component
 * Simplified to avoid download and initialization issues in tests
 */

import React from 'react'

interface YouTubeProps {
  videoId?: string
  opts?: any
  className?: string
  onReady?: (event: any) => void
  onError?: (event: any) => void
  onStateChange?: (event: any) => void
}

const YouTube: React.FC<YouTubeProps> = ({ videoId, className }) => {
  return React.createElement('div', {
    className: className || 'youtube-player',
    'data-testid': 'youtube-player',
    'data-video-id': videoId
  })
}

export default YouTube

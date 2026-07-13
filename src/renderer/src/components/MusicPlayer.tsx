import React, { useState } from 'react'
import YouTube from 'react-youtube'
import SearchBar from './RadioSearchBar'

type MusicPlayerProps = {
  initialVideoId?: string
  onVideoChange?: (videoId: string) => void
}

const MusicPlayer: React.FC<MusicPlayerProps> = (props) => {
  const [radioId] = useState(props.initialVideoId)

  console.log('MusicPlayer initialized with props:', JSON.stringify(props))

  const opts = {
    playerVars: {
      autoplay: 1, // Auto-play the video on load
      controls: 0, // Hide controls
      loop: 1, // Loop the video
      rel: 0, // only recommend videos from the same channel
      showinfo: 0, // Hide video title and uploader
      iv_load_policy: 3 // Disable annotations
    }
  }

  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-center, align-center">
      <SearchBar onSearch={updatePlayer} />
      <div className=" p-3 flex justify-center items-center bg-cyan-800 rounded-xl">
        <YouTube videoId={radioId} opts={opts} className="youtubeContainer" />
      </div>
    </div>
  )
}

export default MusicPlayer

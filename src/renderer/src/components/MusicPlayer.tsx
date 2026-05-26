import React, { useState } from 'react'
import YouTube from 'react-youtube'
import SearchBar from './RadioSearchBar'

type MusicPlayerProps = {
  initialVideoId?: string
  onVideoChange?: (videoId: string) => void
}

const MusicPlayer: React.FC<MusicPlayerProps> = (props) => {
  const [radioId, setRadioId] = useState(props.initialVideoId)

  console.log('MusicPlayer initialized with props:', JSON.stringify(props))

  function youtube_parser(url: string): string | false {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(live\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[8].length == 11 ? match[8] : false
  }

  const updatePlayer = (link: string): void => {
    const id = youtube_parser(link)
    if (!id) {
      console.error('Invalid YouTube link')
      alert('Invalid YouTube link. Please try again.')
    } else {
      setRadioId(id)
      props.onVideoChange?.(id)
    }
  }

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

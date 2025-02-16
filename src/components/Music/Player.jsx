'use client'

import { useState, useEffect, useRef } from 'react'

export default function Player({ song }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    setIsPlaying(false)
  }, [song])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary-content shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img className="h-16 w-16 rounded" src={song.coverUrl} alt={song.title} />
          <div>
            <h3 className="text-lg font-medium">{song.title}</h3>
            <p className="text-gray-500">{song.artist}</p>
          </div>
        </div>
        <div>
          <button
            onClick={togglePlay}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <audio ref={audioRef} src={song.audioUrl} />
        </div>
      </div>
    </div>
  )
}


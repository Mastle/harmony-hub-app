"use client"

import { useState, useEffect } from "react"

export default function SongList({ setCurrentSong }) {
  const [songs, setSongs] = useState([])

  // useEffect(() => {
  //   fetch('http://localhost:3001/songs')
  //     .then(response => response.json())
  //     .then(data => setSongs(data))
  // }, [])

  return (
    <div className="bg-primary-content shadow-md rounded-lg overflow-hidden">
      <h2 className="text-primary text-xl font-bold p-4">Songs</h2>
      <ul className="divide-y divide-gray-200">
        {songs.map((song) => (
          <li
            key={song.id}
            className="p-4 hover:bg-secondary cursor-pointer"
            onClick={() => setCurrentSong(song)}
          >
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  className="h-10 w-10 rounded-sm"
                  src={song.coverUrl}
                  alt={song.title}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {song.title}
                </p>
                <p className="text-sm text-gray-500 truncate">{song.artist}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

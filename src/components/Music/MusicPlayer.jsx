;`use client`
import { useState } from "react"
import SongList from "./SongList"
import Player from "./Player"

const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null)

  return (
    <div className="container mx-auto mt-36">
      <SongList setCurrentSong={setCurrentSong} />
      {currentSong && <Player song={currentSong} />}
    </div>
  )
}

export default MusicPlayer

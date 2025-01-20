`use client`
import { useState } from 'react'
import SongList from './SongList'
import Player from './Player'


const MusicPlayer = () => {
     const [currentSong, setCurrentSong] = useState(null)



  return (
    <>
      <SongList setCurrentSong={setCurrentSong}/>
      {currentSong && <Player song={currentSong} />}
    </>

  )
}

export default MusicPlayer
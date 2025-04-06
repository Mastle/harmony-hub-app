import { useState, useEffect, useRef } from "react"
import * as Tone from "tone"
import "../../styles/pianoStyles.css"

const Key = ({ note, keyChar, isBlack, onPlay, onStop }) => (
  <div
    className={`key ${isBlack ? "black" : "white"}`}
    data-key={keyChar}
    data-note={note}
    onMouseDown={() => onPlay(note)}
    onMouseUp={() => onStop(note)}
    onMouseLeave={() => onStop(note)}
  >
    {note}
  </div>
)

const Piano = ({ keys, onPlay, onStop }) => (
  <div className="piano">
    {keys.map((keyData) => (
      <Key key={keyData.note} {...keyData} onPlay={onPlay} onStop={onStop} />
    ))}
  </div>
)

export default function PianoMain() {
  const [audioReady, setAudioReady] = useState(false)
  const sampler = useRef(null)
  const heldKeys = useRef(new Set())

  // Piano key data matching your original HTML structure
  const keysData = [
    // First octave
    { keyChar: "z", note: "C3", isBlack: false },
    { keyChar: "s", note: "Db3", isBlack: true },
    { keyChar: "x", note: "D3", isBlack: false },
    { keyChar: "d", note: "Eb3", isBlack: true },
    { keyChar: "c", note: "E3", isBlack: false },
    { keyChar: "v", note: "F3", isBlack: false },
    { keyChar: "g", note: "Gb3", isBlack: true },
    { keyChar: "b", note: "G3", isBlack: false },
    { keyChar: "h", note: "Ab3", isBlack: true },
    { keyChar: "n", note: "A3", isBlack: false },
    { keyChar: "j", note: "Bb3", isBlack: true },
    { keyChar: "m", note: "B3", isBlack: false },

    // Second octave
    { keyChar: "q", note: "C4", isBlack: false },
    { keyChar: "2", note: "Db4", isBlack: true },
    { keyChar: "w", note: "D4", isBlack: false },
    { keyChar: "3", note: "Eb4", isBlack: true },
    { keyChar: "e", note: "E4", isBlack: false },
    { keyChar: "r", note: "F4", isBlack: false },
    { keyChar: "5", note: "Gb4", isBlack: true },
    { keyChar: "t", note: "G4", isBlack: false },
    { keyChar: "6", note: "Ab4", isBlack: true },
    { keyChar: "y", note: "A4", isBlack: false },
    { keyChar: "7", note: "Bb4", isBlack: true },
    { keyChar: "u", note: "B4", isBlack: false },

    // Third octave
    { keyChar: "i", note: "C5", isBlack: false },
    { keyChar: "9", note: "Db5", isBlack: true },
    { keyChar: "o", note: "D5", isBlack: false },
    { keyChar: "0", note: "Eb5", isBlack: true },
    { keyChar: "p", note: "E5", isBlack: false },
    { keyChar: "[", note: "F5", isBlack: false },
    { keyChar: "=", note: "Gb5", isBlack: true },
    { keyChar: "]", note: "G5", isBlack: false },
    { keyChar: "\\", note: "Ab5", isBlack: true },
    { keyChar: ";", note: "A5", isBlack: false },
    { keyChar: "'", note: "Bb5", isBlack: true },
    { keyChar: "enter", note: "B5", isBlack: false },
  ]

  const keyToNoteMap = keysData.reduce((map, { keyChar, note }) => {
    map[keyChar] = note
    return map
  }, {})

  useEffect(() => {
    // Initialize Tone.js sampler
    sampler.current = new Tone.Sampler({
      urls: keysData.reduce((acc, { note }) => {
        acc[note] = `${note}.mp3`
        return acc
      }, {}),
      release: 1.5,
      attack: 0.05,
      baseUrl: "/audio-samples/",
    }).toDestination()

    return () => sampler.current.dispose()
  }, [])

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase()
    if (keyToNoteMap[key] && !heldKeys.current.has(key)) {
      sampler.current.triggerAttack(keyToNoteMap[key])
      heldKeys.current.add(key)
    }
  }

  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase()
    if (keyToNoteMap[key]) {
      sampler.current.triggerRelease(keyToNoteMap[key])
      heldKeys.current.delete(key)
    }
  }

  const initializeAudio = async () => {
    await Tone.start()
    setAudioReady(true)
  }

  useEffect(() => {
    if (!audioReady) return

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [audioReady])

  return (
    <div>
      {!audioReady && (
        <button onClick={initializeAudio}>Click to start piano</button>
      )}

      {audioReady && (
        <Piano
          keys={keysData}
          onPlay={(note) => note}
          onStop={(note) => sampler.current.triggerRelease(note)}
        />
      )}
    </div>
  )
}

/* 
     current step(short overview): 
       -> - Adding the Piano
          -- The react code has been added, but it needs to be polished and optimized. Start with reading and understanding the code as best as you can 
          -- In order to understand this right, I must thoroughlly study the vanilla piano first
          -- finished studying the vanilla piano
          -- studying the react version as best as I can, need to fully understand how the reduce method exactly works, and then I'll have to take a look 
          at the PianoMain component since everything seems to go down in there!<-
          -- need to add some styles next
        not sure when the next instruments will be added, there's a bunch of cool new features that might be more valuable than another instrument for this app
       - move on to music player and real time note highlighting
       - Joyful Speaking is next
 */

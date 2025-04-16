"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as Tone from "tone"
import "../../styles/pianoStyles.css"

const twinkleNotes = [
  "C4",
  "C4",
  "G4",
  "G4",
  "A4",
  "A4",
  "G4",
  "F4",
  "F4",
  "E4",
  "E4",
  "D4",
  "D4",
  "C4",
  "G4",
  "G4",
  "F4",
  "F4",
  "E4",
  "E4",
  "D4",
  "G4",
  "G4",
  "F4",
  "F4",
  "E4",
  "E4",
  "D4",
  "C4",
  "C4",
  "G4",
  "G4",
  "A4",
  "A4",
  "G4",
  "F4",
  "F4",
  "E4",
  "E4",
  "D4",
  "D4",
  "C4",
]

const keysData = [
  // Lower Octave (C3-B3) - ZXCVBNM row + home row blacks
  { keyChar: "tab", note: "C3", isBlack: false },
  { keyChar: "1", note: "Db3", isBlack: true },
  { keyChar: "q", note: "D3", isBlack: false },
  { keyChar: "2", note: "Eb3", isBlack: true },
  { keyChar: "w", note: "E3", isBlack: false },
  { keyChar: "e", note: "F3", isBlack: false },
  { keyChar: "4", note: "Gb3", isBlack: true },
  { keyChar: "r", note: "G3", isBlack: false },
  { keyChar: "5", note: "Ab3", isBlack: true },
  { keyChar: "t", note: "A3", isBlack: false },
  { keyChar: "6", note: "Bb3", isBlack: true },
  { keyChar: "y", note: "B3", isBlack: false },

  // Middle Octave (C4-B4) - QWERTYU row + number row blacks
  { keyChar: "u", note: "C4", isBlack: false },
  { keyChar: "8", note: "Db4", isBlack: true },
  { keyChar: "i", note: "D4", isBlack: false },
  { keyChar: "9", note: "Eb4", isBlack: true },
  { keyChar: "o", note: "E4", isBlack: false },
  { keyChar: "p", note: "F4", isBlack: false },
  { keyChar: "a", note: "Gb4", isBlack: true },
  { keyChar: "z", note: "G4", isBlack: false },
  { keyChar: "s", note: "Ab4", isBlack: true },
  { keyChar: "x", note: "A4", isBlack: false },
  { keyChar: "d", note: "Bb4", isBlack: true },
  { keyChar: "c", note: "B4", isBlack: false },

  // Upper Octave (C5-B5) - IOP[]\ row + top number/symbol blacks
  { keyChar: "v", note: "C5", isBlack: false },
  { keyChar: "g", note: "Db5", isBlack: true },
  { keyChar: "b", note: "D5", isBlack: false },
  { keyChar: "h", note: "Eb5", isBlack: true },
  { keyChar: "n", note: "E5", isBlack: false },
  { keyChar: "m", note: "F5", isBlack: false },
  { keyChar: "k", note: "Gb5", isBlack: true },
  { keyChar: ",", note: "G5", isBlack: false },
  { keyChar: "l", note: "Ab5", isBlack: true },
  { keyChar: ".", note: "A5", isBlack: false },
  { keyChar: ";", note: "Bb5", isBlack: true },
  { keyChar: "/", note: "B5", isBlack: false },
]

const keyToNoteMap = keysData.reduce((map, { keyChar, note }) => {
  map[keyChar] = note
  return map
}, {})

const Key = ({
  note,
  keyChar,
  isBlack,
  onPlay,
  onStop,
  isActive,
  isTarget,
  showLabels,
}) => (
  <button
    type="button"
    className={`key ${isBlack ? "black" : "white"} ${
      isActive ? "active" : ""
    } ${isTarget ? "target" : ""}`}
    aria-label={`Play note ${note}`}
    data-key={keyChar}
    data-note={note}
    onMouseDown={() => onPlay(note)}
    onMouseUp={() => onStop(note)}
    onMouseLeave={() => onStop(note)}
    onTouchStart={() => onPlay(note)}
    onTouchEnd={() => onStop(note)}
    onTouchCancel={() => onStop(note)}
  >
    {showLabels ? `${note} (${keyChar})` : ""}
  </button>
)

const Piano = ({ keys, onPlay, onStop, isActive, isTarget, showLabels }) => (
  <div className="piano">
    {keys.map((keyData) => (
      <Key
        key={keyData.note}
        {...keyData}
        onPlay={onPlay}
        onStop={onStop}
        isActive={isActive(keyData.note)}
        isTarget={isTarget(keyData.note)}
        showLabels={showLabels}
      />
    ))}
  </div>
)

export default function PianoMain() {
  const [audioReady, setAudioReady] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())
  const [showLabels, setShowLabels] = useState(false)
  const [isSongGameActive, setIsSongGameActive] = useState(false)
  const [currentSongStep, setCurrentSongStep] = useState(0)
  const [targetNote, setTargetNote] = useState(null)
  const isSongGameActiveRef = useRef(false)
  const songStepRef = useRef(0)
  const targetNoteRef = useRef(null)
  const sampler = useRef(null)
  const heldKeys = useRef(new Set())

  useEffect(() => {
    isSongGameActiveRef.current = isSongGameActive
  }, [isSongGameActive])

  useEffect(() => {
    songStepRef.current = currentSongStep
  }, [currentSongStep])

  useEffect(() => {
    targetNoteRef.current = targetNote
  }, [targetNote])

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

  const handlePlay = useCallback((note) => {
    setActiveNotes((prev) => new Set([...prev, note]))
    sampler.current?.triggerAttack(note)

    // Song game logic
    if (isSongGameActiveRef.current && note === targetNoteRef.current) {
      const nextStep = songStepRef.current + 1
      if (nextStep < twinkleNotes.length) {
        setCurrentSongStep(nextStep)
        setTargetNote(twinkleNotes[nextStep])
      } else {
        setIsSongGameActive(false)
        setCurrentSongStep(0)
        setTargetNote(null)
      }
    }
  }, [])

  const handleStop = useCallback((note) => {
    setActiveNotes((prev) => {
      const next = new Set(prev)
      next.delete(note)
      return next
    })
    sampler.current?.triggerRelease(note)
  }, [])

  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key.toLowerCase()
      if (keyToNoteMap[key] && !heldKeys.current.has(key)) {
        handlePlay(keyToNoteMap[key])
        heldKeys.current.add(key)
      }
    },
    [handlePlay]
  )

  const handleKeyUp = useCallback(
    (event) => {
      const key = event.key.toLowerCase()
      if (keyToNoteMap[key]) {
        handleStop(keyToNoteMap[key])
        heldKeys.current.delete(key)
      }
    },
    [handleStop]
  )

  const initializeAudio = async () => {
    await Tone.start()
    setAudioReady(true)
  }

  useEffect(() => {
    if (!audioReady) return

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault()
        // Do your own thing here if needed
      }
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [audioReady, handleKeyDown, handleKeyUp])

  const startSongGame = () => {
    setIsSongGameActive(true)
    setCurrentSongStep(0)
    setTargetNote(twinkleNotes[0])
  }

  return (
    <>
      <div className="piano-container">
        {!audioReady && (
          <button
            className="text-2xl cursor-pointer btn p-6"
            onClick={initializeAudio}
          >
            Click to start the piano
          </button>
        )}
        {audioReady && (
          <Piano
            keys={keysData}
            onPlay={handlePlay}
            onStop={handleStop}
            isActive={(note) => activeNotes.has(note)}
            isTarget={(note) => targetNote === note}
            showLabels={showLabels}
          />
        )}
      </div>
      <div>
        {audioReady && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => setShowLabels((prev) => !prev)}
              className="btn btn-info"
            >
              {showLabels ? "Hide Key Labels" : "Show Key Labels"}
            </button>
          </div>
        )}
      </div>
      <div>
        {audioReady && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={startSongGame}
              className="btn btn-success"
              disabled={isSongGameActive}
            >
              Start Song Game
            </button>
          </div>
        )}
      </div>
    </>
  )
}

/* 
TODO(Creating the first song game):

1. **“Twinkle, Twinkle, Little Star”

notes = [C  C  G  G  A  A  G  
F  F  E  E  D  D  C] 

Keyboard shortcuts = [u u z z x x z
p p o o i i u]

learned how this thing works overall, time to add a "song game" mechanism for allowing users to play their favorite melodies


*/

/* 
     current step(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- So the final updates for the piano are the simplest song games possible, and a way to save the user's score and perhaps share it with others.
         -- Time to add "song games" with a user score system (https://recursivearts.com/virtual-piano/)". gotta add this one
         -- Add Saving or sharing configurations or recordings features (I'll try to add this, If it turns out to be too challenging, gotta skip it for now)
         -- implement User profiles and settings   (The most minimal version possible)
         -- The app must be ready for a small test by a handful users at this point(also a great excuse to test deployment with react and firebase). See how it goes =)
         -- Trying to fix the responsiveness issues for the paino gets too complicated on the dev server, it's better to revisit this issue after it's been deployed and is actually accessible on smaller devices
         -- If harmony hub succeeds in attracting users (or it becomes a safe bet for basing my software career), I'll look into the best way to gamify playing this piano. I'll come up with the best ways to incentivize users to play the piano, and have a blast as they're learning how music works
        - move on to the music player and real time note highlighting (once this feature has been added, Development on this project should stop. I have to shift
       my focus on to  Next.js, Typescript, An online shop that is the most sophisticated it can be in terms of looks and features. However its scale does have to
       be compatible with the fact that it's a portfolio project at the end of the day. Once ATP is ready with all the portfolio projects, I'll 
       come up with the best plan to divide my attention acroses these projects in such a way that  I can make some real dough, I keep evolving as a dev, and I'm doing
       what I love (a balance through the mixture of these three))
       - Joyful Speaking is next
 */

//  TODO: loading 36 mp3 files seems inefficient. I need to come up with a better solution that helps me maintain the highest quality possible
//  TODO: currently, the piano relies on user interaction to start. Is it worth it to look into ways to start it without asking the user to interact?
//  TODO: The best online piano at the moment (https://recursivearts.com/virtual-piano/) is utilizing unity to have the best simulation possible. How's that even possible?
//  TODO: The piano output doesn't sustain that well right now, utilinzg tone.reverb and tone.eq seems to add artifacts to the audio. What to do?

/*

{audioReady && (
  <div style={{ textAlign: "center", marginTop: "1rem" }}>
    <button
      onClick={startSongGame}
      className="btn btn-success"
      disabled={isSongGameActive}
    >
      Start Song Game
    </button>
  </div>
*/

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as Tone from "tone"
import "../../styles/pianoStyles.css"
import { keysData, keyToNoteMap } from "../data/pianoKeys"
import { songs } from "../data/pianoSongs"
import { useAuth } from "../Auth/AuthContext"

const API_BASE = "http://localhost:3001"

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
  const { user, isAuthModalOpen } = useAuth()
  const [audioReady, setAudioReady] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())
  const [showLabels, setShowLabels] = useState(false)
  const [isSongGameActive, setIsSongGameActive] = useState(false)
  const [currentSongStep, setCurrentSongStep] = useState(0)
  const [targetNote, setTargetNote] = useState(null)
  const [selectedSongId, setSelectedSongId] = useState("twinkle")
  const [showNotes, setShowNotes] = useState(false)
  const [userScore, setUserScore] = useState(0)

  const currentSongNotesRef = useRef(songs.twinkle.notes)
  const isSongGameActiveRef = useRef(false)
  const songStepRef = useRef(0)
  const targetNoteRef = useRef(null)
  const sampler = useRef(null)
  const heldKeys = useRef(new Set())

  useEffect(() => {
    const alreadyStarted = localStorage.getItem("audioReady")
    if (alreadyStarted) setAudioReady(true)
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setUserScore(0)
      return
    }
    fetch(`${API_BASE}/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserScore(data.score || 0)
      })
      .catch((err) => console.error("Failed to load user score:", err))
  }, [user])

  const updateScoreInDb = useCallback(
    (newScore) => {
      console.log(user)
      if (!user?.id) return
      fetch(`${API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore }),
      })
    },
    [user]
  )

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

  const handlePlay = useCallback(
    (note) => {
      setActiveNotes((prev) => new Set([...prev, note]))
      sampler.current?.triggerAttack(note)

      if (isSongGameActiveRef.current && note === targetNoteRef.current) {
        const nextStep = songStepRef.current + 1
        if (nextStep < currentSongNotesRef.current.length) {
          setCurrentSongStep(nextStep)
          setTargetNote(currentSongNotesRef.current[nextStep])
        } else {
          setTimeout(() => {
            setUserScore((prev) => {
              const newScore = prev + 100
              updateScoreInDb(newScore)
              return newScore
            })
            setIsSongGameActive(false)
            setCurrentSongStep(0)
            setTargetNote(null)
          }, 300)
        }
      }
    },
    [updateScoreInDb]
  )

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
    localStorage.setItem("audioReady", "true")
  }

  useEffect(() => {
    if (!audioReady) return
    if (isAuthModalOpen) return

    function removeTabDefaultFunction(e) {
      if (e.key === "Tab") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("keydown", removeTabDefaultFunction)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("keydown", removeTabDefaultFunction)
    }
  }, [audioReady, handleKeyDown, handleKeyUp, isAuthModalOpen])

  useEffect(() => {
    currentSongNotesRef.current = songs[selectedSongId]?.notes || []
  }, [selectedSongId])

  const startSongGame = () => {
    if (!songs[selectedSongId]) return

    setIsSongGameActive(true)
    setCurrentSongStep(0)
    setTargetNote(currentSongNotesRef.current[0])
  }

  const stopSongGame = () => {
    setIsSongGameActive(false)
    setCurrentSongStep(0)
    setTargetNote(null)
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
      <div className="text-center mb-8">
        <div>
          <p className="p-5 text-xl">User score: {userScore}</p>
        </div>
        {showNotes &&
          currentSongNotesRef.current.map((e, index) => (
            <span key={index} className="mx-2 text-xl">
              {e[0]}
            </span>
          ))}
        <button
          className="block mx-auto mt-5 btn btn-info"
          onClick={() => setShowNotes(!showNotes)}
        >
          {showNotes ? "Hide Notes" : "Show Notes"}
        </button>
      </div>
      <div className="piano-functions-buttons flex flex-row gap-10">
        <div className="basis-1/2">
          {audioReady && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <select
                value={selectedSongId}
                onChange={(e) => setSelectedSongId(e.target.value)}
                disabled={isSongGameActive}
                className="select select-bordered"
              >
                {Object.entries(songs).map(([id, song]) => (
                  <option key={id} value={id}>
                    {song.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div>
          {audioReady && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={isSongGameActive ? stopSongGame : startSongGame}
                className={
                  isSongGameActive ? "btn btn-warning" : "btn btn-success"
                }
              >
                {isSongGameActive ? "Stop Song Game" : "Start Song game"}
              </button>
            </div>
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
      </div>
    </>
  )
}

//  TODO: loading 36 mp3 files seems inefficient. I need to come up with a better solution that helps me maintain the highest quality possible
//  TODO: currently, the piano relies on user interaction to start. Is it worth it to look into ways to start it without asking the user to interact?
//  TODO: The best online piano at the moment (https://recursivearts.com/virtual-piano/) is utilizing unity to have the best simulation possible. How's that even possible?
//  TODO: The piano output doesn't sustain that well right now, utilinzg tone.reverb and tone.eq seems to add artifacts to the audio. What to do?
//  TODO: The song game just ends abruptly and the UI resets. That's not the cleanest way to end the game. Must reconsider this part for the next phase of the app

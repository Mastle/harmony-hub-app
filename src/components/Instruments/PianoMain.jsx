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
  const { user } = useAuth()
  const [audioReady, setAudioReady] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())
  const [showLabels, setShowLabels] = useState(false)
  const [isSongGameActive, setIsSongGameActive] = useState(false)
  const [currentSongStep, setCurrentSongStep] = useState(0)
  const [targetNote, setTargetNote] = useState(null)
  const [selectedSongId, setSelectedSongId] = useState("twinkle")
  const [showNotes, setShowNotes] = useState(false)
  const [userScore, setUserScore] = useState(0) //current step: this has to be set to whatever comes from the database

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
    if (!user?.id) return
    fetch(`${API_BASE}/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserScore(data.score || 0)
      })
      .catch((err) => console.error("Failed to load user score:", err))
  }, [user])

  // helper to patch new score
  const updateScoreInDb = useCallback(
    (newScore) => {
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

  const handlePlay = useCallback(
    (note) => {
      setActiveNotes((prev) => new Set([...prev, note]))
      sampler.current?.triggerAttack(note)

      // Song game logic
      if (isSongGameActiveRef.current && note === targetNoteRef.current) {
        const nextStep = songStepRef.current + 1
        if (nextStep < currentSongNotesRef.current.length) {
          setCurrentSongStep(nextStep)
          setTargetNote(currentSongNotesRef.current[nextStep])
        } else {
          // current step: this is the end of the game. This is where I can start adding to the user score
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

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault()
      }
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [audioReady, handleKeyDown, handleKeyUp])

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
          currentSongNotesRef.current.map((e) => (
            <span className="mx-2 text-xl">{e[0]}</span>
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

/* 
     current step(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- Adding user score -> updating the user score in the DB and the app state caused a lot of problems for AI, I'll do a deep dive tomorrow and see what is the best way to go about it 
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
//  TODO: The song game just ends abruptly and the UI resets. That's not the cleanest way to end the game. Must reconsider this part for the next phase of the app

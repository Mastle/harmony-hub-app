"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import * as Tone from "tone"
import "../../styles/pianoStyles.css"
import { keysData, keyToNoteMap } from "../data/pianoKeys"
import { useAuth } from "../Auth/AuthContext"
import { supabase } from "../../supabaseClient"

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
    data-testid="piano-key"
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
  const { user, setUser, isAuthModalOpen } = useAuth()
  const [audioReady, setAudioReady] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())
  const [showLabels, setShowLabels] = useState(false)
  const [songsFromDb, setSongsFromDb] = useState({})
  const [isSongGameActive, setIsSongGameActive] = useState(false)
  const [currentSongStep, setCurrentSongStep] = useState(0)
  const [targetNote, setTargetNote] = useState(null)
  const [selectedSongId, setSelectedSongId] = useState("twinkle")
  const [showNotes, setShowNotes] = useState(false)
  const [userScore, setUserScore] = useState(0)

  const currentSongNotesRef = useRef()
  const isSongGameActiveRef = useRef(false)
  const songStepRef = useRef(0)
  const targetNoteRef = useRef(null)
  const sampler = useRef(null)
  const heldKeys = useRef(new Set())

  const previousScoreRef = useRef(userScore)

  useEffect(() => {
    const alreadyStarted = localStorage.getItem("audioReady")
    if (alreadyStarted) setAudioReady(true)
  }, [])

  useEffect(() => {
    async function fetchSongs() {
      const { data, error } = await supabase.from("piano_tracks").select("*")
      if (error) {
        console.error("Error fetching songs:", error)
        return
      }
      console.log(data)
      const songsMap = data.reduce((acc, song) => {
        acc[song.slug] = {
          name: song.name,
          notes: song.notes, // assuming this is an array of note strings
        }
        return acc
      }, {})

      setSongsFromDb(songsMap)
    }

    fetchSongs()

    currentSongNotesRef.current = songsFromDb[0]
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setUserScore(0)
      return
    }
    setUserScore(user.score)
  }, [user])

  const updateScoreInDb = useCallback(
    async (newScore) => {
      console.log(user)
      if (!user?.id) return

      const { error } = await supabase
        .from("profiles")
        .update({ score: newScore })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating score in Supabase:", error)
      }
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
            setUserScore((prev) => prev + 100)
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
    currentSongNotesRef.current = songsFromDb[selectedSongId]?.notes || []
  }, [selectedSongId, songsFromDb])

  useEffect(() => {
    if (
      user?.id &&
      userScore !== previousScoreRef.current // avoid unnecessary updates
    ) {
      previousScoreRef.current = userScore
      updateScoreInDb(userScore)
      setUser((prev) => ({ ...prev, score: userScore }))
    }
  }, [userScore, user, updateScoreInDb])

  const startSongGame = () => {
    if (!songsFromDb[selectedSongId]) return

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
                {Object.entries(songsFromDb).map(([id, song]) => (
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
//  TODO: The song notes stay the same when they're not hidden even if the song is changed from the drop down menu

/*.
      current steps(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- implementing backend:
               --- There are minor issues such as start game not working as long the user hasn't interacted with the drop down menu, it almost seems finished overall!
                

         -- (make sure userprofile issue is solved beforehand) The next step is to add the tests to the CI workflow (continuous integration) routine 
         -- It's deployment time baby! make sure your tests won't get added to the bundle
         -- Trying to fix the responsiveness issues for the paino gets too complicated on the dev server, it's better to revisit this issue after it's been deployed and is actually accessible on smaller devices
         -- I also think now (early post alpha release) is a great time to consider RSC and React 19 (stuff like server side components, ssr and form actions)
         -- Must move on to JWTs if this app is ever to hit real production
         -- If harmony hub succeeds in attracting users (or it becomes a safe bet for basing my software career), I'll look into the best way to gamify playing this piano. I'll come up with the best ways to incentivize users to play the piano, and have a blast as they're learning how music works
         -- I have to add Docker to this thing once I've taken care of the previous steps. It's a necessity, it's great tech!
         - move on to the music player and real time note highlighting (once this feature has been added, Development on this project should stop. I have to shift
       my focus on to  Next.js, Typescript, An online shop that is the most sophisticated it can be in terms of looks and features. However its scale does have to
       be compatible with the fact that it's a portfolio project at the end of the day. Once ATP is ready with all the portfolio projects, I'll 
       come up with the best plan to divide my attention acroses these projects in such a way that  I can make some real dough, I keep evolving as a dev, and I'm doing
       what I love (a balance through the mixture of these three))
       - Joyful Speaking is next
 */

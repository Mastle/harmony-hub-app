import { useState, useEffect, useRef, useCallback } from "react"
import * as Tone from "tone"
import { keysData, keyToNoteMap } from "../../../data/pianoKeys"
import { supabase } from "../../../../supabaseClient"
import { useAuth } from "../../../Auth/AuthContext"

export default function usePianoLogic() {
  const { user, setUser, isAuthModalOpen } = useAuth()
  const [audioReady, setAudioReady] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())
  const [showLabels, setShowLabels] = useState(false)
  const [songs, setSongs] = useState({})
  const [isGameActive, setIsGameActive] = useState(false)
  const [step, setStep] = useState(0)
  const [target, setTarget] = useState(null)
  const [selectedId, setSelectedId] = useState("twinkle")
  const [showNotes, setShowNotes] = useState(false)
  const [score, setScore] = useState(0)
  const [isPianoFocused, setIsPianoFocused] = useState(false)

  const songRef = useRef([])
  const sampler = useRef(null)
  const held = useRef(new Set())

  useEffect(() => {
    if (localStorage.getItem("audioReady")) setAudioReady(true)
  }, [])

  useEffect(() => {
    if (user && typeof user.score === "number") {
      setScore(user.score)
    }
  }, [user])

  const updateScoreInDb = useCallback(
    async (newScore) => {
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
    async function loadSongs() {
      const { data } = await supabase
        .from("piano_tracks")
        .select("slug,name,notes")
      const map = {}
      data.forEach((s) => (map[s.slug] = { name: s.name, notes: s.notes }))
      setSongs(map)
    }
    loadSongs()
  }, [])

  useEffect(() => {
    songRef.current = songs[selectedId]?.notes || []
  }, [selectedId, songs])

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

  useEffect(() => {
    if (isGameActive && songRef.current.length > 0) {
      setTarget(songRef.current[0])
      setStep(0)
    } else setTarget(null)
  }, [isGameActive])

  const play = useCallback(
    (note) => {
      setActiveNotes((prev) => new Set(prev).add(note))
      sampler.current.triggerAttack(note)
      if (isGameActive && note === songRef.current[step]) {
        const next = step + 1
        if (next < songRef.current.length) {
          setStep(next)
          setTarget(songRef.current[next])
        } else {
          setTimeout(() => {
            const newScore = score + 100
            setScore(newScore)
            setUser((prev) => ({ ...prev, score: newScore }))
            updateScoreInDb(newScore)
            setIsGameActive(false)
            setStep(0)
            setTarget(null)
          }, 300)
        }
      }
    },
    [isGameActive, step]
  )

  const stop = useCallback((note) => {
    setActiveNotes((prev) => {
      const n = new Set(prev)
      n.delete(note)
      return n
    })
    sampler.current.triggerRelease(note)
  }, [])

  const keyDown = useCallback(
    (e) => {
      if (!isPianoFocused) return // only handle piano keys if focused
      const k = e.key.toLowerCase()

      if (k === "tab") {
        e.preventDefault()
      }

      if (keyToNoteMap[k] && !held.current.has(k)) {
        play(keyToNoteMap[k])
        held.current.add(k)
      }
    },
    [play, isPianoFocused]
  )

  const keyUp = useCallback(
    (e) => {
      const k = e.key.toLowerCase()
      if (keyToNoteMap[k]) {
        stop(keyToNoteMap[k])
        held.current.delete(k)
      }
    },
    [stop]
  )

  useEffect(() => {
    if (!audioReady || isAuthModalOpen) return
    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)
    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
    }
  }, [audioReady, isAuthModalOpen, keyDown, keyUp])

  return {
    audioReady,
    setAudioReady,
    activeNotes,
    showLabels,
    setShowLabels,
    songs,
    selectedId,
    setSelectedId,
    isGameActive,
    setIsGameActive,
    step,
    target,
    showNotes,
    setShowNotes,
    play,
    stop,
    score,
    keysData,
    keyToNoteMap,
    Tone,
    setIsPianoFocused,
  }
}

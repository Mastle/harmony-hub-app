import Piano from "./Piano"
import usePianoLogic from "./hooks/usePianoLogic"
import "../../../styles/pianoStyles.css"

export default function PianoMain() {
  const {
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
    play,
    stop,
    showNotes,
    setShowNotes,
    target,
    keysData,
    Tone,
    score,
    setIsPianoFocused,
  } = usePianoLogic()

  const initializeAudio = () => {
    Tone.start()
    setAudioReady(true)
    localStorage.setItem("audioReady", "true")
  }

  return (
    <>
      <div
        className="piano-container"
        tabIndex={0}
        onFocus={() => setIsPianoFocused(true)}
        onBlur={() => setIsPianoFocused(false)}
      >
        {!audioReady && (
          <button onClick={initializeAudio} className="btn p-6">
            Click to start the piano
          </button>
        )}
        {audioReady && (
          <Piano
            keys={keysData}
            onPlay={play}
            onStop={stop}
            isActive={(note) => activeNotes.has(note)}
            isTarget={(note) => note === target}
            showLabels={showLabels}
          />
        )}
      </div>
      {/* Score and Controls */}
      <div className="text-center mb-8">
        <div className="text-2xl font-bold">Score: {score}</div>

        {/* Show/Hide Notes */}
        {showNotes && (
          <div className="my-4">
            {songs[selectedId]?.notes.map((n, i) => (
              <span key={i} className="mx-2 text-lg">
                {n.charAt(0)}
              </span>
            ))}
          </div>
        )}

        {/* Song Selection and Game Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 max-w-max mx-auto">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={isGameActive}
            className="select select-bordered"
          >
            {Object.entries(songs).map(([id, song]) => (
              <option key={id} value={id}>
                {song.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setIsGameActive((prev) => !prev)
            }}
            className={isGameActive ? "btn btn-warning" : "btn btn-success"}
          >
            {isGameActive ? "Stop Song Game" : "Start Song Game"}
          </button>

          <button
            onClick={() => setShowLabels((prev) => !prev)}
            className="btn btn-secondary"
          >
            {showLabels ? "Hide Key Labels" : "Show Key Labels"}
          </button>
          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className="btn btn-info mt-2"
          >
            {showNotes ? "Hide Notes" : "Show Notes"}
          </button>
        </div>
      </div>
    </>
  )
}

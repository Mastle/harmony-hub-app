export default function Key({
  note,
  keyChar,
  isBlack,
  onPlay,
  onStop,
  isActive,
  isTarget,
  showLabels,
}) {
  return (
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
}

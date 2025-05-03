// src/components/Instruments/Piano/Piano.jsx
import Key from "./Key"

export default function Piano({
  keys,
  onPlay,
  onStop,
  isActive,
  isTarget,
  showLabels,
}) {
  return (
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
}

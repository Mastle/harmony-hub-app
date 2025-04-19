export const keysData = [
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

export const keyToNoteMap = keysData.reduce((map, { keyChar, note }) => {
  map[keyChar] = note
  return map
}, {})

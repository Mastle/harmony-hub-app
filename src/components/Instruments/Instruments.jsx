"use client"

import pianoCardImage from "../../assets/images/instrument-cards/piano-card-orange.png"
import synthCardImage from "../../assets/images/instrument-cards/synth-card-green.png"
import drumCardImage from "../../assets/images/instrument-cards/drum-card-orange.png"
import InstrumentCard from "./InstrumentCard"

const instrumentsData = [
  {
    name: "Piano",
    image: pianoCardImage,
    description:
      "The starting point for every great tune. Its friendly keys are waiting for you to explore, create, and have fun. Dive in and start your musical adventure.",
    buttonText: "Play Now",
    instrumentURL: "/instruments/piano",
    isDisabled: false,
  },
  {
    name: "Synthesizer",
    image: synthCardImage,
    description:
      "The starting point for every great tune. Its friendly keys are waiting for you to explore, create, and have fun. Dive in and start your musical adventure.",
    buttonText: "Coming Soon",
    instrumentURL: "/instruments/synth",
    isDisabled: true,
  },
  {
    name: "Drum Pad",
    image: drumCardImage,
    description:
      "The starting point for every great tune. Its friendly keys are waiting for you to explore, create, and have fun. Dive in and start your musical adventure.",
    buttonText: "Coming Soon",
    instrumentURL: "/instruments/drums",
    isDisabled: true,
  },
]

const Instruments = () => {
  return (
    <>
      <h2 className="pacifico-regular text-center mt-32 text-5xl">
        instruments
      </h2>
      <div className="instruments container flex mt-16 gap-10 items-center sm:justify-between flex-col sm:flex-row mx-auto">
        {instrumentsData.map((instrument) => (
          <InstrumentCard key={instrument.name} {...instrument} />
        ))}
      </div>
    </>
  )
}

export default Instruments

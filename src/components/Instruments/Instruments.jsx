"use client"

import pianoCardImage from "../../assets/images/instrument-cards/piano-card-orange.png"
import synthCardImage from "../../assets/images/instrument-cards/synth-card-green.png"
import drumCardImage from "../../assets/images/instrument-cards/drum-card-orange.png"

const Instruments = () => {
  return (
    <>
      <h2 className="pacifico-regular text-center mt-32 text-5xl">
        instruments
      </h2>
      <div className="instruments container flex mt-16 gap-10 items-center sm:justify-between flex-col sm:flex-row mx-auto">
        <div className="card card-border border-info bg-base-100 w-96 shadow-sm">
          <figure>
            <img src={pianoCardImage} alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl">Piano</h2>
            <p className="text-lg">
              The starting point for every great tune. Its friendly keys are
              waiting for you to explore, create, and have fun. Dive in and
              start your musical adventure
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary text-lg">Play Now</button>
            </div>
          </div>
        </div>
        <div className="card card-border border-info bg-base-100 w-96 shadow-sm">
          <figure>
            <img src={synthCardImage} alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl">Synthesizer</h2>
            <p className="text-lg">
              The starting point for every great tune. Its friendly keys are
              waiting for you to explore, create, and have fun. Dive in and
              start your musical adventure
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-warning hover:cursor-default text-lg">
                coming soon
              </button>
            </div>
          </div>
        </div>
        <div className="card card-border border-info bg-base-100 w-96 shadow-sm">
          <figure>
            <img src={drumCardImage} alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl">Drum Pad</h2>
            <p className="text-lg">
              The starting point for every great tune. Its friendly keys are
              waiting for you to explore, create, and have fun. Dive in and
              start your musical adventure
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-warning hover:cursor-default text-lg">
                coming soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Instruments

/* 
    current step(short overview): 
      -> Move on to the instruments component - Time to get started on the instruments (starting with Piano)
       -- Ask ai about the distance between headers for each page (on homepage you're using min-h, and here you're using mt-32. Which one is better? is it ok as is?)
       -- Hook up the piano card to the piano page
       -- Time to add the piano!
       not sure when the next instruments will be added, there's a bunch of cool new features that might be more valuable than another instrument for this app
      - move on to music player and real time note highlighting
      - Joyful Speaking is next
*/

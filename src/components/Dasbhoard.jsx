"use client"

import { CirclePlay, Piano } from "lucide-react"

const Dashboard = () => {
  return (
    <section className="container">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg min-h-[400px] items-stretch">
          <div className="p-6 rounded-lg shadow-md bg-base-100 cursor-pointer hover:bg-accent hover:text-accent-content">
            <Piano size={100} className="text-primary" />
            <h2 className="py-5 pacifico-regular text-5xl font-bold text-secondary">
              Instruments
            </h2>
            <p className="text-lg mt-2 mb-4">
              Step into the world of digital music creation with our collection
              of virtual instruments. Whether you're a seasoned musician or just
              starting out, our interactive tools let you compose, experiment,
              and bring your melodies to life. Play directly from your keyboard,
              explore different sounds, and unleash your creativity—all within
              your browser. Start your journey into the art of sound today!
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-base-100 cursor-pointer hover:bg-accent hover:text-accent-content">
            <CirclePlay size={100} className="text-primary" />
            <h2 className="py-5 text-5xl font-bold pacifico-regular cursor-pointer text-secondary">
              music player
            </h2>
            <p className="text-lg mt-2 mb-4">
              Immerse yourself in a seamless listening experience with our
              intuitive music player. Whether you’re enjoying your own
              compositions or exploring new tunes, our player is designed for
              smooth playback and an immersive audio experience. Save, revisit,
              and share your music effortlessly. Sit back, press play, and let
              the music take over.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard

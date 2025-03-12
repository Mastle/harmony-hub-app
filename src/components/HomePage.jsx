"use client"

import { Link } from "react-router"

const HomePage = () => {
  return (
    <div className="mx-auto min-h-[600px] flex container justify-center items-center flex-col">
      <div className="px-5">
        <h1 className="text-center text-4xl font-bold p-5 mt-6  ">
          <span className="block mb-4">Harmony Hub: </span> Where Your Music
          Comes to Life
        </h1>
        <div className="text-center my-6">
          <p className="text-xl mb-2">
            Your journey into music exploration starts here. Play, experiment,
            and bring melodies to life—no experience needed!
          </p>
          <p className="text-xl mb-2">
            Whether you're a beginner or a seasoned musician, Harmony Hub lets
            you explore sounds effortlessly—right from your browser.
          </p>
          <p className="text-xl">
            Try out the piano, record your tunes, and let creativity flow! Ready
            to make some music?
          </p>
        </div>
        <div className="text-center mt-16">
          <Link
            className="btn btn-outline btn-primary mt-2 p-6 text-xl"
            to="/instruments/piano"
          >
            ready to make some music?
          </Link>
        </div>
      </div>
    </div>
  )
}
export default HomePage

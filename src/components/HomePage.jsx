"use client"

import { useState, useEffect } from "react"
import Login from "./Login"
import Register from "./Register"
import Instruments from "./Instruments/Instruments"
import MusicPlayer from "./Music/MusicPlayer"
import HomeCards from "./HomeCards"

function HomePage() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState("login")

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  if (!user) {
    return (
      <div className="gap-20 bg-base-100 min-h-screen flex items-center justify-center flex-col sm:flex-row">
        <p className="text-2xl text-center">
          welcome to the best digital music academy in the world
        </p>
        <div className="bg-primary-content border border-white p-8 rounded-lg shadow-md w-96">
          <h1 className="pacifico-regular text-5xl font-bold mb-6 text-center">
            Harmony Hub
          </h1>
          {view === "login" ? (
            <Login setUser={setUser} />
          ) : (
            <Register setUser={setUser} />
          )}
          <p className="mt-4 text-center">
            {view === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setView(view === "login" ? "register" : "login")}
              className="btn btn-secondary ms-6"
            >
              {view === "login" ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-300">
      <header className="pacifico-regular  bg-base-100 shadow-md p-4 border-b ">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Harmony Hub</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto mt-8">
        <HomeCards />
        {/* <Instruments/> */}
        {/* <MusicPlayer /> */}
      </main>
    </div>
  )
}

export default HomePage

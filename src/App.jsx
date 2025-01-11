'use client'

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import SongList from './components/SongList'
import Player from './components/Player'

export default function Home() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [currentSong, setCurrentSong] = useState(null)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Harmony Hub</h1>
          {view === 'login' ? (
            <Login setUser={setUser} />
          ) : (
            <Register setUser={setUser} />
          )}
          <p className="mt-4 text-center">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="text-blue-500 hover:underline"
            >
              {view === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
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
        <SongList setCurrentSong={setCurrentSong} />
        {currentSong && <Player song={currentSong} />}
      </main>
    </div>
  )
}
 /* 
 - Current step: First, Create the github repo for this project
 - Then, Make sure you know exactly how each and every component works
 - See if there are any feature or changes you want to add right now - try to use Shadcn
 - Add Firebase
 - Time to Test deploy! 
 - Next, it's time to find a nice design framework
 */
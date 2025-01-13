'use client'

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import SongList from './components/SongList'
import Player from './components/Player'

export default function App() {
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
 - Current step: 
 - Steps that need to be taken for a viable MVP - try to use Shadcn with daisyUI as much as possible!
   -- Fix all the UI problems. (identify what each page really needs, utilize daisyUI to have an ok first design. IMPORTANT: it's ok if it looks like ass, we're going for publicly testing all the basic functionalities at this point, hmm ok?)
   -- and then I'll add the easiest experimental instrument
   -- make it possible to have playlist and favorite songs
   -- Backend (authentication system and songs) need to be connected to firebase.
   -- Get some real life people to test the extra feature of streaming music. 
       Just get them to test it when they're out by adding their favorite playlist 
       to see the streaming is solid. (Ask what their favorite all time album that they might still listen to right now is!)
   -- (at this point this could be a nice v0/alpha release, then go on to add the other features -> )
   -- See if you can gamify this whole thing/add a super cute UI touch up to attract users
   -- maybe add the scoring system right from now?
 - Time to Test deploy
 - Next, it's time to find a nice design framework
 */
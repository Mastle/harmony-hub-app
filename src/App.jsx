'use client'

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Instruments from './components/Instruments'
import MusicPlayer from './components/MusicPlayer'
import HomeCards from './components/HomeCards'


export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')

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
      <div className="gap-20 bg-base-100 min-h-screen flex items-center justify-center flex-col sm:flex-row">
        <p className="text-2xl text-center">welcome to the best digital music academy in the world</p>
        <div className="bg-primary-content border border-white p-8 rounded-lg shadow-md w-96">
          <h1 className="pacifico-regular text-5xl font-bold mb-6 text-center">Harmony Hub</h1>
          {view === 'login' ? (
            <Login setUser={setUser} />
          ) : (
            <Register setUser={setUser} />
          )}
          <p className="mt-4 text-center">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="btn btn-secondary ms-6"
            >
              {view === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
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
        <HomeCards/>
        {/* <Instruments/> */}
       </main>
    </div>
  )
}
  /* 
 - step: 
   -- Piano created. Reviewing the app to install the piano properly.
   current step: --- start with creating actual routes for routing the user to the music player page and also the instruments page separately. 
   (only gonna use placeholderdesign assets in this phase. Once the app is finalized, I can go for an upgrade just as I did with ATproductions)
g    --- Add a "piano" card and then a "coming soon" instrument card to the "instruments" page 
    --- Style the piano as best as you can
    --- Features to add along side the virtual piano:
    --- Sheet Music or MIDI Export – Let users export their recorded melodies as MIDI files or simple sheet music (e.g., MusicXML).
    --- Playback & Editing – Let users replay their recorded melodies and make basic edits (e.g., trimming, adjusting notes).
    --- Sharing & Collaboration – Allow users to share their recordings with others, either via a link or an in-app community
   -- Create the Dashboard page (after login, gives the user a choice between music player and instruments)
  -- necessary feature for the music player: make it better by adding a note by note (graphical) analysis of how the most famous classical music tracks are played! 
       the purpose of this feature is to provide better analysis of timeless tracks that can elevate the understanding of music for users - Real-Time Note Highlighting. 
       Check the relevant readme file for this one)
    ----  maybe allow users to store their own melodies on the server (start figuring out how to best stream the files from a firebase server from there) 
    --- add some free songs (firebase, see if you there is a way to send the file down in chunks from Firebase, will upgrade to a streaming server if it turns out to be the right choice for my career)
    --- add playlist and favorite songs functionality (firebase!)
   -- make sure songs are searchable and filterable 
   -- authentication system and songs need to be connected to firebase.
   -- (at this point this could be a nice v0/alpha release, then go on to add the other features -> )
   -- See if you can gamify this whole thing/add a super cute UI touch up to attract users
   -- maybe add the scoring system right from now?
 - Time to test deploy
 - Next, it's time to find a nice design framework
 - Before we finish: add things to the project that utilize RSC and React 19 features! (to get a good practice and improve portfolio)
  

 IMPORTANT: final decision for portfolio and job interviews:
               - firebase and vanilla react is definitely the path for harmony hub
               - T3 stack for next.js store
               - data structure, leet code and CSS challanges next 
               - If the frontend market is shit, I'll move on to laravel and PHP to expand!
                If not, go even deeper on frontend
 */

      /* An amazing digital music academy for learners, the best assistant and one-stop-shop for all the professionals' needs */
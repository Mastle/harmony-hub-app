'use client'

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import SongList from './components/SongList'
import Player from './components/Player'
import Instrument from './components/Instrument'
import MusicPlayer from './components/MusicPlayer'


export default function App() {
  // const [user, setUser] = useState(null)
  // const [view, setView] = useState('login')

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem('user')
  //   if (loggedInUser) {
  //     setUser(JSON.parse(loggedInUser))
  //   }
  // }, [])
  

  // const handleLogout = () => {
  //   localStorage.removeItem('user')
  //   setUser(null)
  // }

  // if (!user) { 
  //   return (
  //     <div className="gap-20 bg-base-100 min-h-screen flex items-center justify-center flex-col sm:flex-row">
  //       <p className="text-2xl">welcome to the best digital music academy in the world</p>
  //       <div className="bg-primary-content border border-white p-8 rounded-lg shadow-md w-96">
  //         <h1 className="pacifico-regular text-5xl font-bold mb-6 text-center">Harmony Hub</h1>
  //         {view === 'login' ? (
  //           <Login setUser={setUser} />
  //         ) : (
  //           <Register setUser={setUser} />
  //         )}
  //         <p className="mt-4 text-center">
  //           {view === 'login' ? "Don't have an account? " : "Already have an account? "}
  //           <button
  //             onClick={() => setView(view === 'login' ? 'register' : 'login')}
  //             className="btn btn-secondary ms-6"
  //           >
  //             {view === 'login' ? 'Register' : 'Login'}
  //           </button>
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-base-100">
      <header className="pacifico-regular  bg-base-100 shadow-md p-4 border-b ">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Harmony Hub</h1>
          <button
            // onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      {/* <Instrument/> */}
      <main className="container mx-auto mt-8">
        <MusicPlayer/>
      </main>
    </div>
  )
}
 /* 
 - Current step: 
   -- Create the instrument component (the first instrument is without a doubt the Piano)
   -- Create the music player component (integrate SongList and Player components)
   -- Create the Dashboard page (after login, gives the user a choice between music player and instruments)
   -- add some free songs (firebase, see if you there is a way to send the file down in chunks from Firebase, will upgrade to a streaming server if it turns out to be the right choice for my career)
   -- add playlist and favorite songs functionality (firebase!)
   -- make sure songs are searchable and filterable 
   -- authentication system and songs need to be connected to firebase.
   -- (at this point this could be a nice v0/alpha release, then go on to add the other features -> )
   -- See if you can gamify this whole thing/add a super cute UI touch up to attract users
   -- maybe add the scoring system right from now?
 - Time to test deploy
 - Next, it's time to find a nice design framework
 */
"use client"

import { Routes, Route } from "react-router"
import MainLayout from "./components/MainLayout"
import HomePage from "./components/HomePage"
import AuthLayout from "./components/Auth/AuthLayout"
import LogIn from "./components/Auth/LogIn"
import Register from "./components/Auth/Register"
import Instruments from "./components/Instruments/Instruments"
import Piano from "./components/Instruments/Piano"
import MusicPlayer from "./components/Music/MusicPlayer"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LogIn />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="instruments" element={<Instruments />} />
        <Route path="instruments/piano" element={<Piano />} />
        <Route path="player" element={<MusicPlayer />} />
      </Route>
    </Routes>
  )
}

export default App
/* 


    
 - steps: 
    --- Restructuring the app for react router
    --- Add a "piano" card and then a "coming soon" instrument card to the "instruments" page 
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
   -- (future, enhancing the authentication system and adding user profile features) switch "login" navbar item to "hi, {name}". And when this new item is clicked,
         It shows a contenxt menu that says: log out and underneath it, "profile" which takes the user to their profile
 - Once the MVP is finished, try to identify which parts benefit from React 19 and RSC
 - Time to test deploy
 - Before we finish: add things to the project that utilize RSC and React 19 features! (to get a good practice and improve portfolio)
  

 IMPORTANT: final decision for portfolio and job interviews:
               - firebase and vanilla react is definitely the path for harmony hub
               - T3 stack for next.js store
               - data structure, leet code and CSS challanges next 
               - If the frontend market is shit, I'll move on to laravel and PHP to expand!
                If not, go even deeper on frontend
 */

/* An amazing digital music academy for learners, the best assistant and one-stop-shop for all the professionals' needs */

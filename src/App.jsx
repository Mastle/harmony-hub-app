"use client"

import { Routes, Route } from "react-router"
import { AuthProvider } from "./components/Auth/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import MainLayout from "./components/MainLayout"
import HomePage from "./components/HomePage"
import Instruments from "./components/Instruments/Instruments"
import PianoMain from "./components/Instruments/Piano/PianoMain"
import MusicPlayer from "./components/Music/MusicPlayer"
import UserProfile from "./components/UserProfile"
import AuthModal from "./components/Auth/AuthModal"

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<UserProfile />} />
          </Route>
          <Route path="instruments" element={<Instruments />} />
          <Route path="instruments/piano" element={<PianoMain />} />
          <Route path="player" element={<MusicPlayer />} />
        </Route>
      </Routes>
      <AuthModal />
    </AuthProvider>
  )
}

export default App

/* 
 - steps: 
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
 - Do consider a cdn for all your assets. That's the best way to speed things up, (and remember to optimize images using stuff like webp format)
 - Time to test deploy
 - Before we finish: add things to the project that utilize RSC and React 19 features! (to get a good practice and improve portfolio)
 - New rule: before wrapping things up, I must address the "TODO" comments of each section of the project. This is a technique that allows me to build rapidly and add the essential 
 improvements later on!
  -- Before I consider myself good at React, I must be able to know every one of these topics:
   01-Introduction-and-getting-started  
   02-react-related-javascript-refresher  
   03-react-fundamentals.md  
   04-forms-and-input-notes-app  
   05-lifecycle-and-useeffect-hook  
   06-useRef-hook-simple-timer-app  
   07-working-with-apis-crypto-dash  
   08-intro-to-routing-react-router-declarative-mode  
   09-build-and-deploy  
   10-context-api-shopping-cart-project  
   11-react-router-framework-mode-friendly-dev  
   12-fetching-data-with-loaders  
   13-pagination-filtering-and-more  
   14-react-router-actions  
   15-strapi-headless-cms-for-data  
   16-cloudinary-contact-form-and-deployment  
   17-tanstack-query-github-finder-project  
   18-tanstack-router-idea-drop-project  
   19-learn-the-mern-stack.md  
 */

/* An amazing digital music academy for learners, the best assistant and one-stop-shop for all the professionals' needs */

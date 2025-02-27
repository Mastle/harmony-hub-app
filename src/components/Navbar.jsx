"use client"

import { NavLink } from "react-router"
import logo from "../assets/images/logo.svg"

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-accent text-accent-content hover:bg-teal-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-teal-900 hover:text-white text-lg rounded-md px-3 py-2"
  //TODO: fix the styling issue "text-secondary-content"
  //TODO: should I keep the colors white or change them to dark for nav menu items?
  return (
    <nav className="bg-secondary border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="h-10 w-auto" src={logo} alt="Harmony Hub" />
              <span className="hidden md:block text-white text-3xl font-bold pacifico-regular ml-2">
                Harmony Hub
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to="/instruments" className={linkClass}>
                  Instruments
                </NavLink>
                <NavLink to="/jobs" className={linkClass}>
                  Music Player
                </NavLink>
                <NavLink to="/add-job" className={linkClass}>
                  About
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar

/* 

    current step(short overview): 
    (TODO is reserved for issues)
      - creating app routes and navigation links with react router
        --> re-adjust the navbar according to the routes of your app
        -- Make the menu responsive
        -- create the authentication layout and implement auth system properly
        -- The "Dashboard" page is what the users will see which consists of two cards: "instruments" card and the "music player" card
        -- need to set up the routes for virtual piano and music player properly
      - implement the piano fully
      - move on to music player and real time note highlighting
      - add as much as feature as you can till the end of ESFAND
      - Joyful Speaking is next


*/

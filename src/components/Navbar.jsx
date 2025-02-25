"use client"

import { NavLink } from "react-router"
import logo from "../assets/images/logo.svg"

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-accent text-accent-content hover:bg-teal-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-teal-900 hover:text-white rounded-md px-3 py-2"

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

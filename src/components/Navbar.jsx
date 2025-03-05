"use client"

import { useAuth } from "./Auth/AuthContext"
import { NavLink } from "react-router"
import { LogIn, LogOut } from "lucide-react"
import logo from "../assets/images/logo.svg"

const Navbar = () => {
  const { user, setIsAuthModalOpen, handleLogout } = useAuth()

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-teal-900 text-white hover:bg-teal-900 hover:text-white text-lg rounded-md px-3 py-2"
      : "text-white hover:bg-teal-900 hover:text-white text-lg rounded-md px-3 py-2"
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
                <li className="mt-2">
                  <NavLink to="/instruments" className={linkClass}>
                    Instruments
                  </NavLink>
                </li>
                <li className="mt-2">
                  <NavLink to="/player" className={linkClass}>
                    Music Player
                  </NavLink>
                </li>
                <li>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="text-white hover:bg-teal-900 hover:text-white text-lg rounded-md px-3 py-2"
                    >
                      Logout
                      <LogOut
                        style={{ display: "inline", marginLeft: "0.5rem" }}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-white hover:bg-teal-900 hover:text-white text-lg rounded-md px-3 py-2"
                    >
                      Login
                      <LogIn
                        style={{ display: "inline", marginLeft: "0.5rem" }}
                      />
                    </button>
                  )}
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar

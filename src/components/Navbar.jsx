"use client"

import { useState } from "react"
import { useAuth } from "./Auth/AuthContext"
import { NavLink } from "react-router"
import { LogIn, LogOut, Menu, X } from "lucide-react"
import logo from "../assets/images/logo.svg"

const Navbar = () => {
  const { user, setIsAuthModalOpen, handleLogout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-lg rounded-md px-3 py-2 transition-colors ${
      isActive
        ? "bg-teal-900 text-white"
        : "text-white hover:bg-teal-900 hover:text-white"
    }`

  return (
    <nav className="bg-secondary border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <NavLink className="flex items-center ml-2 md:ml-0" to="/">
              <img className="h-10 w-auto" src={logo} alt="Harmony Hub" />
              <span className="hidden md:block text-white text-3xl font-bold pacifico-regular ml-2">
                Harmony Hub
              </span>
            </NavLink>
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-teal-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4 font-bold">
            <NavLink to="/instruments" className={linkClass}>
              Instruments
            </NavLink>
            <NavLink to="/player" className={linkClass}>
              Player
            </NavLink>
            {user && (
              <NavLink to="/account" className={linkClass}>
                account
              </NavLink>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className={
                  linkClass({ isActive: false }) + " flex items-center"
                }
              >
                Logout
                <LogOut className="ml-2" size={20} />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={
                  linkClass({ isActive: false }) + " flex items-center"
                }
              >
                Login
                <LogIn className="ml-2" size={20} />
              </button>
            )}
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute md:hidden text-center font-bold top-20 left-0 right-0 bg-secondary border-b border-indigo-500 z-50">
              <div className="px-4 py-2 space-y-2">
                <div className="flex flex-col">
                  <NavLink
                    to="/instruments"
                    className={linkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Instruments
                  </NavLink>
                  <NavLink
                    to="/player"
                    className={linkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Player
                  </NavLink>
                </div>
                <div className="pt-2 border-t border-secondary-content">
                  <span className="block mt-2"></span>
                  {user && (
                    <NavLink
                      to="/account"
                      className={linkClass}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Account
                    </NavLink>
                  )}
                  <div>
                    {user ? (
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className={
                          linkClass({ isActive: false }) +
                          " w-full flex items-center justify-center"
                        }
                      >
                        Logout
                        <LogOut className="ml-2" size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className={
                          linkClass({ isActive: false }) +
                          " w-full flex items-center justify-center"
                        }
                      >
                        Login
                        <LogIn className="ml-2" size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

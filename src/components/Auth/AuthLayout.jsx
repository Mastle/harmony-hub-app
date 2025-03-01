"use client"

import { useState, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router"

function AuthLayout() {
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  if (!user) {
    return (
      <div className="gap-20 bg-base-100 min-h-screen flex items-center justify-center flex-col sm:flex-row">
        <div className="bg-primary-content border border-white p-8 rounded-lg shadow-md w-96">
          <h1 className="pacifico-regular text-5xl font-bold mb-6 text-center">
            Harmony Hub
          </h1>

          <Outlet context={{ setUser }} />

          <p className="mt-4 text-center">
            {location.pathname === "/auth/login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              to={
                location.pathname === "/auth/login"
                  ? "/auth/register"
                  : "/auth/login"
              }
              className="btn btn-secondary ms-6"
            >
              {location.pathname === "/auth/login" ? "Register" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-300">
      <div className="container mx-auto">
        <h1>Use navigate will fix this</h1>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default AuthLayout

/* 

    current step(short overview): 
    (TODO is reserved for issues)
      - creating app routes and navigation links with react router
        -->  Create the protected component (refer to geepeeT)
        -- Create the dashbord and run the dashboard component on it protectedly
        -- The navbar has to change "login" to "Profile"
        -- Make the menu responsive
        -- The "Dashboard" page is what the users will see which consists of two cards: "instruments" card and the "music player" card
        -- need to set up the routes for virtual piano and music player properly
      - implement the piano fully
      - move on to music player and real time note highlighting
      - add as much as feature as you can till the end of ESFAND
      - Joyful Speaking is next


*/

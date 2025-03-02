"use client"

import { useState } from "react"
import { useOutletContext } from "react-router"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useOutletContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailToLowerCase = email.toLowerCase()
    const passwordToLowerCase = password.toLowerCase()
    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailToLowerCase,
        password: passwordToLowerCase,
      }),
    })
    const user = await response.json()
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-green-400"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-green-400"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
        bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Register
      </button>
    </form>
  )
}

/* 

    current step(short overview): 
    (TODO is reserved for issues)
        --> polishing the login system, make the register component compatible with the modal system, remove unused code and comments
        -- prompt the user to confirm when logout is clicked
        -- for now, the whole point of an authentication system is to allow users to record how well they can play a freely available famous track (like Beethoven's stuff)
        -- Make the navbar responsive - it's terrible right now
        -- The "Dashboard" page is what the users will see which consists of two cards: "instruments" card and the "music player" card
        -- need to set up the routes for virtual piano and music player properly
      - Once fully finished with the authentication system, I must begin migrating to the latest Tailwind and DaisyUI versions
      - implement the piano fully
      - move on to music player and real time note highlighting
      - add as much as feature as you can till the end of ESFAND
      - Joyful Speaking is next


*/

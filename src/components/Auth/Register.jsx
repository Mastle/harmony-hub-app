"use client"

import { useState } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "../../supaBaseClient.js"
import { fetchUserProfile } from "../../utils/fetchUserProfile"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser, setIsAuthModalOpen } = useAuth()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailLower = email.toLowerCase()
    const passwordToUse = password

    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailLower,
        password: passwordToUse,
      })
      if (error) throw error

      const { id, email: userEmail } = data.user
      // On sign-up, profile row may not exist yet if you're using a trigger.
      // If so, you may need to insert a default row or wait for the trigger.
      const profile = await fetchUserProfile(id)

      localStorage.setItem("user", JSON.stringify({ id, email: userEmail }))
      setUser({ id, email: userEmail, ...profile })
      setIsAuthModalOpen(false)
    } catch (err) {
      console.error("Registration error:", err)
      alert(err.message || "Registration failed")
    }
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
        bg-green-600 hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Register
      </button>
    </form>
  )
}

/* 
      TODOS:
       - The login component could use better styles (a touch up is in order)
       - Notifications are needed for user actions (something like "you are logged in" notif with react toastify)
       - prompt the user to confirm when logout is clicked
       - may need to add protected routes

*/

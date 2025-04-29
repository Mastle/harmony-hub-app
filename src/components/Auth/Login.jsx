"use client"

import { useState } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "../../supaBaseClient.js" 

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser, setIsAuthModalOpen } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Ensure email and password are correctly formatted
    const emailLowerCase = email.toLowerCase()
    const passwordLowerCase = password.toLowerCase()

    try {
      // Attempt to log in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLowerCase,
        password: passwordLowerCase,
      })

      if (error) throw error

      // If login is successful, update user state and localStorage
      const user = data.user
      localStorage.setItem(
        "user",
        JSON.stringify({ email: user.email, id: user.id })
      ) // Store minimal data
      setUser({ email: user.email, id: user.id }) // Update user context
      setIsAuthModalOpen(false) // Close the modal
    } catch (error) {
      console.error("Login error:", error.message)
      alert("Invalid credentials or login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-primary"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 
          block w-full px-3 py-2 border border-white
           rounded-md
           shadow-sm 
           focus:outline-hidden
           focus:ring-blue-500
          focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-primary"
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
        className="w-full flex justify-center py-2 px-4 border border-transparent btn btn-primary"
      >
        Login
      </button>
    </form>
  )
}

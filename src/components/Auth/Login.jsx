"use client"

import { useState } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "../../supaBaseClient.js"
import { fetchUserProfile } from "../../utils/fetchUserProfile"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser, setIsAuthModalOpen } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailLower = email.toLowerCase()
    // — Avoid lowercasing passwords (it weakens them)
    const passwordToUse = password

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: passwordToUse,
      })
      if (error) throw error

      // data.user always includes id & email
      const { id, email: userEmail } = data.user
      const profile = await fetchUserProfile(id)

      localStorage.setItem("user", JSON.stringify({ id, email: userEmail }))
      setUser({ id, email: userEmail, ...profile })
      setIsAuthModalOpen(false)
    } catch (err) {
      console.error("Login error:", err)
      alert(err.message || "Login failed")
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

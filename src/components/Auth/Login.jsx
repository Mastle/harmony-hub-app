"use client"

import { useState } from "react"
import { useOutletContext, useNavigate } from "react-router"

export default function Login({}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useOutletContext()
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("http://localhost:3001/users")
    const users = await response.json()
    const emailLowerCase = email.toLowerCase()
    const passwordLowerCase = password.toLowerCase()
    const user = users.find(
      (u) => u.email === emailLowerCase && u.password === passwordLowerCase
    )
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      navigate("/")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block 
        text-sm font-medium text-primary"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full
           px-3 py-2 
           border border-white
           rounded-md shadow-sm
            focus:outline-none 
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full 
        flex justify-center 
        py-2 px-4 border 
        border-transparent  
        btn
        btn-primary"
      >
        Login
      </button>
    </form>
  )
}

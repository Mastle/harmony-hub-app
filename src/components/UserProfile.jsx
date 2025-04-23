"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, Check } from "lucide-react"
import { useAuth } from "./Auth/AuthContext"

export default function UserProfile() {
  const { user, setUser } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [confirmPw, setConfirmPw] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Initialize form with context user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // leave blank for new password
      })
    }
  }, [user])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Basic validation
  const validate = () => {
    const errs = {}
    // if (!formData.name) errs.name = "Name is required"
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) errs.email = "Invalid email"
    if (formData.password && formData.password !== confirmPw)
      errs.password = "Passwords do not match"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault()

    if (!validate()) return
    setLoading(true)

    const payload = { name: formData.name, email: formData.email }
    if (formData.password) payload.password = formData.password

    setUser((prev) => ({
      ...prev,
      password: payload.password,
      name: payload.name,
      email: payload.email,
    }))

    try {
      await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      // Optionally update context or show success message
    } catch (err) {
      console.error("Update failed", err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md mx-auto bg-base-100 shadow-md mt-36">
        <form onSubmit={handleSave}>
          <div className="card-body space-y-4">
            <div>
              <label className="label">
                <span className="label-text">User ID</span>
              </label>
              <span className="block mt-2">{user.id}</span>
            </div>

            {/* Score (display only) */}
            <div>
              <label className="label">
                <span className="label-text">Score</span>
              </label>
              <span className="block mt-2 font-bold">{user.score}</span>
            </div>

            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                className="input input-bordered input-info w-full mt-2"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3">
                  <Mail size={16} />
                </span>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered input-info w-full  mt-2"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <p className="text-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3">
                  <Lock size={16} />
                </span>
                <input
                  name="password"
                  type="password"
                  className="input input-info input-bordered w-full mt-2"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                className="input input-info input-bordered w-full mt-2"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
              {errors.password && (
                <p className="text-error">{errors.password}</p>
              )}
            </div>
            {/* Save Button */}
            <button
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              <Check size={20} />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, Check } from "lucide-react"
import { useAuth } from "./Auth/AuthContext"

export default function UserProfile() {
  const { user } = useAuth()
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
  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)

    const payload = { name: formData.name, email: formData.email }
    if (formData.password) payload.password = formData.password

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
    <div data-theme="dracula" className="min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md mx-auto bg-base-100 shadow-md">
        <div className="card-body space-y-4">
          {/* ID (read-only) */}
          <div>
            <label className="label">
              <span className="label-text">User ID</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={user.id}
              readOnly
            />
          </div>

          {/* Score (display only) */}
          <div>
            <label className="label">
              <span className="label-text">Score</span>
            </label>
            <div className="input input-bordered w-full">{user.score}</div>
          </div>

          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              name="name"
              type="text"
              className="input input-bordered w-full"
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
                className="input input-bordered w-full pl-10"
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
                className="input input-bordered w-full pl-10"
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
              className="input input-bordered w-full"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
            {errors.password && <p className="text-error">{errors.password}</p>}
          </div>

          {/* Save Button */}
          <button
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            <Check size={20} />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* 
     current step(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- implement User profiles and settings   (The most minimal version possible) ->
          Time to implement the user profile page.
          Let's start with the simplest version possible. Oh, this reminds me. What also needs to happen is a new item should be added to the navbar that allows the users to access their user profile page.
          And I must set it up in such a way that  the menu item initially says "account", but if the user has now added the optional item of their user info, which is their name, it says "Hi, ${Name}". 
       
       
          -- so before deployment, I wanna see how testing an app works.I gotta get good at that as a competitive dev, I think it was called jest or jester? the useful thing for testing react apps, there's a bunch of them and learn how it works, implement it on this app to see what they're about and deployment is next
         -- The app must be ready for a small test by a handful users at this point(also a great excuse to test deployment with react and firebase). See how it goes =)
         -- Trying to fix the responsiveness issues for the paino gets too complicated on the dev server, it's better to revisit this issue after it's been deployed and is actually accessible on smaller devices
         -- If harmony hub succeeds in attracting users (or it becomes a safe bet for basing my software career), I'll look into the best way to gamify playing this piano. I'll come up with the best ways to incentivize users to play the piano, and have a blast as they're learning how music works
        - move on to the music player and real time note highlighting (once this feature has been added, Development on this project should stop. I have to shift
       my focus on to  Next.js, Typescript, An online shop that is the most sophisticated it can be in terms of looks and features. However its scale does have to
       be compatible with the fact that it's a portfolio project at the end of the day. Once ATP is ready with all the portfolio projects, I'll 
       come up with the best plan to divide my attention acroses these projects in such a way that  I can make some real dough, I keep evolving as a dev, and I'm doing
       what I love (a balance through the mixture of these three))
       - Joyful Speaking is next
 */

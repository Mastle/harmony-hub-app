"use client"

import { useState, useEffect } from "react"
import { Mail, Lock, Check } from "lucide-react"
import { useAuth } from "./Auth/AuthContext"
import { supabase } from "../supabaseClient"

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
        email: user.email,
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
    setErrors({})

    try {
      // 1. Update user auth info (email/password)
      const updates = {}
      if (formData.email && formData.email !== user.email) {
        updates.email = formData.email
      }
      if (formData.password) {
        updates.password = formData.password
      }
      if (Object.keys(updates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updates)
        if (authError) throw authError
      }

      // 2. Update user metadata in 'users' table
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ name: formData.name })
        .eq("id", user.id)

      if (dbError) throw dbError

      // 3. Update local user context
      setUser((prev) => ({
        ...prev,
        email: formData.email,
        name: formData.name,
      }))

      // Optionally show success message
      console.log("Profile updated successfully!")
    } catch (err) {
      console.error("Update failed", err.message)
      setErrors({ form: err.message })
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

//ISSUE: updating email trips the supabase email rate limit, is it fixed today?

/*.
      current steps(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- implementing backend:
                piano -> the song notes now come from the database, refactor the code accordingly. Must also add user score
                user score (for the piano scores)
                

         -- The next step is to add the tests to the CI workflow (continuous integration) routine 
         -- It's deployment time baby!
         -- Trying to fix the responsiveness issues for the paino gets too complicated on the dev server, it's better to revisit this issue after it's been deployed and is actually accessible on smaller devices
         -- I also think now (early post alpha release) is a great time to consider RSC and React 19 (stuff like server side components, ssr and form actions)
         -- Must move on to JWTs if this app is ever to hit real production
         -- If harmony hub succeeds in attracting users (or it becomes a safe bet for basing my software career), I'll look into the best way to gamify playing this piano. I'll come up with the best ways to incentivize users to play the piano, and have a blast as they're learning how music works
         -- I have to add Docker to this thing once I've taken care of the previous steps. It's a necessity, it's great tech!
         - move on to the music player and real time note highlighting (once this feature has been added, Development on this project should stop. I have to shift
       my focus on to  Next.js, Typescript, An online shop that is the most sophisticated it can be in terms of looks and features. However its scale does have to
       be compatible with the fact that it's a portfolio project at the end of the day. Once ATP is ready with all the portfolio projects, I'll 
       come up with the best plan to divide my attention acroses these projects in such a way that  I can make some real dough, I keep evolving as a dev, and I'm doing
       what I love (a balance through the mixture of these three))
       - Joyful Speaking is next
 */

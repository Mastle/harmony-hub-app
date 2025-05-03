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
      // if (formData.email && formData.email !== user.email) {
      //   updates.email = formData.email
      // }
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
        // email: formData.email,
        name: formData.name,
      }))
      setConfirmPw("")
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
                  disabled={true}
                />
              </div>
              {/* {errors.email && <p className="text-error">{errors.email}</p>} */}
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
              />
              {errors.name && <p className="text-error">{errors.name}</p>}
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

//TODO(ISSUE): (current step) updating email trips the supabase email rate limit, is it fixed today?

/*solution: this thing needs a custom SMTP, it's the only solution. Right now, I ain't got time for it! so the email editing feature will be added
once I've taken care of the other parts and I've added a SMTP
Why Supabase Sends an Email on Email Change (Even with Confirmations Off):

Even when you disable "Secure email change" (which normally sends a confirmation to the old email address as well)
and "Confirm email" (which normally requires the user to click a link in the new email to activate the change),
 Supabase Auth still sends an email to the new email address when you use updateUser to change the email.

This email serves a crucial security purpose: 
it verifies that the user actually has access to the new email address they are trying to associate with their account.
 Without this verification,
  a malicious actor could potentially change a user's email address to one they control and take over the account.

The default Supabase email rate limit applies to all emails sent through their shared service,
 including this verification email sent to the new address during an email change.

 */

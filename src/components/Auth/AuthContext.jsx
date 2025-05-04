import { createContext, useState, useEffect, useContext } from "react"
import { fetchUserProfile } from "../../utils/fetchUserProfile"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const initUser = async () => {
      const stored = localStorage.getItem("user")
      if (!stored) return

      try {
        const { id, email } = JSON.parse(stored)
        const profile = await fetchUserProfile(id)

        setUser((prev) => ({
          ...prev,
          id,
          email,
          ...(profile || {}), // Safely spread profile data
        }))
      } catch (error) {
        console.error("Failed to fetch user:", error)
        // Fallback to just localStorage data
        const { id, email } = JSON.parse(stored)
        setUser({ id, email })
      }
    }
    initUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

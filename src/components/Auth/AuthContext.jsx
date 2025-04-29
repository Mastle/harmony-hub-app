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

      const { id, email } = JSON.parse(stored)
      try {
        const profile = await fetchUserProfile(id)
        setUser({ id, email, ...profile })
      } catch {
        // If profile fetch failed, at least restore basic auth state
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

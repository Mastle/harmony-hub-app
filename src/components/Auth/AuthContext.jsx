import { createContext, useState, useContext, useEffect } from "react"

// Create context for authentication state
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  // const handleLogin = (userData) => {
  //   localStorage.setItem("user", JSON.stringify(userData))
  //   setUser(userData)
  //   setIsAuthModalOpen(false)
  // }

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

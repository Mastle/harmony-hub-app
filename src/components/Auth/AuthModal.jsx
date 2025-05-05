import { useAuth } from "./AuthContext"
import { useState } from "react"
import Login from "./Login"
import Register from "./Register"

function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth()
  const [view, setView] = useState("login")

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-black/70 flex justify-center items-center z-3">
      <div className="bg-base-100 border border-secondary p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-2 right-2 text-xl cursor-pointer"
        >
          ✖
        </button>
        <h1 className="pacifico-regular text-3xl font-bold mb-6 text-center">
          Harmony Hub
        </h1>
        {view === "login" ? <Login /> : <Register />}
        <p className="text-center mt-4">
          {view === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={() => setView(view === "login" ? "register" : "login")}
            className="text-blue-500 ms-2"
          >
            {view === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthModal

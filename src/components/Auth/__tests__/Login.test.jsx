import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import Login from "../LogIn.jsx"
import { useAuth } from "../AuthContext"
import { supabase } from "../../../supabaseClient.js"
import { fetchUserProfile } from "../../../utils/fetchUserProfile.js"

// Mock AuthContext hook
vi.mock("../AuthContext")

// Mock Supabase client
vi.mock("../../../supabaseClient.js", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}))

// Mock fetchUserProfile util
vi.mock("../../../utils/fetchUserProfile.js", () => ({
  fetchUserProfile: vi.fn(),
}))

describe("Login component", () => {
  const mockSetUser = vi.fn()
  const mockSetIsAuthModalOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Mock AuthContext values
    useAuth.mockReturnValue({
      setUser: mockSetUser,
      setIsAuthModalOpen: mockSetIsAuthModalOpen,
    })
    // Mock alert
    vi.spyOn(window, "alert").mockImplementation(() => {})
  })

  it("renders email and password inputs and a submit button", () => {
    render(<Login />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("logs in a user with correct credentials", async () => {
    // Arrange mock responses
    const userData = { id: 1, email: "test@example.com" }
    // Set up Supabase mock
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: userData },
      error: null,
    })
    // Set up profile fetch mock
    fetchUserProfile.mockResolvedValue({ name: "Amirali" })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      // Assert Supabase sign-in
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })
      // Assert profile fetch
      expect(fetchUserProfile).toHaveBeenCalledWith(1)
      // Assert localStorage
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify({ id: 1, email: "test@example.com" })
      )
      // Assert context updates
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 1,
        email: "test@example.com",
        name: "Amirali",
      })
      expect(mockSetIsAuthModalOpen).toHaveBeenCalledWith(false)
    })
  })

  it("shows alert on invalid credentials", async () => {
    // Arrange mock failure for Supabase
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled()
      expect(mockSetUser).not.toHaveBeenCalled()
      expect(mockSetIsAuthModalOpen).not.toHaveBeenCalled()
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials")
    })
  })
})

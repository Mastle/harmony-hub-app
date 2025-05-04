import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import Register from "../Register.jsx"
import { useAuth } from "../AuthContext"
import { supabase } from "../../../supabaseClient.js"
import { fetchUserProfile } from "../../../utils/fetchUserProfile.js"

// Mock AuthContext hook
vi.mock("../AuthContext")
// Mock Supabase client
vi.mock("../../../supabaseClient.js", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}))
// Mock fetchUserProfile util
vi.mock("../../../utils/fetchUserProfile.js", () => ({
  fetchUserProfile: vi.fn(),
}))

describe("Register component", () => {
  const mockSetUser = vi.fn()
  const mockSetIsAuthModalOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    useAuth.mockReturnValue({
      setUser: mockSetUser,
      setIsAuthModalOpen: mockSetIsAuthModalOpen,
    })
    vi.spyOn(window, "alert").mockImplementation(() => {})
  })

  it("renders email and password inputs and a register button", () => {
    render(<Register />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument()
  })

  it("updates state when typing into inputs", () => {
    render(<Register />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })

    expect(emailInput.value).toBe("test@example.com")
    expect(passwordInput.value).toBe("password123")
  })

  it("registers a user successfully", async () => {
    const userData = { id: 5, email: "new@example.com" }
    // Arrange Supabase signUp mock
    supabase.auth.signUp.mockResolvedValue({
      data: { user: userData },
      error: null,
    })
    // Arrange profile fetch mock
    fetchUserProfile.mockResolvedValue({ name: "NewUser" })

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "new@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
      })
      expect(fetchUserProfile).toHaveBeenCalledWith(5)
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify({ id: 5, email: "new@example.com" })
      )
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 5,
        email: "new@example.com",
        name: "NewUser",
      })
      expect(mockSetIsAuthModalOpen).toHaveBeenCalledWith(false)
    })
  })

  it("shows alert on registration failure", async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: "Registration failed" },
    })

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpass" },
    })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled()
      expect(mockSetUser).not.toHaveBeenCalled()
      expect(mockSetIsAuthModalOpen).not.toHaveBeenCalled()
      expect(window.alert).toHaveBeenCalledWith("Registration failed")
    })
  })
})

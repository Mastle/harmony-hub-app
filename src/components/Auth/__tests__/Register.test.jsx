import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import Register from "../Register"
import { useAuth } from "../AuthContext"

vi.mock("../AuthContext")

describe("Register component", () => {
  const mockSetUser = vi.fn()
  const mockSetIsAuthModalOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({
      setUser: mockSetUser,
      setIsAuthModalOpen: mockSetIsAuthModalOpen,
    })

    // Mock alert
    vi.spyOn(window, "alert").mockImplementation(() => {})
  })

  it("renders email and password inputs and a submit button", () => {
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
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "password123",
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUser),
      })
    )

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockSetIsAuthModalOpen).toHaveBeenCalledWith(false)
      expect(localStorage.getItem("user")).toContain("test@example.com")
    })
  })

  it("shows an alert if registration fails", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Failed to register")))

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to register")
    })
  })
})

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import Login from "../Login"
import { useAuth } from "../AuthContext"

vi.mock("../AuthContext")

describe("Login component", () => {
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
    render(<Login />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("updates state when typing into inputs", () => {
    render(<Login />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })

    expect(emailInput.value).toBe("test@example.com")
    expect(passwordInput.value).toBe("password123")
  })

  it("logs in a user with correct credentials", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "password123",
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([mockUser]),
      })
    )

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
      expect(mockSetIsAuthModalOpen).toHaveBeenCalledWith(false)
      expect(localStorage.getItem("user")).toContain("test@example.com")
    })
  })

  it("shows alert on invalid credentials", async () => {
    const mockUsers = [
      { id: 1, email: "test@example.com", password: "password123" },
    ]

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsers),
      })
    )

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(mockSetUser).not.toHaveBeenCalled()
      expect(mockSetIsAuthModalOpen).not.toHaveBeenCalled()
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials")
    })
  })
})

/*.
     current step(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- Add register.test.jsx, and once that's done, start studying the tests
            
            1. **Authentication utilities** (unit + integration)
            2. **Piano event handling** (unit + integration)
            3. **Song-player state transitions** (unit + integration)
            4. **One E2E happy-path** covering login → play → logout


         -- It's time for firebase integration!
         -- The app must be ready for a small test by a handful of users at this point(also a great excuse to test deployment with react and firebase). See how it goes =)
         -- Trying to fix the responsiveness issues for the paino gets too complicated on the dev server, it's better to revisit this issue after it's been deployed and is actually accessible on smaller devices
         -- I also think now (early post alpha release) is a great time to consider RSC and React 19 (stuff like server side components, ssr and form actions)
         -- If harmony hub succeeds in attracting users (or it becomes a safe bet for basing my software career), I'll look into the best way to gamify playing this piano. I'll come up with the best ways to incentivize users to play the piano, and have a blast as they're learning how music works
        - move on to the music player and real time note highlighting (once this feature has been added, Development on this project should stop. I have to shift
       my focus on to  Next.js, Typescript, An online shop that is the most sophisticated it can be in terms of looks and features. However its scale does have to
       be compatible with the fact that it's a portfolio project at the end of the day. Once ATP is ready with all the portfolio projects, I'll 
       come up with the best plan to divide my attention acroses these projects in such a way that  I can make some real dough, I keep evolving as a dev, and I'm doing
       what I love (a balance through the mixture of these three))
       - Joyful Speaking is next
 */

import { act, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, vi } from "vitest"
import { AuthProvider, useAuth } from "../AuthContext"

// Mock the fetchUserProfile function to simulate the user being fetched from an API
vi.mock("../../../utils/fetchUserProfile", () => ({
  fetchUserProfile: vi.fn().mockResolvedValue({
    name: "Amirali",
  }),
}))

function TestComponent() {
  const { user, isAuthModalOpen, setIsAuthModalOpen, handleLogout } = useAuth()
  return (
    <div>
      <div data-testid="user">{user ? user.name : "No user"}</div>
      <div data-testid="modal">{isAuthModalOpen ? "Open" : "Closed"}</div>
      <button onClick={() => setIsAuthModalOpen(true)}>Open Modal</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("initializes with no user if localStorage is empty", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId("user").textContent).toBe("No user")
  })

  it("initializes with user from localStorage if available", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 42, email: "test@example.com" })
    )

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("Amirali")
    })
  })

  it("can toggle the auth modal open", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => screen.getByText("Open Modal").click())
    expect(screen.getByTestId("modal").textContent).toBe("Open")
  })

  it("clears user from state and localStorage on logout", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Amirali" }))
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => screen.getByText("Logout").click())

    expect(screen.getByTestId("user").textContent).toBe("No user")
    expect(localStorage.getItem("user")).toBe(null)
  })
})

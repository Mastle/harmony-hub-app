import { act, render, screen } from "@testing-library/react"
import { beforeEach } from "vitest"
import { AuthProvider, useAuth } from "../AuthContext"

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

  it("initializes with user from localStorage if available", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Amirali" }))
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId("user").textContent).toBe("Amirali")
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


import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
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
    screen.getByText("Open Modal").click()
    expect(screen.getByTestId("modal").textContent).toBe("Open")
  })

  it("clears user from state and localStorage on logout", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Amirali" }))
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    screen.getByText("Logout").click()
    expect(screen.getByTestId("user").textContent).toBe("No user")
    expect(localStorage.getItem("user")).toBe(null)
  })
})

/* 
     current step(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- So, Vitest is the way to go for testing. first I'm gonna test it on a sample repo, then I have to figure out what test actually suits my current project and what its scale should be.
            ## Prioritizing What’s Essential
            
            1. **Authentication utilities** (unit + integration)
            2. **Piano event handling** (unit + integration)
            3. **Song-player state transitions** (unit + integration)
            4. **One E2E happy-path** covering login → play → logout

          -- Currently one test is passing, the other three are failing. Start with fixing those
          -- Use the conversation with GPT to for the next step
          -- Get Deepseek to check your tests to make sure they're as solid as they can be

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

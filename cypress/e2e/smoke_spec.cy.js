// cypress/e2e/smoke_spec.cy.js

describe("Harmony Hub MVP - Smoke Test", () => {
  it("logs in, plays a piano note, and logs out successfully", () => {
    cy.visit("/")

    // Open login modal
    cy.contains("Login").click()

    // Fill in login form
    cy.get('input[id="email"]').type("amir_dohezar@gmail.com") // adjust email
    cy.get('input[id="password"]').type("102030") // adjust password
    cy.get('button[type="submit"]').click()

    // Confirm login by checking for "Logout" button
    cy.contains("Logout", { timeout: 10000 }).should("exist")

    // Navigate to Piano page
    cy.contains("Instruments").click()
    cy.contains("Play Now").click()
    cy.contains("Click to start the piano").click()

    // Wait for Piano page to load
    cy.url().should("include", "/instruments/piano")

    cy.get("[data-testid='piano-key']").should("exist") // ensure keys are ready

    // Simulate playing a note (press a key)
    cy.get("body").type("q") // simulates pressing "q" key

    // (Optional) Add a small wait to simulate playing
    cy.wait(500)

    // Log out
    cy.contains("Logout").click()

    // Confirm logout
    cy.contains("Login").should("exist")
  })
})

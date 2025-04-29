import { supabase } from "./supaBaseClient.js"

async function registerUser(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    console.error("Error during sign up:", authError.message)
    return { success: false, error: authError }
  }

  const { user } = authData
  console.log("User registered successfully in auth:", user)


}

// Example usage:
const myEmail = "james_severino@gmail.com"
const myPassword = "123456"

registerUser(myEmail, myPassword)

/*.
      current steps(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- implementing backend:
           Ok so, for the backend we're gonna go with these tables:
                users --> current step: 
                The authentication system is working, but for some reason, I am not able to add that info to the user table? maybe the docs have a better of doing this
                piano_tracks 
                user_score (for the piano scores)
                
                And that's it for now

                --- connecting my app to the supabase database:
                  --- First I need to start with the authenticaton system
                  --- Then I'll connect the piano notes 
                  --- lastly, I'll connect the user score system to the database


         -- The next step is to add the tests to the CI workflow (continuous integration) routine 
         -- The app must be ready for a small test by a handful of users at this point(also a great excuse to test deployment with react and Supabase). See how it goes =)
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

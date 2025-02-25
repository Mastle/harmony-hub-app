"use client"

const HomePage = () => {
  return (
    <div className="mx-auto flex container justify-center items-center flex-col">
      <h1 className="text-center text-2xl font-bold p-5">
        Welcome to Harmony Hub!
      </h1>
      <p className="text-center">
        Your journey into music creation starts here. Play, experiment, and
        bring melodies to life with our virtual instruments. Whether you're a
        beginner or a seasoned musician, Harmony Hub lets you explore sounds
        effortlessly—right from your browser. Try out the piano, record your
        tunes, and let creativity flow! Ready to make some music?
      </p>
      <div>
        Ready to make some music?
        {/* [Start Playing] (CTA Button) -> this one directly leads the user to the piano, but there'll also be a separate section for instruments */}
      </div>
    </div>
  )
}
export default HomePage

/* 

    current step(short overview):
      - creating app routes and navigation links with react router
        --> Creat the homepage (use musicca as an example)
        -- re-adjust the navbar according to the routes of your app
        -- create the authentication layout and implement auth system properly
        -- need to set up the routes for virtual piano and music player properly
      - implement the piano fully
      - move on to music player and real time note highlighting
      - add as much as feature as you can till the end of ESFAND
      - Joyful Speaking is next


*/

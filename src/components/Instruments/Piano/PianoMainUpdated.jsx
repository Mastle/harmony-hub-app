// src/components/Instruments/Piano/PianoMain.jsx
import Piano from "./Piano"
import usePianoLogic from "./hooks/usePianoLogic"
import "../../../styles/pianoStyles.css"
// import { useAuth } from "../../Auth/AuthContext"

export default function PianoMain() {
  // const { user, setUser } = useAuth()

  const {
    audioReady,
    setAudioReady,
    activeNotes,
    showLabels,
    setShowLabels,
    songs,
    selectedId,
    setSelectedId,
    isGameActive,
    setIsGameActive,
    play,
    stop,
    showNotes,
    setShowNotes,
    target,
    setTarget,
    keysData,
    Tone,
    score,
    songRef,
  } = usePianoLogic()

  const initializeAudio = () => {
    Tone.start()
    setAudioReady(true)
    localStorage.setItem("audioReady", "true")
  }
  //current step: I created this to make sure target state not updating when a song game is the problem, and I was right. But I need to really think this through before settling on the final structure. The piano must have the best design possible, this is the heart and soul of my app.
  const beginSongGame = () => {
    setIsGameActive((prev) => !prev)
    setTarget(songRef.current[0])
  }

  return (
    <>
      <h1 className="text-4xl m-4 text-center font-bold pt-10">New Piano</h1>
      <div className="piano-container">
        {!audioReady && (
          <button onClick={initializeAudio} className="btn p-6">
            Start Piano
          </button>
        )}
        {audioReady && (
          <Piano
            keys={keysData}
            onPlay={play}
            onStop={stop}
            isActive={(note) => activeNotes.has(note)}
            isTarget={(note) => note === target}
            showLabels={showLabels}
          />
        )}
      </div>
      {/* Score and Controls */}
      <div className="text-center mb-8">
        <div className="text-2xl font-bold">Score: {score}</div>

        {/* Show/Hide Notes */}
        {showNotes && (
          <div className="my-4">
            {songs[selectedId]?.notes.map((n, i) => (
              <span key={i} className="mx-2 text-lg">
                {n.charAt(0)}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowNotes((prev) => !prev)}
          className="btn btn-info mt-2"
        >
          {showNotes ? "Hide Notes" : "Show Notes"}
        </button>

        {/* Song Selection and Game Controls */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={isGameActive}
            className="select select-bordered"
          >
            {Object.entries(songs).map(([id, song]) => (
              <option key={id} value={id}>
                {song.name}
              </option>
            ))}
          </select>

          <button
            onClick={beginSongGame}
            className={isGameActive ? "btn btn-warning" : "btn btn-success"}
          >
            {isGameActive ? "Stop Song Game" : "Start Song Game"}
          </button>

          <button
            onClick={() => setShowLabels((prev) => !prev)}
            className="btn btn-secondary"
          >
            {showLabels ? "Hide Key Labels" : "Show Key Labels"}
          </button>
        </div>
      </div>
    </>
  )
}

/* current step:
     
     -- Refactoring this piano became the most frustrating thing in all of this project. I'll understand better than anything else in this app, I'll make it work exactly the way I want. And then I'll move on
     -- I can't understand how the song game actually works, I need to start from the beginning. once I know how it works ,I can understand why it won't begin unless the first note
     of a song is pressed
     -- I'm having a hard time understanding the right order of operations for -> updating the user score state on game completion
      -> updating the user.score object in context 
      -> and finally updating the user.score in the database
      -- Must reorganize UI button placement for game controls and scores, I can at least make them more consistent


*/

/*.
      current steps(short overview):
    -> - Finishing the piano and preparing the app for an alpha launch
         -- implementing backend:
        -- refactoring the piano code -> start by fully understanding how the new code works, identify the problems, then start tackling each one
         in the end, compare the two pianos. Play a few notes on the previous one, make sure the new one works as intended and it sounds as good
                

         -- (make sure userprofile issue is solved beforehand) The next step is to add the tests to the CI workflow (continuous integration) routine 
         -- It's deployment time baby! make sure your tests won't get added to the bundle
         -- Trying to fix the responsiveness issues for the paino gets too complicated on the dev server, it's better to revisit this issue after it's been deployed and is actually accessible on smaller devices
         -- I also think now (early post alpha release) is a great time to consider RSC and React 19 (stuff like server side components, ssr and form actions)
         -- Must move on to JWTs if this app is ever to hit real production
         -- If harmony hub succeeds in attracting users (or it becomes a safe bet for basing my software career), I'll look into the best way to gamify playing this piano. I'll come up with the best ways to incentivize users to play the piano, and have a blast as they're learning how music works
         -- I have to add Docker to this thing once I've taken care of the previous steps. It's a necessity, it's great tech!
         -- When using Supabase for an app, when has to also consider a custom SMTP. They simply go hand in hand. I'll add this one after the others
         - move on to the music player and real time note highlighting (once this feature has been added, Development on this project should stop. I have to shift
       my focus on to  Next.js, Typescript, An online shop that is the most sophisticated it can be in terms of looks and features. However its scale does have to
       be compatible with the fact that it's a portfolio project at the end of the day. Once ATP is ready with all the portfolio projects, I'll 
       come up with the best plan to divide my attention acroses these projects in such a way that  I can make some real dough, I keep evolving as a dev, and I'm doing
       what I love (a balance through the mixture of these three))
       - Joyful Speaking is next
 */

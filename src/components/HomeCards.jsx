'use client'


const HomeCards = () => {
  return (
    <section className="container">
      <div className='container-xl lg:container m-auto'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg min-h-[400px] items-stretch'>

          <div className="p-6 rounded-lg shadow-md bg-accent">
            <h2 className='pacifico-regular text-5xl font-bold'>Instruments</h2>
            <p className='mt-2 mb-4'>
              Browse our React jobs and start your career today
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md bg-accent">
            <h2 className='text-5xl font-bold pacifico-regular'>music player</h2>
            <p className='mt-2 mb-4'>
              List your job to find the perfect developer for the role
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HomeCards

/* 
    current step(short overview):
      - try shadcn -> currently installed "@types/node", gotta look into how to exactly set this thing up because it's complicated -_-
      - compare it to Brad's cards
      - style and finalize y our choice
      - add react router and hook up the "intstruments" and "music player" routes 
      - implement the piano fully
      - move on to music player and real time note highlighting
      - add as much as feature as you can till the end of ESFAND
      - Joyful Speaking is next

      
*/
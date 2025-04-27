import { supabase } from "./supabaseClient.js"

async function fetchSongs() {
  const { data, error } = await supabase.from("songs").select("song_title")

  if (error) {
    console.error("Error fetching songs:", error)
  } else {
    console.log("Fetched songs:", data)
  }
}

async function addSong(songData) {
  const { data, error } = await supabase
    .from("songs")
    .insert([songData])
    .select()

  if (error) {
    console.error("Error adding song:", error)
  } else {
    console.log("Added song:", data)
  }
}

// Sample song data
const song = {
  song_title: "Kendrick Lamar - Humble",
}

// addSong(song)

fetchSongs()

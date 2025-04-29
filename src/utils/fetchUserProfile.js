// utils/fetchUserProfile.js (create this helper file)
import { supabase } from "../supaBaseClient"

export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, score, email")
    .eq("id", userId)
    .single()

  if (error) {
    // Let caller decide how to handle missing profile
    throw new Error(`Profile fetch error: ${error.message}`)
  }

  return { id: userId, name: data.username, score: data.score }
}

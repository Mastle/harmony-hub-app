import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ifynwlxlgpryvgdsmbbf.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmeW53bHhsZ3ByeXZnZHNtYmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NDk2NzYsImV4cCI6MjA2MTMyNTY3Nn0.ohZEgRWfv0E-SAjj3ssqAnQXW4tzTl0Y_W6ipaWjBzc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

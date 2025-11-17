import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using authentication yet
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Limit real-time events for performance
    },
  },
})

// Export a helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('patients').select('count', { count: 'exact', head: true })
    if (error) throw error
    return { connected: true, error: null }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { connected: false, error: error.message }
  }
}

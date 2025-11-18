import { supabase } from './supabaseClient'

/**
 * Authentication Service
 * Handles all authentication operations with Supabase Auth
 */

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Sign in exception:', error)
    return { data: null, error }
  }
}

/**
 * Sign out current user
 * @returns {Promise<{error: Error|null}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign out error:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Sign out exception:', error)
    return { error }
  }
}

/**
 * Get current user session
 * @returns {Promise<{session: Object|null, error: Error|null}>}
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Get session error:', error)
      return { session: null, error }
    }

    return { session, error: null }
  } catch (error) {
    console.error('Get session exception:', error)
    return { session: null, error }
  }
}

/**
 * Get current user
 * @returns {Promise<{user: Object|null, error: Error|null}>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Get user exception:', error)
    return { user: null, error }
  }
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Object} Subscription object
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

export const authService = {
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  onAuthStateChange,
}

export default authService

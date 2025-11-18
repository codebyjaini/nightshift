import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
// @ts-ignore - JS module without types
import { signIn } from '../services/authService'
// @ts-ignore - JSX component without types
import Button from '../components/ui/Button'
// @ts-ignore - JSX component without types
import Input from '../components/ui/Input'
// @ts-ignore - JSX component without types
import ErrorMessage from '../components/ui/ErrorMessage'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('🔐 Attempting login with:', { email, passwordLength: password.length })

    try {
      const { data, error: signInError } = await signIn(email, password)

      console.log('🔐 Login response:', { 
        hasData: !!data, 
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: signInError 
      })

      if (signInError) {
        console.error('🔐 Sign in error:', signInError)
        setError(signInError.message || 'Failed to sign in')
        setLoading(false)
        return
      }

      if (data?.session) {
        console.log('🔐 Login successful! Redirecting to dashboard...')
        // Successfully signed in, redirect to dashboard
        navigate('/doctor/dashboard')
      } else {
        console.error('🔐 No session returned after login')
        setError('Login failed - no session created')
        setLoading(false)
      }
    } catch (err) {
      console.error('🔐 Login exception:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            NightShift MD
          </h1>
          <p className="text-text-secondary">Doctor Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-primary-card rounded-2xl p-8 border border-primary-border shadow-card backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(value: string | number) => setEmail(String(value))}
                placeholder="doctor@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-secondary mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(value: string | number) => setPassword(String(value))}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-text-muted">
            <p>Secure login powered by Supabase Auth</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-accent-cyan hover:text-accent-teal transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

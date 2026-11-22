'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser, loginUser } from '../actions'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function validate() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    return true
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await loginUser(email, password)
    setLoading(false)
    if (!result.ok) { setError(result.message); return }
    if (result.token) localStorage.setItem('token', result.token)
    if (result.userId) localStorage.setItem('userId', String(result.userId))
    if (result.userId) document.cookie = `userId=${result.userId}; path=/`
    document.cookie = `loggedIn=true; path=/`
    document.cookie = `userEmail=${encodeURIComponent(email)}; path=/`
    router.push('/')
    router.refresh()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await registerUser(email, password)
    setLoading(false)
    if (!result.ok) { setError(result.message); return }
    document.cookie = `loggedIn=true; path=/`
    document.cookie = `userEmail=${encodeURIComponent(email)}; path=/`
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex items-center justify-center">
      <div className="max-w-md w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {mode === 'login' ? 'Log In' : 'Register'}
          </h1>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {mode === 'login' ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Password must be at least 6 characters.</p>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setMode('register'); setError('') }} className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">Register</button>
              </p>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Password must be at least 6 characters.</p>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">{showConfirm ? 'Hide' : 'Show'}</button>
              </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? 'Registering...' : 'Register'}
              </button>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError('') }} className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">Log In</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

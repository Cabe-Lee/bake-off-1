'use client'

import { useState } from 'react'
import { testSupabase } from './actions'

export default function TestSupabaseButton() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const result = await testSupabase()
    setStatus(result.ok ? `✅ ${result.message}` : `❌ ${result.message}`)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Supabase Connection'}
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  )
}

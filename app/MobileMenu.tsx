'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<boolean>(false)
  useEffect(() => {
    const update = () => setUser(!!localStorage.getItem('token'))
    queueMicrotask(update)
    window.addEventListener('storage', update)
    return () => window.removeEventListener('storage', update)
  }, [])
  const links = [
    { href: '/', label: 'Home' },
    { href: '/campaigns', label: 'Campaigns' },
    user ? { href: '/dashboard', label: 'Profile' } : { href: '/login', label: 'Login' },
  ]
  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
        ☰
      </button>
      {open && (
        <div className="absolute top-16 right-0 bg-zinc-50 dark:bg-zinc-900 border-b border-l border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3 items-end min-w-[160px]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

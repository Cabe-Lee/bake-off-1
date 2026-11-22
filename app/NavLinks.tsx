'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NavLinks() {
  const router = useRouter()
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
    user ? { href: '#', label: 'Logout' } : { href: '/login', label: 'Login' },
  ]
  function logout() {
    localStorage.removeItem('token')
    document.cookie = 'loggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setUser(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="hidden md:flex items-center gap-6">
      {links.map((link) => (
        link.label === 'Logout' ? (
          <button key={link.label} onClick={logout} className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            {link.label}
          </button>
        ) : (
          <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            {link.label}
          </Link>
        )
      ))}
    </div>
  )
}

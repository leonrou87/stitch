'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV: [string, string][] = [
  ['Curated trips', '/trips'],
  ['Build your own', '/build'],
  ['Destinations', '/guide'],
  ['My trips', '/me/trips'],
  ['How it works', '/about'],
  ['Help', '/help'],
]

// Hamburger menu for small screens — reaches everything the desktop nav hides.
export function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-full border border-paper-edge bg-paper-card text-ink-soft"
      >
        <span aria-hidden className="text-lg leading-none">{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <>
          <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 top-16 z-30 bg-ink/20" />
          <nav className="fixed inset-x-0 top-16 z-40 border-b border-paper-edge bg-paper px-5 py-4">
            <ul className="flex flex-col gap-1">
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-base text-ink-soft hover:bg-paper-card">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}

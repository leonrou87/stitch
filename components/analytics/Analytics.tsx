'use client'

import { useEffect } from 'react'

// Loads Plausible (cookieless) when a domain is configured and the visitor hasn't declined.
// Renders nothing; injects the script once.
const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export function Analytics() {
  useEffect(() => {
    if (!domain) return
    if (localStorage.getItem('stitch:consent') === 'declined') return
    if (document.getElementById('plausible-js')) return
    const s = document.createElement('script')
    s.id = 'plausible-js'
    s.defer = true
    s.setAttribute('data-domain', domain)
    s.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(s)
  }, [])
  return null
}

'use client'

import { useEffect } from 'react'
import { UserAuth } from './context/AuthContext'
import Main from './components/Main'

export default function Home() {
  const { user } = UserAuth()

  // UIDs de admin desde variables de entorno
  const adminUIDs = [
    process.env.NEXT_PUBLIC_ADMIN_UID_1,
    process.env.NEXT_PUBLIC_ADMIN_UID_2,
  ]

  useEffect(() => {
    if (user && adminUIDs.includes(user.uid)) {
      window.location.href = '/panelAdmin'
    }
  }, [user])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 azulejos p-6">
        <Main />
      </main>
    </div>
  )
}

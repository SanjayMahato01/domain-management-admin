"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function LoadingBar() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"
        style={{
          animation: "loading-bar 0.3s ease-out forwards",
        }}
      />
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0% }
          100% { width: 100% }
        }
      `}</style>
    </div>
  )
}

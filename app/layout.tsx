import type React from "react"
import type { Metadata } from "next"

import { LoadingBar } from "@/components/loading-bar"
import { Suspense } from "react"

import "./globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Admin",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <LoadingBar />
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}

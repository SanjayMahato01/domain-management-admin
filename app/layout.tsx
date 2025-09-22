import type React from "react"
import type { Metadata } from "next"

import { LoadingBar } from "@/components/loading-bar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
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
        </Suspense>
      </body>
    </html>
  )
}

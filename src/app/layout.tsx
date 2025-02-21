import type { Metadata } from "next"
import { Providers } from "./components/providers"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { Navigation } from "@/components/Navigation"
import { Toaster } from "sonner"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Financial Advisor",
  description: "Get personalized financial advice from our AI advisor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Navigation />
            <div className="min-h-screen">{children}</div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

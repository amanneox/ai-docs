"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Sidebar } from "./_components/sidebar"
import { Navbar } from "./_components/navbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (!isLoaded) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar 
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

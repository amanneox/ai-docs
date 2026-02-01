"use client"

import { useParams } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isSidebarOpen: boolean
  onMenuClick: () => void
}

export function Navbar({ isSidebarOpen, onMenuClick }: NavbarProps) {
  const params = useParams()
  const documentId = params.documentId as string | undefined

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  )
}

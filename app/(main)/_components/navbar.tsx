"use client"

import { useParams } from "next/navigation"
import { Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isSidebarOpen: boolean
  onMenuClick: () => void
}

export function Navbar({ isSidebarOpen, onMenuClick }: NavbarProps) {
  const params = useParams()
  const documentId = params.documentId as string | undefined

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick} 
            className="shrink-0 h-9 w-9 rounded-xl hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5 relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
        </Button>
      </div>
    </header>
  )
}

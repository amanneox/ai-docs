"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { 
  Plus, 
  Search, 
  Settings, 
  Trash, 
  ChevronRight, 
  ChevronDown,
  FileText,
  Folder,
  MoreHorizontal,
  LogOut
} from "lucide-react"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DocumentItem } from "./document-item"
import { useDocuments } from "@/hooks/use-documents"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useUser()
  const pathname = usePathname()
  const { documents, createDocument, isLoading } = useDocuments()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateDocument = () => {
    createDocument({
      title: "Untitled",
      content: "",
      parentId: null,
    })
  }

  if (!isOpen) {
    return (
      <div className="w-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-4 left-4 z-50"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <aside className="w-72 h-full bg-sidebar flex flex-col border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AI Docs</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronDown className="h-5 w-5 rotate-90" />
          </Button>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">
                  {user?.fullName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SignOutButton>
                <button className="w-full flex items-center text-left">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* New Document Button */}
      <div className="px-4 py-2">
        <Button 
          className="w-full justify-start gap-2"
          onClick={handleCreateDocument}
        >
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </div>

      {/* Document Tree */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {isLoading ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No documents found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredDocuments.map((doc) => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc}
                  active={pathname === `/documents/${doc.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Storage: 25%</span>
          <span>Free Plan</span>
        </div>
      </div>
    </aside>
  )
}

"use client"

import { useState, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Search, Settings, ChevronRight, ChevronDown, FileText, LogOut, Sparkles } from "lucide-react"
import { useUser, SignOutButton } from "@clerk/nextjs"
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

function SidebarComponent({ isOpen, onToggle }: SidebarProps) {
  const { user } = useUser()
  const pathname = usePathname()
  const { documents, createDocument, deleteDocument, isLoading } = useDocuments()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = useMemo(() => 
    documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [documents, searchQuery]
  )

  const handleCreateDocument = useCallback(() => {
    createDocument({ title: "Untitled", content: "", parentId: null })
  }, [createDocument])

  const handleCreateChild = useCallback((parentId: string) => {
    createDocument({ title: "Untitled", content: "", parentId })
  }, [createDocument])

  const handleDelete = useCallback((id: string) => {
    deleteDocument(id)
  }, [deleteDocument])

  if (!isOpen) {
    return (
      <div className="w-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm border border-border hover:bg-white/5"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <aside className="w-72 h-full bg-sidebar flex flex-col border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Link href="/documents" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AI Docs</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0 hover:bg-white/5">
            <ChevronDown className="h-5 w-5 rotate-90" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2.5 px-3 hover:bg-white/5 rounded-xl">
              <Avatar className="h-8 w-8 ring-2 ring-border">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-sm">
                  {user?.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
                </p>
                <p className="text-xs text-emerald-500/80">Free Plan</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-card border-border">
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <SignOutButton>
              <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
          <Input
            placeholder="Search documents..."
            className="pl-9 h-10 bg-secondary/50 border-border focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* New Document Button */}
      <div className="px-4 pb-3">
        <Button 
          className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all rounded-xl h-10"
          onClick={handleCreateDocument}
        >
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </div>

      {/* Document Tree */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2 space-y-0.5">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
              Loading...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No documents found" : "No documents yet"}
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <DocumentItem 
                key={doc.id} 
                document={doc}
                active={pathname === `/documents/${doc.id}`}
                onCreateChild={handleCreateChild}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Storage</span>
          <span className="text-emerald-500">25% used</span>
        </div>
        <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-1/4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
        </div>
      </div>
    </aside>
  )
}

export const Sidebar = memo(SidebarComponent)

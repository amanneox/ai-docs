"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Trash2, 
  Sparkles,
  Share2,
  Clock,
  CheckCircle2,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDocument } from "@/hooks/use-document"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DocumentHeaderProps {
  documentId: string
  onAIToggle: () => void
  isAIOpen: boolean
}

export function DocumentHeader({ documentId, onAIToggle, isAIOpen }: DocumentHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { document, updateDocument, deleteDocument } = useDocument(documentId)
  const [title, setTitle] = useState("Untitled")
  const [isDeleting, setIsDeleting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (document?.title) {
      setTitle(document.title)
    }
  }, [document?.title])

  useEffect(() => {
    const handleSaveStart = () => {
      if (mountedRef.current) setIsSaving(true)
    }
    const handleSaveEnd = () => {
      if (mountedRef.current) {
        setIsSaving(false)
        setLastSaved(new Date())
      }
    }

    window.addEventListener("document-save-start" as any, handleSaveStart)
    window.addEventListener("document-save-end" as any, handleSaveEnd)

    return () => {
      window.removeEventListener("document-save-start" as any, handleSaveStart)
      window.removeEventListener("document-save-end" as any, handleSaveEnd)
    }
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (title !== document?.title) {
      updateDocument({ title: title || "Untitled" })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleTitleBlur()
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteDocument(documentId)
      toast({
        title: "Document deleted",
        description: "The document has been moved to trash",
      })
      router.push("/documents")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-5 bg-card/50 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <Link href="/documents">
          <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 rounded-xl hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <div className="flex flex-col min-w-0 flex-1 max-w-md">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Untitled"
            className="font-semibold text-lg bg-transparent border-none outline-none placeholder:text-muted-foreground/50 truncate focus:ring-0 p-0 h-auto text-foreground"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Saved
              </span>
            ) : (
              <span>Draft</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isAIOpen ? "default" : "ghost"}
          size="sm"
          onClick={onAIToggle}
          className={cn(
            "gap-2 transition-all rounded-xl h-9",
            isAIOpen 
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40" 
              : "hover:bg-white/5"
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assist</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
          <Users className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
          <Share2 className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem 
              onClick={handleDelete} 
              disabled={isDeleting} 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete document"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

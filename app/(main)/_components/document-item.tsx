"use client"

import Link from "next/link"
import { memo, useState, useCallback } from "react"
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Plus,
  MoreHorizontal,
  Trash,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Document } from "@/types"

interface DocumentItemProps {
  document: Document
  level?: number
  active?: boolean
  onCreateChild?: (parentId: string) => void
  onDelete?: (id: string) => void
}

export const DocumentItem = memo(function DocumentItemComponent({ 
  document, 
  level = 0, 
  active, 
  onCreateChild, 
  onDelete 
}: DocumentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = document.children && document.children.length > 0

  const handleCreateChild = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onCreateChild?.(document.id)
  }, [document.id, onCreateChild])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.(document.id)
  }, [document.id, onDelete])

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <div>
      <Link
        href={`/documents/${document.id}`}
        className={cn(
          "flex items-center gap-2 px-2 py-2 rounded-lg text-sm group transition-colors",
          active
            ? "bg-emerald-500/15 text-emerald-400 font-medium"
            : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-5 w-5 p-0 transition-opacity",
            hasChildren ? "opacity-60 group-hover:opacity-100" : "opacity-0"
          )}
          onClick={toggleExpand}
        >
          {hasChildren && (
            isExpanded ?
              <ChevronDown className="h-3.5 w-3.5" /> :
              <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>

        <div className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
          active ? "bg-emerald-500/20" : "bg-secondary"
        )}>
          <FileText className={cn(
            "h-3 w-3",
            active ? "text-emerald-400" : "text-muted-foreground"
          )} />
        </div>

        <span className="flex-1 truncate">{document.title || "Untitled"}</span>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onCreateChild && (
                <DropdownMenuItem onClick={handleCreateChild}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add subpage
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Edit3 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem onClick={handleDelete} className="text-red-400">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>

      {hasChildren && isExpanded && (
        <div className="mt-0.5 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          {document.children!.map((child) => (
            <DocumentItem
              key={child.id}
              document={child}
              level={level + 1}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
})

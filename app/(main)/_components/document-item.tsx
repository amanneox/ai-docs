"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Plus, 
  MoreHorizontal,
  Trash,
  Edit3
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
import { useDocuments } from "@/hooks/use-documents"

interface DocumentItemProps {
  document: Document
  level?: number
  active?: boolean
}

export function DocumentItem({ document, level = 0, active }: DocumentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { createDocument, deleteDocument } = useDocuments()
  const hasChildren = document.children && document.children.length > 0

  const handleCreateChild = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    createDocument({
      title: "Untitled",
      content: "",
      parentId: document.id,
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteDocument(document.id)
  }

  return (
    <div>
      <Link
        href={`/documents/${document.id}`}
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md text-sm group transition-colors",
          active 
            ? "bg-primary/10 text-primary font-medium" 
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }}
        >
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="h-3 w-3" /> : 
              <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 truncate">{document.title || "Untitled"}</span>
        
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCreateChild}>
                <Plus className="h-4 w-4 mr-2" />
                Add subpage
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit3 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>

      {/* Render children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {document.children!.map((child) => (
            <DocumentItem
              key={child.id}
              document={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

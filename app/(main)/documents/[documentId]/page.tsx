"use client"

import { useParams } from "next/navigation"
import { useState, useCallback, memo } from "react"
import dynamic from "next/dynamic"
import { DocumentHeader } from "@/components/editor/document-header"
import { Room } from "@/components/collaboration/room"
import { useDocument } from "@/hooks/use-document"
import { cn } from "@/lib/utils"
import { Loader2, FileText } from "lucide-react"

const Editor = dynamic(() => import("@/components/editor/editor").then(mod => ({ default: mod.Editor })), {
  loading: () => <EditorSkeleton />,
  ssr: false
})

const AIAssistant = dynamic(() => import("@/components/editor/ai-assistant").then(mod => ({ default: mod.AIAssistant })), {
  ssr: false
})

const EditorSkeleton = memo(() => (
  <div className="space-y-5 py-6">
    <div className="flex items-center gap-3 mb-4">
      <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
      <span className="text-muted-foreground">Loading editor...</span>
    </div>
    <div className="h-14 w-3/4 bg-card rounded animate-pulse" />
    <div className="h-4 w-full bg-card rounded animate-pulse" />
    <div className="h-4 w-2/3 bg-card rounded animate-pulse" />
  </div>
))
EditorSkeleton.displayName = "EditorSkeleton"

const DocumentLoading = memo(() => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
        <FileText className="h-8 w-8 text-emerald-400 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
        <span className="text-muted-foreground">Loading document...</span>
      </div>
    </div>
  </div>
))
DocumentLoading.displayName = "DocumentLoading"

const DocumentNotFound = memo(() => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
        <FileText className="h-8 w-8 text-red-400" />
      </div>
      <h2 className="text-xl font-semibold">Document not found</h2>
      <p className="text-muted-foreground max-w-md">
        This document may have been deleted or you don&apos;t have access to it.
      </p>
    </div>
  </div>
))
DocumentNotFound.displayName = "DocumentNotFound"

export default function DocumentPage() {
  const params = useParams()
  const documentId = params.documentId as string
  const { document, isLoading, isNotFound } = useDocument(documentId)
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")

  const handleTextSelect = useCallback((text: string) => {
    setSelectedText(text)
  }, [])

  const toggleAI = useCallback(() => {
    setIsAISidebarOpen(prev => !prev)
  }, [])

  const closeAI = useCallback(() => {
    setIsAISidebarOpen(false)
  }, [])

  if (isLoading) {
    return <DocumentLoading />
  }

  if (isNotFound) {
    return <DocumentNotFound />
  }

  return (
    <Room roomId={`document-${documentId}`}>
      <div className="h-full flex flex-col bg-background">
        <DocumentHeader
          documentId={documentId}
          onAIToggle={toggleAI}
          isAIOpen={isAISidebarOpen}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className={cn(
            "flex-1 overflow-y-auto transition-[padding] duration-200",
            isAISidebarOpen ? "pr-80" : "pr-0"
          )}>
            <div className="max-w-4xl mx-auto px-8 py-8">
              <Editor
                documentId={documentId}
                onTextSelect={handleTextSelect}
              />
            </div>
          </div>

          <AIAssistant
            documentId={documentId}
            isOpen={isAISidebarOpen}
            onClose={closeAI}
            selectedText={selectedText}
          />
        </div>
      </div>
    </Room>
  )
}

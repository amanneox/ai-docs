"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Editor } from "@/components/editor/editor"
import { AIAssistant } from "@/components/editor/ai-assistant"
import { DocumentHeader } from "@/components/editor/document-header"
import { cn } from "@/lib/utils"

export default function DocumentPage() {
  const params = useParams()
  const documentId = params.documentId as string
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <DocumentHeader 
        documentId={documentId} 
        onAIToggle={() => setIsAISidebarOpen(!isAISidebarOpen)}
        isAIOpen={isAISidebarOpen}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          isAISidebarOpen ? "mr-80" : "mr-0"
        )}>
          <div className="max-w-4xl mx-auto px-8 py-8">
            <Editor 
              documentId={documentId} 
              onTextSelect={setSelectedText}
            />
          </div>
        </div>

        {/* AI Sidebar */}
        <AIAssistant 
          documentId={documentId}
          isOpen={isAISidebarOpen}
          onClose={() => setIsAISidebarOpen(false)}
          selectedText={selectedText}
        />
      </div>
    </div>
  )
}

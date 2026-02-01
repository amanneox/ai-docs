"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import { useDebouncedCallback } from "use-debounce"
import { useDocument } from "@/hooks/use-document"
import { Skeleton } from "@/components/ui/skeleton"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface EditorProps {
  documentId: string
  onTextSelect: (text: string) => void
}

export function Editor({ documentId, onTextSelect }: EditorProps) {
  const { document: docData, updateDocument, isLoading } = useDocument(documentId)
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isLoading && docData) {
      if (docData.content) {
        try {
          const parsed = JSON.parse(docData.content)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInitialContent(parsed)
          }
        } catch (e) {
          console.log("No valid initial content, using default")
        }
      }
      setIsReady(true)
    }
  }, [docData, isLoading])

  const getDefaultContent = (): PartialBlock[] => [
    {
      type: "paragraph",
      content: "",
    },
  ]

  const editor = useCreateBlockNote({
    initialContent: initialContent || getDefaultContent(),
  })

  useEffect(() => {
    if (!editor) return

    const handleSelectionChange = () => {
      try {
        const selection = window.getSelection()
        if (selection && selection.toString().trim()) {
          onTextSelect(selection.toString())
        } else {
          onTextSelect("")
        }
      } catch (e) {
        onTextSelect("")
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [editor, onTextSelect])

  useEffect(() => {
    const handleInsertAIContent = (event: CustomEvent<string>) => {
      if (!editor) return
      
      const content = event.detail
      
      try {
        const currentBlock = editor.getTextCursorPosition().block
        
        const lines = content.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) return
        
        editor.insertBlocks(
          [{ type: "paragraph", content: lines[0] }],
          currentBlock,
          "after"
        )
        
        let lastBlock = currentBlock
        for (let i = 1; i < lines.length; i++) {
          const newBlocks = editor.insertBlocks(
            [{ type: "paragraph", content: lines[i] }],
            lastBlock,
            "after"
          )
          if (newBlocks.length > 0) {
            lastBlock = newBlocks[0]
          }
        }
      } catch (error) {
        try {
          editor.insertBlocks(
            [{ type: "paragraph", content: content }],
            editor.getTextCursorPosition().block,
            "after"
          )
        } catch (e) {
          console.error("Failed to insert content:", e)
        }
      }
    }

    window.addEventListener("insert-ai-content" as any, handleInsertAIContent)
    return () => {
      window.removeEventListener("insert-ai-content" as any, handleInsertAIContent)
    }
  }, [editor])

  const saveToServer = useDebouncedCallback(async () => {
    if (!editor) return
    
    window.dispatchEvent(new CustomEvent("document-save-start"))
    
    const blocks = editor.document
    try {
      await updateDocument({ content: JSON.stringify(blocks) })
      window.dispatchEvent(new CustomEvent("document-save-end"))
    } catch (error) {
      console.error("Failed to save document:", error)
      window.dispatchEvent(new CustomEvent("document-save-end"))
    }
  }, 2000)

  useEffect(() => {
    if (!editor) return

    const unsubscribe = editor.onChange(() => {
      saveToServer()
    })

    return () => {
      unsubscribe()
    }
  }, [editor, saveToServer])

  if (!isReady || isLoading) {
    return <EditorSkeleton />
  }

  return (
    <div className="editor-content">
      <BlockNoteView 
        editor={editor} 
        theme="light"
        className="[&_.bn-container]:max-w-none [&_.bn-editor]:px-0 [&_.bn-editor]:py-0 min-h-[calc(100vh-200px)]"
      />
    </div>
  )
}

function EditorSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

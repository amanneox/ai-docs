"use client"

import { useEffect, useState, useCallback, useRef, memo } from "react"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import { useDebouncedCallback } from "use-debounce"
import { useDocument } from "@/hooks/use-document"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface EditorProps {
  documentId: string
  onTextSelect: (text: string) => void
}

const EditorView = memo(({ editor }: { editor: BlockNoteEditor }) => (
  <BlockNoteView
    editor={editor}
    theme="dark"
    className="[&_.bn-container]:max-w-none [&_.bn-editor]:px-0 [&_.bn-editor]:py-0 min-h-[calc(100vh-200px)]"
  />
))
EditorView.displayName = "EditorView"

export function Editor({ documentId, onTextSelect }: EditorProps) {
  const { document: docData, updateDocument, isLoading } = useDocument(documentId)
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
  const [isReady, setIsReady] = useState(false)
  const editorRef = useRef<BlockNoteEditor | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (isInitializedRef.current) return
    if (isLoading) return

    isInitializedRef.current = true

    if (docData?.content) {
      try {
        const parsed = JSON.parse(docData.content)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInitialContent(parsed)
        }
      } catch {
        // Use default content
      }
    }

    setIsReady(true)
  }, [docData, isLoading])

  useEffect(() => {
    if (isReady) return

    const timeout = setTimeout(() => {
      if (!isReady) {
        console.warn("Editor init timeout - proceeding with default content")
        isInitializedRef.current = true
        setIsReady(true)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [isReady])

  const editor = useCreateBlockNote({
    initialContent: initialContent || getDefaultContent(),
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  const debouncedSelectionChange = useDebouncedCallback(() => {
    try {
      const selection = window.getSelection()
      const text = selection?.toString().trim() || ""
      onTextSelect(text)
    } catch {
      onTextSelect("")
    }
  }, 300)

  useEffect(() => {
    document.addEventListener("selectionchange", debouncedSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", debouncedSelectionChange)
      debouncedSelectionChange.cancel()
    }
  }, [debouncedSelectionChange])

  useEffect(() => {
    const handleInsertAIContent = (event: CustomEvent<string>) => {
      const currentEditor = editorRef.current
      if (!currentEditor) return

      const content = event.detail
      const lines = content.split('\n').filter(line => line.trim())
      if (lines.length === 0) return

      try {
        const currentBlock = currentEditor.getTextCursorPosition().block
        const blocks = lines.map(line => ({ type: "paragraph" as const, content: line }))
        currentEditor.insertBlocks(blocks, currentBlock, "after")
      } catch (error) {
        console.error("Failed to insert content:", error)
      }
    }

    window.addEventListener("insert-ai-content" as any, handleInsertAIContent)
    return () => window.removeEventListener("insert-ai-content" as any, handleInsertAIContent)
  }, [])

  const saveToServer = useDebouncedCallback(async () => {
    const currentEditor = editorRef.current
    if (!currentEditor) return

    window.dispatchEvent(new CustomEvent("document-save-start"))

    try {
      const blocks = currentEditor.document
      await updateDocument({ content: JSON.stringify(blocks) })
      window.dispatchEvent(new CustomEvent("document-save-end"))
    } catch (error) {
      console.error("Failed to save document:", error)
      window.dispatchEvent(new CustomEvent("document-save-end"))
    }
  }, 1500)

  useEffect(() => {
    if (!editor) return
    const unsubscribe = editor.onChange(() => saveToServer())
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [editor, saveToServer])

  if (!isReady || isLoading) {
    return <EditorSkeleton />
  }

  return (
    <div className="editor-content">
      <EditorView editor={editor} />
    </div>
  )
}

function getDefaultContent(): PartialBlock[] {
  return [{ type: "paragraph", content: "" }]
}

function EditorSkeleton() {
  return (
    <div className="space-y-5 py-6">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
        <span className="text-sm text-muted-foreground">Loading editor...</span>
      </div>
      <Skeleton className="h-14 w-3/4 bg-card" />
      <Skeleton className="h-4 w-full bg-card" />
      <Skeleton className="h-4 w-full bg-card" />
      <Skeleton className="h-4 w-2/3 bg-card" />
      <div className="h-32 w-full bg-card rounded-xl border border-border animate-pulse" />
      <Skeleton className="h-4 w-full bg-card" />
      <Skeleton className="h-4 w-5/6 bg-card" />
    </div>
  )
}

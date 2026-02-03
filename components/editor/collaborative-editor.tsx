"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSelf } from "@liveblocks/react"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import { useDebouncedCallback } from "use-debounce"
import * as Y from "yjs"
import { LiveblocksYjsProvider } from "@liveblocks/yjs"
import { useRoom } from "@/components/collaboration/room"
import { Skeleton } from "@/components/ui/skeleton"
import { useDocument } from "@/hooks/use-document"
import { Loader2, AlertCircle } from "lucide-react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

const SYNC_TIMEOUT_MS = 8000

interface CollaborativeEditorProps {
  documentId: string
}

export function CollaborativeEditor({ documentId }: CollaborativeEditorProps) {
  const room = useRoom()
  const { document: docData } = useDocument(documentId)
  const [doc, setDoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
  const mountedRef = useRef(true)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
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
  }, [docData])

  useEffect(() => {
    if (!room || hasInitializedRef.current) return
    hasInitializedRef.current = true

    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)

    setDoc(yDoc)
    setProvider(yProvider)
    setSyncError(null)

    const handleSync = () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
      if (mountedRef.current) {
        setIsReady(true)
      }
    }

    syncTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !isReady) {
        console.warn("Liveblocks sync timeout, proceeding anyway")
        setIsReady(true)
      }
    }, SYNC_TIMEOUT_MS)

    yProvider.on("sync", handleSync)

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
      yProvider.off("sync", handleSync)
      yDoc.destroy()
      yProvider.destroy()
      hasInitializedRef.current = false
    }
  }, [room])

  if (syncError) {
    return <EditorError message={syncError} />
  }

  if (!doc || !provider) {
    return <EditorSkeleton />
  }

  return (
    <EditorComponent
      doc={doc}
      provider={provider}
      documentId={documentId}
      initialContent={initialContent}
      isReady={isReady}
    />
  )
}

interface EditorComponentProps {
  doc: Y.Doc
  provider: LiveblocksYjsProvider
  documentId: string
  initialContent?: PartialBlock[]
  isReady: boolean
}

function EditorComponent({ doc, provider, documentId, initialContent, isReady }: EditorComponentProps) {
  const self = useSelf()
  const userInfo = self?.info
  const { updateDocument } = useDocument(documentId)
  const mountedRef = useRef(true)
  const editorRef = useRef<BlockNoteEditor | null>(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const getDefaultContent = useCallback((): PartialBlock[] => [
    {
      type: "paragraph",
      content: "",
    },
  ], [])

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name || "Anonymous",
        color: getRandomColor(String(userInfo?.id || "anonymous")),
      },
    },
    initialContent: initialContent || getDefaultContent(),
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    const handleInsertAIContent = (event: CustomEvent<string>) => {
      const currentEditor = editorRef.current
      if (!currentEditor) return

      const content = event.detail

      try {
        const currentBlock = currentEditor.getTextCursorPosition().block
        currentEditor.insertBlocks(
          [{ type: "paragraph", content: content }],
          currentBlock,
          "after"
        )
      } catch (error) {
        console.error("Failed to insert content:", error)
      }
    }

    window.addEventListener("insert-ai-content" as any, handleInsertAIContent)
    return () => {
      window.removeEventListener("insert-ai-content" as any, handleInsertAIContent)
    }
  }, [])

  const saveToServer = useDebouncedCallback(async () => {
    const currentEditor = editorRef.current
    if (!currentEditor || !mountedRef.current) return

    const blocks = currentEditor.document
    try {
      await updateDocument({ content: JSON.stringify(blocks) })
    } catch (error) {
      console.error("Failed to save document:", error)
    }
  }, 2000)

  useEffect(() => {
    if (!editor) return

    const unsubscribe = editor.onChange(() => {
      saveToServer()
    })

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [editor, saveToServer])

  if (!isReady) {
    return <EditorSkeleton />
  }

  return (
    <div className="editor-content">
      <BlockNoteView
        editor={editor}
        theme="dark"
        className="[&_.bn-container]:max-w-none [&_.bn-editor]:px-0 [&_.bn-editor]:py-0 min-h-[500px]"
      />
    </div>
  )
}

function EditorSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
        <span className="text-sm text-muted-foreground">Connecting to collaboration server...</span>
      </div>
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

function EditorError({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-muted-foreground">{message}</p>
          <p className="text-sm text-muted-foreground mt-1">The editor will still work, but collaboration features may be limited.</p>
        </div>
      </div>
    </div>
  )
}

function getRandomColor(id: string): string {
  const colors = [
    "#E57373", "#F06292", "#BA68C8", "#9575CD", "#7986CB",
    "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC", "#81C784",
    "#AED581", "#FFB74D", "#FF8A65",
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

"use client"

import { useEffect, useState, useCallback } from "react"
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
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface CollaborativeEditorProps {
  documentId: string
}

export function CollaborativeEditor({ documentId }: CollaborativeEditorProps) {
  const room = useRoom()
  const { document: docData } = useDocument(documentId)
  const [doc, setDoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)

  useEffect(() => {
    if (docData?.content) {
      try {
        const parsed = JSON.parse(docData.content)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInitialContent(parsed)
        }
      } catch (e) {
        console.log("No valid initial content, using default")
      }
    }
  }, [docData])

  useEffect(() => {
    if (!room) return
    
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    
    setDoc(yDoc)
    setProvider(yProvider)

    yProvider.on("sync", () => {
      setIsReady(true)
    })

    return () => {
      yDoc.destroy()
      yProvider.destroy()
    }
  }, [room])

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

  const getDefaultContent = (): PartialBlock[] => [
    {
      type: "paragraph",
      content: "",
    },
  ]

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name || "Anonymous",
        color: getRandomColor(userInfo?.id || "anonymous"),
      },
    },
    initialContent: initialContent || getDefaultContent(),
  })

  useEffect(() => {
    const handleInsertAIContent = (event: CustomEvent<string>) => {
      if (!editor) return
      
      const content = event.detail
      const currentBlock = editor.getTextCursorPosition().block
      
      editor.insertBlocks(
        [
          {
            type: "paragraph",
            content: content,
          },
        ],
        currentBlock,
        "after"
      )
    }

    window.addEventListener("insert-ai-content" as any, handleInsertAIContent)
    return () => {
      window.removeEventListener("insert-ai-content" as any, handleInsertAIContent)
    }
  }, [editor])

  const saveToServer = useDebouncedCallback(async () => {
    if (!editor) return
    
    const blocks = editor.document
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
      unsubscribe()
    }
  }, [editor, saveToServer])

  if (!isReady) {
    return <EditorSkeleton />
  }

  return (
    <div className="editor-content">
      <BlockNoteView 
        editor={editor} 
        theme="light"
        className="[&_.bn-container]:max-w-none [&_.bn-editor]:px-0 [&_.bn-editor]:py-0 min-h-[500px]"
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

function getRandomColor(id: string): string {
  const colors = [
    "#E57373",
    "#F06292",
    "#BA68C8",
    "#9575CD",
    "#7986CB",
    "#64B5F6",
    "#4FC3F7",
    "#4DD0E1",
    "#4DB6AC",
    "#81C784",
    "#AED581",
    "#FFB74D",
    "#FF8A65",
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

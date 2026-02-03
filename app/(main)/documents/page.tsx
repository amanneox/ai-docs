"use client"

import { useRouter } from "next/navigation"
import { useDocuments } from "@/hooks/use-documents"
import { Plus, FileText, Clock, Sparkles, ArrowRight, FolderOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { memo, useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const DocumentCard = memo(({ doc }: { doc: { id: string; title: string; updatedAt: string; preview: string } }) => (
  <Link href={`/documents/${doc.id}`}>
    <Card className="group cursor-pointer border-border bg-card/50 hover:border-emerald-500/30 hover:bg-card transition-all duration-200 h-36">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
            <FileText className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate group-hover:text-emerald-400 transition-colors">
              {doc.title || "Untitled"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(doc.updatedAt))} ago
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-auto leading-relaxed">
          {doc.preview || "Start writing..."}
        </p>
      </CardContent>
    </Card>
  </Link>
))
DocumentCard.displayName = "DocumentCard"

function DocumentsLoading() {
  return (
    <div className="h-full p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-10 h-10 rounded-2xl" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-48 mb-2 mt-3" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-32 bg-card/50 border-border">
              <CardContent className="p-5">
                <Skeleton className="w-10 h-10 rounded-xl mb-3" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-36 bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function extractPreview(content: string | null): string {
  if (!content) return ""
  try {
    if (!content.startsWith("[")) return content.slice(0, 100)
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed)) return content.slice(0, 100)
    for (const block of parsed.slice(0, 3)) {
      if (block?.content?.[0]?.text) {
        return block.content[0].text.slice(0, 100)
      }
    }
    return "No content yet..."
  } catch {
    return content.slice(0, 100)
  }
}

export default function DocumentsPage() {
  const router = useRouter()
  const { documents, createDocument, isLoading } = useDocuments()
  const [isCreating, setIsCreating] = useState(false)

  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        updatedAt: String(doc.updatedAt),
        preview: extractPreview(doc.content)
      }))
  }, [documents])

  const handleCreateDocument = async () => {
    if (isCreating) return

    setIsCreating(true)
    try {
      const doc = await createDocument({
        title: "Untitled",
        content: "",
        parentId: null,
      })
      if (doc) {
        router.push(`/documents/${doc.id}`)
      }
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return <DocumentsLoading />
  }

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-500 uppercase tracking-wider">Documents</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          <p className="text-muted-foreground">
            Create, edit, and organize your notes with AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card
            className={`group cursor-pointer hover:border-emerald-500/30 transition-colors ${isCreating ? 'opacity-70 pointer-events-none' : ''}`}
            onClick={handleCreateDocument}
          >
            <CardContent className="p-5">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mb-3">
                {isCreating ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Plus className="h-5 w-5 text-white" />
                )}
              </div>
              <h3 className="font-semibold mb-1">
                {isCreating ? "Creating..." : "New Document"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isCreating ? "Setting up your document" : "Start from scratch"}
              </p>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer hover:border-purple-500/30 transition-colors">
            <CardContent className="p-5">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">AI Templates</h3>
              <p className="text-sm text-muted-foreground">AI-powered templates</p>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer hover:border-blue-500/30 transition-colors">
            <CardContent className="p-5">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Recent</h3>
              <p className="text-sm text-muted-foreground">Continue where you left off</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">All Documents</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
                {documents.length}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {recentDocuments.length === 0 ? (
            <div className="text-center py-16 bg-card/30 rounded-2xl border border-dashed border-border">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first document and start writing
              </p>
              <Button
                onClick={handleCreateDocument}
                className="bg-emerald-600 hover:bg-emerald-500"
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isCreating ? "Creating..." : "Create document"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDocuments.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

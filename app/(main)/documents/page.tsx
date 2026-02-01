"use client"

import { useRouter } from "next/navigation"
import { useDocuments } from "@/hooks/use-documents"
import { Plus, FileText, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function DocumentsPage() {
  const router = useRouter()
  const { documents, createDocument, isLoading } = useDocuments()

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  const handleCreateDocument = async () => {
    const doc = await createDocument({
      title: "Untitled",
      content: "",
      parentId: null,
    })
    if (doc) {
      router.push(`/documents/${doc.id}`)
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Documents</h1>
          <p className="text-muted-foreground text-lg">
            Create, edit, and organize your notes with AI assistance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card 
            className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            onClick={handleCreateDocument}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">New Document</h3>
                <p className="text-sm text-muted-foreground">Start from scratch</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-purple-200 hover:shadow-md transition-all group border-purple-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">AI Templates</h3>
                <p className="text-sm text-muted-foreground">Start with AI assistance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group border-blue-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Recent</h3>
                <p className="text-sm text-muted-foreground">Continue where you left off</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            All Documents
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-muted" />
              ))}
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                Create your first document and start writing with AI assistance
              </p>
              <Button onClick={handleCreateDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDocuments.map((doc) => (
                <Link key={doc.id} href={`/documents/${doc.id}`}>
                  <Card className="group cursor-pointer hover:shadow-md hover:border-primary/30 transition-all h-32">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                          <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                            {doc.title || "Untitled"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Edited {formatDistanceToNow(new Date(doc.updatedAt))} ago
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">
                        {doc.content 
                          ? JSON.parse(doc.content)[0]?.content?.[0]?.text || "No content yet..."
                          : "Start writing..."
                        }
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import {
  Sparkles,
  X,
  Wand2,
  Lightbulb,
  Type,
  AlignLeft,
  Loader2,
  Check,
  Copy,
  MessageSquare,
  PenLine
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  documentId: string
  isOpen: boolean
  onClose: () => void
  selectedText: string
}

type AIAction = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  prompt: (text: string) => string
  gradient: string
}

const AI_ACTIONS: AIAction[] = [
  {
    id: "improve",
    label: "Improve Writing",
    icon: <Wand2 className="h-4 w-4" />,
    description: "Make it clearer and more professional",
    gradient: "from-emerald-500 to-teal-500",
    prompt: (text) => `Improve the following text to make it clearer, more professional, and well-structured:\n\n${text}`,
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: <Type className="h-4 w-4" />,
    description: "Create a concise summary",
    gradient: "from-blue-500 to-cyan-500",
    prompt: (text) => `Provide a concise summary:\n\n${text}`,
  },
  {
    id: "expand",
    label: "Expand",
    icon: <AlignLeft className="h-4 w-4" />,
    description: "Add details and examples",
    gradient: "from-purple-500 to-pink-500",
    prompt: (text) => `Expand with more details:\n\n${text}`,
  },
  {
    id: "ideas",
    label: "Generate Ideas",
    icon: <Lightbulb className="h-4 w-4" />,
    description: "Brainstorm related topics",
    gradient: "from-orange-500 to-amber-500",
    prompt: (text) => `Generate relevant ideas:\n\n${text}`,
  },
]

const ActionButton = memo(({ action, isLoading, activeAction, onClick }: {
  action: AIAction
  isLoading: boolean
  activeAction: string | null
  onClick: () => void
}) => (
  <Button
    variant="outline"
    className="justify-start gap-3 h-auto py-3 px-4 text-left border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all rounded-xl group"
    onClick={onClick}
    disabled={isLoading}
  >
    <div className={cn(
      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br",
      action.gradient,
      "shadow-lg"
    )}>
      {isLoading && activeAction === action.id ? (
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      ) : (
        <span className="text-white">{action.icon}</span>
      )}
    </div>
    <div className="min-w-0">
      <p className="font-medium text-sm">{action.label}</p>
      <p className="text-xs text-muted-foreground truncate">{action.description}</p>
    </div>
  </Button>
))
ActionButton.displayName = "ActionButton"

export function AIAssistant({ documentId, isOpen, onClose, selectedText }: AIAssistantProps) {
  const { toast } = useToast()
  const [customPrompt, setCustomPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const pendingRequestRef = useRef<Promise<void> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
      abortControllerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setResult(null)
      setCustomPrompt("")
      setIsLoading(false)
      setActiveAction(null)
      abortControllerRef.current?.abort()
      abortControllerRef.current = null
    }
  }, [isOpen])

  const hasSelection = selectedText.length > 0

  const callAI = useCallback(async (prompt: string, actionId: string) => {
    if (pendingRequestRef.current) {
      abortControllerRef.current?.abort()
      try {
        await pendingRequestRef.current
      } catch {
        // Ignore abort errors from previous request
      }
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    if (!mountedRef.current) return

    setIsLoading(true)
    setActiveAction(actionId)
    setResult(null)

    const requestPromise = (async () => {
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, documentId }),
          signal: abortController.signal,
        })

        if (!res.ok) throw new Error("Failed")

        const data = await res.json()
        if (data.error) throw new Error(data.message || data.error)

        if (mountedRef.current) {
          setResult(data.content)
        }

        if (data.mock && mountedRef.current) {
          toast({
            title: data.fallback ? "AI Service Unavailable" : "Demo Mode",
            description: data.fallback
              ? "Using fallback mode. Check your OpenAI API key."
              : "Running in demo mode. Add OPENAI_API_KEY for real AI.",
          })
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to generate content. Please try again.",
            variant: "destructive",
          })
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false)
          setActiveAction(null)
        }
        pendingRequestRef.current = null
      }
    })()

    pendingRequestRef.current = requestPromise
  }, [documentId, toast])

  const handleAction = useCallback((action: AIAction) => {
    const text = selectedText || customPrompt
    if (!text.trim()) {
      toast({ title: "No text selected", description: "Select text or type something" })
      return
    }
    callAI(action.prompt(text), action.id)
  }, [selectedText, customPrompt, callAI, toast])

  const handleCustomPrompt = useCallback(() => {
    if (!customPrompt.trim()) return
    callAI(customPrompt, "custom")
  }, [customPrompt, callAI])

  const insertToDocument = useCallback(() => {
    if (!result) return
    window.dispatchEvent(new CustomEvent("insert-ai-content", { detail: result }))
    toast({ title: "Content inserted", description: "AI content added to document" })
    setResult(null)
    setCustomPrompt("")
  }, [result, toast])

  const copyToClipboard = useCallback(async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    toast({ title: "Copied", description: "Content copied to clipboard" })
  }, [result, toast])

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-28 bottom-0 w-80 bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {hasSelection ? "Text selected" : "Select text to enhance"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-xl">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {hasSelection && (
            <div className="bg-secondary/50 rounded-xl p-4 border border-border">
              <p className="text-xs font-medium text-emerald-500 mb-2 flex items-center gap-1.5">
                <PenLine className="h-3 w-3" />
                Selected text
              </p>
              <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">{selectedText}</p>
            </div>
          )}

          {!result && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Actions</p>
              <div className="grid gap-2">
                {AI_ACTIONS.map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    isLoading={isLoading}
                    activeAction={activeAction}
                    onClick={() => handleAction(action)}
                  />
                ))}
              </div>
            </div>
          )}

          {!result && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Prompt</p>
              <Textarea
                placeholder="Ask AI anything..."
                className="min-h-[120px] resize-none text-sm bg-secondary/30 border-border rounded-xl"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <Button
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10"
                onClick={handleCustomPrompt}
                disabled={isLoading || !customPrompt.trim()}
              >
                {isLoading && activeAction === "custom" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Result</p>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={copyToClipboard}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/20">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10"
                  onClick={insertToDocument}
                >
                  <Check className="h-4 w-4" />
                  Insert
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="rounded-xl h-10"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
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
  ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
}

const AI_ACTIONS: AIAction[] = [
  {
    id: "improve",
    label: "Improve Writing",
    icon: <Wand2 className="h-4 w-4" />,
    description: "Make it clearer and more professional",
    prompt: (text) => `Improve the following text to make it clearer, more professional, and well-structured. Maintain the original meaning but enhance the writing quality:\n\n${text}`,
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: <Type className="h-4 w-4" />,
    description: "Create a concise summary",
    prompt: (text) => `Provide a concise summary of the following text, capturing the key points:\n\n${text}`,
  },
  {
    id: "expand",
    label: "Expand",
    icon: <AlignLeft className="h-4 w-4" />,
    description: "Add details and examples",
    prompt: (text) => `Expand on the following text with more details, examples, and explanations to make it more comprehensive:\n\n${text}`,
  },
  {
    id: "ideas",
    label: "Generate Ideas",
    icon: <Lightbulb className="h-4 w-4" />,
    description: "Brainstorm related topics",
    prompt: (text) => `Based on the following text, generate relevant ideas, related topics, and suggestions for further exploration:\n\n${text}`,
  },
]

export function AIAssistant({ isOpen, onClose, selectedText }: AIAssistantProps) {
  const { toast } = useToast()
  const [customPrompt, setCustomPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [hasSelection, setHasSelection] = useState(false)

  useEffect(() => {
    setHasSelection(selectedText.length > 0)
  }, [selectedText])

  const handleAction = async (action: AIAction) => {
    const textToProcess = selectedText || customPrompt
    
    if (!textToProcess.trim()) {
      toast({
        title: "No text selected",
        description: "Select text in your document or type something below",
      })
      return
    }

    setIsLoading(true)
    setActiveAction(action.id)
    setResult(null)

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: action.prompt(textToProcess),
          documentId,
        }),
      })

      if (!res.ok) throw new Error("Failed to generate")

      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.message || data.error)
      }
      
      setResult(data.content)
      
      if (data.mock) {
        toast({
          title: data.fallback ? "AI Service Unavailable" : "Demo Mode",
          description: data.fallback 
            ? "Using fallback mode. Please check your OpenAI API key."
            : "Running in demo mode. Add OPENAI_API_KEY for real AI.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setActiveAction(null)
    }
  }

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return
    
    setIsLoading(true)
    setActiveAction("custom")
    setResult(null)

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          documentId,
        }),
      })

      if (!res.ok) throw new Error("Failed to generate")

      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.message || data.error)
      }
      
      setResult(data.content)
      
      if (data.mock) {
        toast({
          title: data.fallback ? "AI Service Unavailable" : "Demo Mode",
          description: data.fallback 
            ? "Using fallback mode. Please check your OpenAI API key."
            : "Running in demo mode. Add OPENAI_API_KEY for real AI.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setActiveAction(null)
    }
  }

  const insertToDocument = () => {
    if (!result) return

    window.dispatchEvent(new CustomEvent("insert-ai-content", { 
      detail: result 
    }))

    toast({
      title: "Content inserted",
      description: "AI-generated content has been added to your document",
    })

    setResult(null)
    setCustomPrompt("")
  }

  const copyToClipboard = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-28 bottom-0 w-80 bg-card border-l shadow-xl z-40 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  {hasSelection ? "Text selected" : "Select text to enhance"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Selected Text Preview */}
              {hasSelection && (
                <div className="bg-muted/50 rounded-lg p-3 border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Selected text:</p>
                  <p className="text-sm line-clamp-3">{selectedText}</p>
                </div>
              )}

              {/* Quick Actions */}
              {!result && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </p>
                  <div className="grid gap-2">
                    {AI_ACTIONS.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        className="justify-start gap-3 h-auto py-3 px-3 text-left hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20 dark:hover:border-purple-800 transition-all"
                        onClick={() => handleAction(action)}
                        disabled={isLoading}
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                          {isLoading && activeAction === action.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          ) : (
                            <span className="text-purple-600">{action.icon}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{action.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Prompt */}
              {!result && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Custom Prompt
                  </p>
                  <Textarea
                    placeholder="Ask AI anything... (e.g., 'Write an introduction about...')"
                    className="min-h-[100px] resize-none text-sm"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  />
                  <Button 
                    className="w-full gap-2"
                    onClick={handleCustomPrompt}
                    disabled={isLoading || !customPrompt.trim()}
                  >
                    {isLoading && activeAction === "custom" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </div>
              )}

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Result
                    </p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={insertToDocument}>
                      <Check className="h-4 w-4" />
                      Insert
                    </Button>
                    <Button variant="outline" onClick={() => setResult(null)}>
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

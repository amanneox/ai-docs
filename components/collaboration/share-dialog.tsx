"use client"

import { useState } from "react"
import { Share2, Copy, Check, Link as LinkIcon, Globe, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface ShareDialogProps {
  documentId: string
}

export function ShareDialog({ documentId }: ShareDialogProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [accessLevel, setAccessLevel] = useState("private")
  const [email, setEmail] = useState("")
  const [emails, setEmails] = useState<string[]>([])

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/documents/${documentId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleAddEmail = () => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email])
      setEmail("")
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            Invite others to collaborate on this document
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="share" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            {/* Email Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
              />
              <Button onClick={handleAddEmail}>Invite</Button>
            </div>

            {/* Added Emails */}
            {emails.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Invited ({emails.length})</p>
                <div className="space-y-1">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmail(email)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Share Link */}
            <div className="space-y-2">
              <Label>Share link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Access Level */}
            <div className="space-y-2">
              <Label>Access permissions</Label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only you</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="restricted">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Restricted - Invited people only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="link">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      <span>Anyone with the link</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone on the internet</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-edit">Allow editing</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others edit this document
                  </p>
                </div>
                <Switch id="allow-edit" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-comments">Allow comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others add comments
                  </p>
                </div>
                <Switch id="allow-comments" defaultChecked />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useRef } from "react"
import { ImageIcon, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CoverProps {
  documentId: string
}

export function Cover({ documentId }: CoverProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverImage(reader.result as string)
      toast({
        title: "Cover image added",
        description: "Your cover image has been saved",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setCoverImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (!coverImage) {
    return (
      <div className="px-8 md:px-16 pt-8">
        <div className="group">
          <Button
            variant="outline"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleUpload}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative h-64 w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          isHovering ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Cover Actions */}
      <div
        className={cn(
          "absolute bottom-4 right-8 flex gap-2 transition-opacity",
          isHovering ? "opacity-100" : "opacity-0"
        )}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={handleUpload}
        >
          <Upload className="h-4 w-4 mr-2" />
          Change cover
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRemove}
        >
          <X className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

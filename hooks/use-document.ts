"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "./use-toast"
import { Document, DocumentUpdateInput } from "@/types"

export function useDocument(documentId: string | null) {
  const { toast } = useToast()
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDocument = useCallback(async () => {
    if (!documentId) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setDocument(null)
          return
        }
        throw new Error("Failed to fetch document")
      }
      const data = await response.json()
      setDocument(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load document",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [documentId, toast])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  const updateDocument = async (updates: DocumentUpdateInput) => {
    if (!documentId) return null

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) throw new Error("Failed to update document")
      
      const updatedDoc = await response.json()
      setDocument(updatedDoc)
      
      return updatedDoc
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      })
      return null
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete document")
      
      setDocument(null)
      
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    document,
    isLoading,
    updateDocument,
    deleteDocument,
    refetch: fetchDocument,
  }
}

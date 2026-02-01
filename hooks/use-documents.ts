"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "./use-toast"
import { Document, CreateDocumentInput } from "@/types"

export function useDocuments() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch("/api/documents")
      if (!response.ok) throw new Error("Failed to fetch documents")
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const createDocument = async (input: CreateDocumentInput) => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) throw new Error("Failed to create document")
      
      const newDoc = await response.json()
      setDocuments((prev) => [newDoc, ...prev])
      
      toast({
        title: "Document created",
        description: `"${input.title}" has been created`,
      })
      
      return newDoc
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      })
      return null
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) throw new Error("Failed to update document")
      
      const updatedDoc = await response.json()
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? updatedDoc : doc))
      )
      
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
      
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
      
      toast({
        title: "Document deleted",
        description: "The document has been moved to trash",
      })
      
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
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments,
  }
}

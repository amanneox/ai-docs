"use client"

import { useState, useEffect, useCallback } from "react"
import { toast as toastFn } from "./use-toast"
import { Document, CreateDocumentInput } from "@/types"

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()
    setIsLoading(true)

    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents", {
          signal: abortController.signal,
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            setDocuments([])
            return
          }
          throw new Error(`Failed: ${response.status}`)
        }
        
        const data = await response.json()
        setDocuments(data)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        toastFn({ title: "Error", description: "Failed to load documents", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()

    return () => {
      abortController.abort()
    }
  }, [])

  const createDocument = useCallback(async (input: CreateDocumentInput) => {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) throw new Error("Failed")
      
      const newDoc = await response.json()
      setDocuments((prev) => [newDoc, ...prev])
      toastFn({ title: "Created", description: `"${input.title}" created` })
      return newDoc
    } catch {
      toastFn({ title: "Error", description: "Failed to create", variant: "destructive" })
      return null
    }
  }, [])

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) throw new Error("Failed")
      
      const updatedDoc = await response.json()
      setDocuments((prev) => prev.map((d) => (d.id === id ? updatedDoc : d)))
      return updatedDoc
    } catch {
      toastFn({ title: "Error", description: "Failed to update", variant: "destructive" })
      return null
    }
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed")
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      toastFn({ title: "Deleted", description: "Document moved to trash" })
      return true
    } catch {
      toastFn({ title: "Error", description: "Failed to delete", variant: "destructive" })
      return false
    }
  }, [])

  const refetch = useCallback(() => {
    window.location.reload()
  }, [])

  return { documents, isLoading, createDocument, updateDocument, deleteDocument, refetch }
}

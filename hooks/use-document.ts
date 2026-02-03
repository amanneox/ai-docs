"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast as toastFn } from "./use-toast"
import { Document, DocumentUpdateInput } from "@/types"

export function useDocument(documentId: string | null) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const documentIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (documentId === documentIdRef.current) return
    documentIdRef.current = documentId

    if (!documentId) {
      setDocument(null)
      setIsLoading(false)
      setIsNotFound(false)
      return
    }

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setIsNotFound(false)

    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          signal: abortControllerRef.current?.signal,
        })

        if (!response.ok) {
          if (response.status === 404) {
            setDocument(null)
            setIsNotFound(true)
            return
          }
          if (response.status === 401) {
            setDocument(null)
            setIsNotFound(true)
            return
          }
          throw new Error(`Failed: ${response.status}`)
        }

        const data = await response.json()
        setDocument(data)
        setIsNotFound(false)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        toastFn({ title: "Error", description: "Failed to load document", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [documentId])

  const updateDocument = useCallback(async (updates: DocumentUpdateInput) => {
    if (!documentId) return null

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed")

      const updatedDoc = await response.json()
      setDocument(updatedDoc)
      return updatedDoc
    } catch {
      toastFn({ title: "Error", description: "Failed to update", variant: "destructive" })
      return null
    }
  }, [documentId])

  const deleteDocument = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed")
      setDocument(null)
      return true
    } catch {
      toastFn({ title: "Error", description: "Failed to delete", variant: "destructive" })
      return false
    }
  }, [])

  const refetch = useCallback(() => {
    documentIdRef.current = null
    setIsLoading(true)
  }, [])

  return { document, isLoading, isNotFound, updateDocument, deleteDocument, refetch }
}

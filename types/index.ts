export interface Document {
  id: string
  title: string
  content: string | null
  coverImage?: string | null
  icon?: string | null
  isPublished: boolean
  isArchived: boolean
  parentId: string | null
  userId: string
  createdAt: Date | string
  updatedAt: Date | string
  children?: Document[]
}

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: Date | string
}

export interface CollaborationUser {
  id: string
  name: string
  avatar: string | null
  color: string
  cursor: { x: number; y: number } | null
}

export interface AIResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface BlockContent {
  type: string
  content?: string | BlockContent[]
  attrs?: Record<string, unknown>
}

export interface DocumentUpdateInput {
  title?: string
  content?: string
  coverImage?: string | null
  icon?: string | null
  isPublished?: boolean
  isArchived?: boolean
  parentId?: string | null
}

export interface CreateDocumentInput {
  title: string
  content?: string
  parentId?: string | null
  coverImage?: string | null
  icon?: string | null
}

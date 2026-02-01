import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { documentsStore } from "@/lib/store"

interface DocumentRouteProps {
  params: {
    documentId: string
  }
}

export async function GET(req: NextRequest, { params }: DocumentRouteProps) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userDocs = documentsStore.get(userId) || []
    const document = userDocs.find(doc => doc.id === params.documentId)

    if (!document) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: DocumentRouteProps) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userDocs = documentsStore.get(userId) || []
    const docIndex = userDocs.findIndex(doc => doc.id === params.documentId)

    if (docIndex === -1) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const body = await req.json()
    const { title, content, coverImage, icon, isPublished, isArchived, parentId } = body

    const updatedDoc = {
      ...userDocs[docIndex],
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(icon !== undefined && { icon }),
      ...(isPublished !== undefined && { isPublished }),
      ...(isArchived !== undefined && { isArchived }),
      ...(parentId !== undefined && { parentId }),
      updatedAt: new Date().toISOString(),
    }

    userDocs[docIndex] = updatedDoc
    documentsStore.set(userId, userDocs)

    return NextResponse.json(updatedDoc)
  } catch (error) {
    console.error("[DOCUMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: DocumentRouteProps) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userDocs = documentsStore.get(userId) || []
    const docIndex = userDocs.findIndex(doc => doc.id === params.documentId)

    if (docIndex === -1) {
      return new NextResponse("Not Found", { status: 404 })
    }

    userDocs[docIndex] = {
      ...userDocs[docIndex],
      isArchived: true,
      updatedAt: new Date().toISOString(),
    }
    documentsStore.set(userId, userDocs)

    return NextResponse.json(userDocs[docIndex])
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

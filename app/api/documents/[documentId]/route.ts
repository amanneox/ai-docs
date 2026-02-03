import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

interface DocumentRouteProps {
  params: {
    documentId: string
  }
}

export async function GET(req: NextRequest, { params }: DocumentRouteProps) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const document = await prisma.document.findUnique({
      where: { 
        id: params.documentId,
        userId,
      },
      include: { children: true },
    })

    if (!document) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENT_GET] Error:", error)
    return NextResponse.json(
      { error: "Internal Error", details: String(error) }, 
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, { params }: DocumentRouteProps) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, coverImage, icon, isPublished, isArchived, parentId } = body

    const updatedDoc = await prisma.document.update({
      where: {
        id: params.documentId,
        userId,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(icon !== undefined && { icon }),
        ...(isPublished !== undefined && { isPublished }),
        ...(isArchived !== undefined && { isArchived }),
        ...(parentId !== undefined && { parentId }),
      },
      include: { children: true },
    })

    return NextResponse.json(updatedDoc)
  } catch (error) {
    console.error("[DOCUMENT_PATCH] Error:", error)
    return NextResponse.json(
      { error: "Internal Error", details: String(error) }, 
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: DocumentRouteProps) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedDoc = await prisma.document.update({
      where: {
        id: params.documentId,
        userId,
      },
      data: {
        isArchived: true,
      },
      include: { children: true },
    })

    return NextResponse.json(updatedDoc)
  } catch (error) {
    console.error("[DOCUMENT_DELETE] Error:", error)
    return NextResponse.json(
      { error: "Internal Error", details: String(error) }, 
      { status: 500 }
    )
  }
}

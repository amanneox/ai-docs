import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { documentsStore } from "@/lib/store"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userDocs = documentsStore.get(userId) || []
    
    return NextResponse.json(userDocs)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, content, parentId, coverImage, icon } = body

    const document = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      title: title || "Untitled",
      content: content || "",
      parentId: parentId || null,
      coverImage: coverImage || null,
      icon: icon || null,
      userId,
      isPublished: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: [],
    }

    const userDocs = documentsStore.get(userId) || []
    userDocs.unshift(document)
    documentsStore.set(userId, userDocs)

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

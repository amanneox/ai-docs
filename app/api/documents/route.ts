import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userDocs = await prisma.document.findMany({
      where: { userId },
      include: { children: true },
      orderBy: { updatedAt: "desc" },
    })
    
    return NextResponse.json(userDocs)
  } catch (error) {
    console.error("[DOCUMENTS_GET] Error:", error)
    return NextResponse.json(
      { error: "Internal Error", details: String(error) }, 
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, parentId } = body

    const document = await prisma.document.create({
      data: {
        title: title || "Untitled",
        content: content || "",
        parentId: parentId || null,
        userId,
        isPublished: false,
        isArchived: false,
      },
      include: { children: true },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENTS_POST] Error:", error)
    return NextResponse.json(
      { error: "Internal Error", details: String(error) }, 
      { status: 500 }
    )
  }
}

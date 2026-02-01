import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Liveblocks } from "@liveblocks/node"

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userInfo = {
      id: userId,
      name: "User", // You'd fetch this from Clerk or your DB
      avatar: null, // You'd fetch this from Clerk or your DB
    }

    const { status, body } = await liveblocks.identifyUser(
      {
        userId: userId,
        groupIds: [], // Optional: Add group/organization IDs here
      },
      {
        userInfo: {
          name: userInfo.name,
          avatar: userInfo.avatar,
          id: userInfo.id,
        },
      }
    )

    return new NextResponse(body, { status })
  } catch (error) {
    console.error("[LIVEBLOCKS_AUTH]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    )
  }
}

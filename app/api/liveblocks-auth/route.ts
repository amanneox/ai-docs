import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { Liveblocks } from "@liveblocks/node"

// Route is request-time only; never statically analyzed at build.
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Instantiate lazily so `next build` doesn't require the secret at build time.
    const liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    })

    // Get user details from Clerk
    const user = await currentUser()
    const userName = user?.fullName || user?.emailAddresses[0]?.emailAddress || "Anonymous"
    const userAvatar = user?.imageUrl

    // Create a session that grants access to document rooms
    // Using prepareSession allows us to specify room permissions
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: userName,
        avatar: userAvatar,
        id: userId,
      },
    })

    // Grant full access to all document rooms for this user
    // Rooms are named like "document-{documentId}"
    session.allow("document-*", session.FULL_ACCESS)

    const { status, body } = await session.authorize()

    return new NextResponse(body, { status })
  } catch (error) {
    console.error("[LIVEBLOCKS_AUTH]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    )
  }
}

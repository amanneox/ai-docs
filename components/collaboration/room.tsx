"use client"

import { ReactNode, useMemo } from "react"
import { 
  LiveblocksProvider, 
  RoomProvider as LiveblocksRoomProvider, 
  ClientSideSuspense 
} from "@liveblocks/react"
import { useUser } from "@clerk/nextjs"

interface RoomProps {
  children: ReactNode
  roomId: string
}

export function Room({ children, roomId }: RoomProps) {
  const { user } = useUser()
  
  const userInfo = useMemo(() => ({
    name: user?.fullName || user?.emailAddresses[0]?.emailAddress || "Anonymous",
    avatar: user?.imageUrl,
    id: user?.id,
  }), [user])

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
    >
      <LiveblocksRoomProvider
        id={roomId}
        initialPresence={{ cursor: null, selection: null }}
        initialStorage={{}}
      >
        <ClientSideSuspense fallback={<RoomLoading />}>
          {() => children}
        </ClientSideSuspense>
      </LiveblocksRoomProvider>
    </LiveblocksProvider>
  )
}

function RoomLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-muted rounded-full" />
        <div className="h-4 w-32 bg-muted rounded" />
        <p className="text-sm text-muted-foreground">Loading document...</p>
      </div>
    </div>
  )
}

export { useRoom } from "@liveblocks/react"

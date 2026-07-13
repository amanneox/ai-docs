"use client"

import { ReactNode, useRef, useEffect } from "react"
import {
  LiveblocksProvider,
  RoomProvider as LiveblocksRoomProvider,
  ClientSideSuspense
} from "@liveblocks/react"
import { Loader2, FileText } from "lucide-react"

interface RoomProps {
  children: ReactNode
  roomId: string
}

function RoomContent({ children, roomId }: RoomProps) {
  return (
    <LiveblocksRoomProvider
      id={roomId}
      initialPresence={{ cursor: null, selection: null }}
      initialStorage={{}}
    >
      <ClientSideSuspense fallback={<RoomLoading />}>
        {() => children}
      </ClientSideSuspense>
    </LiveblocksRoomProvider>
  )
}

export function Room({ children, roomId }: RoomProps) {
  const childrenRef = useRef(children)
  
  useEffect(() => {
    childrenRef.current = children
  }, [children])

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
    >
      <RoomContent roomId={roomId}>
        {children}
      </RoomContent>
    </LiveblocksProvider>
  )
}

function RoomLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <FileText className="h-8 w-8 text-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
          <span className="text-muted-foreground">Connecting to collaboration server...</span>
        </div>
      </div>
    </div>
  )
}

export { useRoom } from "@liveblocks/react"

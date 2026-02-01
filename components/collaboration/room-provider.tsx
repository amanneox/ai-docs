"use client"

import { ReactNode } from "react"
import { LiveblocksProvider, RoomProvider as LiveblocksRoomProvider } from "@liveblocks/react"

interface RoomProviderProps {
  children: ReactNode
  roomId?: string
}

export function RoomProvider({ children, roomId }: RoomProviderProps) {
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
    >
      {roomId ? (
        <LiveblocksRoomProvider id={roomId}>
          {children}
        </LiveblocksRoomProvider>
      ) : (
        children
      )}
    </LiveblocksProvider>
  )
}

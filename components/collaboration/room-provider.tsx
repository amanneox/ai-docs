"use client"

import { ReactNode, useMemo } from "react"
import { LiveblocksProvider, RoomProvider as LiveblocksRoomProvider } from "@liveblocks/react"

interface RoomProviderProps {
  children: ReactNode
  roomId?: string
}

export function RoomProvider({ children, roomId }: RoomProviderProps) {
  // Memoize to prevent provider recreation on every render
  const provider = useMemo(() => {
    const content = roomId ? (
      <LiveblocksRoomProvider id={roomId}>
        {children}
      </LiveblocksRoomProvider>
    ) : (
      children
    )
    
    return (
      <LiveblocksProvider
        authEndpoint="/api/liveblocks-auth"
        throttle={16}
      >
        {content}
      </LiveblocksProvider>
    )
  }, [roomId, children])

  return provider
}

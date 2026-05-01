import { useRef, useCallback } from 'react'
import { getSocket } from '../services/socket'

export function useTyping(channelId) {
  const isTyping  = useRef(false)
  const timer     = useRef(null)

  const startTyping = useCallback(() => {
    const socket = getSocket()
    if (!socket || !channelId) return
    if (!isTyping.current) {
      isTyping.current = true
      socket.emit('typing_start', { channelId })
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      isTyping.current = false
      socket.emit('typing_stop', { channelId })
    }, 2000)
  }, [channelId])

  const stopTyping = useCallback(() => {
    const socket = getSocket()
    if (!socket || !channelId) return
    clearTimeout(timer.current)
    if (isTyping.current) {
      isTyping.current = false
      socket.emit('typing_stop', { channelId })
    }
  }, [channelId])

  return { startTyping, stopTyping }
}

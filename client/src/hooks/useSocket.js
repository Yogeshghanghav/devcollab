import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSocket } from '../services/socket'
import { addChannelMessage, addDirectMessage, setTyping, clearTyping } from '../features/chat/chatSlice'
import { setOnlineUsers } from '../features/presence/presenceSlice'
import { addAlert } from '../features/monitor/monitorSlice'
import toast from 'react-hot-toast'

export function useSocket() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !user) return

    socket.emit('join_channels')
    const onChannelMsg = (msg) => dispatch(addChannelMessage(msg))

    const onDirectMsg  = (msg) => {
      dispatch(addDirectMessage(msg))
      // Toast if sender is not current user
      const senderId = msg.user?._id || msg.user
      if (senderId !== user._id) {
        toast(`${msg.userName}: ${msg.text.slice(0, 60)}`, { duration: 3000 })
      }
    }

    const onPresence   = (list) => dispatch(setOnlineUsers(list))
    const onAlert      = (alert) => {
      dispatch(addAlert(alert))
      toast.error(` ${alert.message}`, { duration: 6000 })
    }

    const onTypingStart = ({ userId, name, channelId }) => {
      if (userId !== user._id) dispatch(setTyping({ channelId, userId, name }))
    }
    const onTypingStop  = ({ userId, channelId }) => dispatch(clearTyping({ channelId, userId }))

    socket.on('receive_channel_message', onChannelMsg)
    socket.on('receive_direct_message',  onDirectMsg)
    socket.on('presence_update',         onPresence)
    socket.on('new_alert',               onAlert)
    socket.on('user_typing',             onTypingStart)
    socket.on('user_stopped_typing',     onTypingStop)

    return () => {
      socket.off('receive_channel_message', onChannelMsg)
      socket.off('receive_direct_message',  onDirectMsg)
      socket.off('presence_update',         onPresence)
      socket.off('new_alert',               onAlert)
      socket.off('user_typing',             onTypingStart)
      socket.off('user_stopped_typing',     onTypingStop)
    }
  }, [dispatch, user])
}

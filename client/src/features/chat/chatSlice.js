import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatAPI } from '../../services/api'

// ── Thunks ───────────────────────────────────────────────

export const fetchChannels = createAsyncThunk('chat/fetchChannels', async () => {
  const { data } = await chatAPI.getChannels()
  return data
})

export const createChannel = createAsyncThunk('chat/createChannel', async (channelData, { rejectWithValue }) => {
  try {
    const { data } = await chatAPI.createChannel(channelData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Failed')
  }
})

export const fetchChannelMessages = createAsyncThunk('chat/fetchChannelMessages', async ({ channelId }) => {
  const { data } = await chatAPI.getChannelMessages(channelId)
  return { channelId, messages: data }
})

export const fetchDirectMessages = createAsyncThunk('chat/fetchDirectMessages', async (userId) => {
  const { data } = await chatAPI.getDirectMessages(userId)
  return { userId, messages: data }
})

// ── Slice ─────────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels:        [],
    activeChannelId: null,
    activeDmUserId:  null,
    messages:        {},    // { channelId: [...] }
    dmMessages:      {},    // { userId: [...] }
    typingUsers:     {},    // { channelId: [userId, ...] }
    loading:         false,
    messagesLoading: false,
  },
  reducers: {
    setActiveChannel(state, { payload }) {
      state.activeChannelId = payload
      state.activeDmUserId  = null
    },
    setActiveDmUser(state, { payload }) {
      state.activeDmUserId  = payload
      state.activeChannelId = null
    },
    addChannelMessage(state, { payload }) {
      const cid = payload.channel?._id || payload.channel
      if (!state.messages[cid]) state.messages[cid] = []
      const exists = state.messages[cid].some(m => m._id === payload._id)
      if (!exists) state.messages[cid].push(payload)
    },
    addDirectMessage(state, { payload }) {
      // store under both sender and recipient key
      const keys = [payload.user?._id || payload.user, payload.recipient]
      keys.forEach(k => {
        if (!k) return
        if (!state.dmMessages[k]) state.dmMessages[k] = []
        const exists = state.dmMessages[k].some(m => m._id === payload._id)
        if (!exists) state.dmMessages[k].push(payload)
      })
    },
    setTyping(state, { payload: { channelId, userId, name } }) {
      if (!state.typingUsers[channelId]) state.typingUsers[channelId] = []
      if (!state.typingUsers[channelId].find(u => u.userId === userId)) {
        state.typingUsers[channelId].push({ userId, name })
      }
    },
    clearTyping(state, { payload: { channelId, userId } }) {
      if (state.typingUsers[channelId]) {
        state.typingUsers[channelId] = state.typingUsers[channelId].filter(u => u.userId !== userId)
      }
    },
    addChannel(state, { payload }) {
      if (!state.channels.find(c => c._id === payload._id)) {
        state.channels.push(payload)
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchChannels.pending,          (s)    => { s.loading = true })
    b.addCase(fetchChannels.fulfilled,        (s, a) => { s.loading = false; s.channels = a.payload })
    b.addCase(fetchChannels.rejected,         (s)    => { s.loading = false })
    b.addCase(createChannel.fulfilled,        (s, a) => { s.channels.push(a.payload) })
    b.addCase(fetchChannelMessages.pending,   (s)    => { s.messagesLoading = true })
    b.addCase(fetchChannelMessages.fulfilled, (s, a) => {
      s.messagesLoading = false
      s.messages[a.payload.channelId] = a.payload.messages
    })
    b.addCase(fetchChannelMessages.rejected,  (s)    => { s.messagesLoading = false })
    b.addCase(fetchDirectMessages.fulfilled,  (s, a) => {
      s.dmMessages[a.payload.userId] = a.payload.messages
    })
  },
})

export const {
  setActiveChannel, setActiveDmUser,
  addChannelMessage, addDirectMessage,
  setTyping, clearTyping, addChannel,
} = chatSlice.actions

export default chatSlice.reducer

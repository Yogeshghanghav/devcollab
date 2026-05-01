import { createSlice } from '@reduxjs/toolkit'

const presenceSlice = createSlice({
  name: 'presence',
  initialState: { onlineUsers: [] },
  reducers: {
    setOnlineUsers(state, { payload }) {
      state.onlineUsers = payload
    },
  },
})

export const { setOnlineUsers } = presenceSlice.actions
export default presenceSlice.reducer

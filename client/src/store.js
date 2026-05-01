import { configureStore } from '@reduxjs/toolkit'
import authReducer     from './features/auth/authSlice'
import chatReducer     from './features/chat/chatSlice'
import presenceReducer from './features/presence/presenceSlice'
import monitorReducer  from './features/monitor/monitorSlice'

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    chat:     chatReducer,
    presence: presenceReducer,
    monitor:  monitorReducer,
  },
})

export default store

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'
import { initSocket, disconnectSocket } from '../../services/socket'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials)
    localStorage.setItem('token', data.token)
    initSocket(data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(formData)
    localStorage.setItem('token', data.token)
    initSocket(data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Registration failed')
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.getMe()
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || 'Failed to fetch user')
  }
})

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
  const { data } = await authAPI.getUsers()
  return data
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    users:   [],
    token:   localStorage.getItem('token'),
    loading: false,
    error:   null,
    ready:   false,
  },
  reducers: {
    logout(state) {
      state.user  = null
      state.token = null
      state.ready = true
      localStorage.removeItem('token')
      disconnectSocket()
    },
    clearError(state) { state.error = null },
    // NAVIN: Ready state manually update karnyasathi
    setReady(state, action) {
      state.ready = action.payload
    }
  },
  extraReducers: (b) => {
    b.addCase(loginUser.pending,    (s)    => { s.loading = true;  s.error = null })
    b.addCase(loginUser.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.ready = true })
    b.addCase(loginUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; s.ready = true })
    
    b.addCase(registerUser.pending,   (s)    => { s.loading = true;  s.error = null })
    b.addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.ready = true })
    b.addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; s.ready = true })
    
    b.addCase(fetchMe.pending,    (s)    => { s.loading = true })
    b.addCase(fetchMe.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload; s.ready = true })
    b.addCase(fetchMe.rejected,   (s)    => { s.loading = false; s.user = null; s.token = null; s.ready = true; localStorage.removeItem('token') })
    
    b.addCase(fetchUsers.fulfilled, (s, a) => { s.users = a.payload })
  },
})

export const { logout, clearError, setReady } = authSlice.actions
export default authSlice.reducer

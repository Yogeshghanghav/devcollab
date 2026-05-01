import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { monitorAPI } from '../../services/api'

export const fetchStats  = createAsyncThunk('monitor/fetchStats',  async () => { const { data } = await monitorAPI.getStats();  return data })
export const fetchLogs   = createAsyncThunk('monitor/fetchLogs',   async (params) => { const { data } = await monitorAPI.getLogs(params); return data })
export const fetchAlerts = createAsyncThunk('monitor/fetchAlerts', async (params) => { const { data } = await monitorAPI.getAlerts(params); return data })

export const resolveAlert = createAsyncThunk('monitor/resolveAlert', async (id) => {
  const { data } = await monitorAPI.resolveAlert(id)
  return data
})

const monitorSlice = createSlice({
  name: 'monitor',
  initialState: {
    stats:  null,
    logs:   [],
    alerts: [],
    logsTotal: 0,
    loading: false,
    statsLoading: false,
  },
  reducers: {
    addAlert(state, { payload }) {
      state.alerts.unshift(payload)
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchStats.pending,     (s)    => { s.statsLoading = true })
    b.addCase(fetchStats.fulfilled,   (s, a) => { s.statsLoading = false; s.stats = a.payload })
    b.addCase(fetchStats.rejected,    (s)    => { s.statsLoading = false })
    b.addCase(fetchLogs.pending,      (s)    => { s.loading = true })
    b.addCase(fetchLogs.fulfilled,    (s, a) => { s.loading = false; s.logs = a.payload.logs; s.logsTotal = a.payload.total })
    b.addCase(fetchLogs.rejected,     (s)    => { s.loading = false })
    b.addCase(fetchAlerts.fulfilled,  (s, a) => { s.alerts = a.payload })
    b.addCase(resolveAlert.fulfilled, (s, a) => {
      const idx = s.alerts.findIndex(al => al._id === a.payload._id)
      if (idx !== -1) s.alerts[idx] = a.payload
    })
  },
})

export const { addAlert } = monitorSlice.actions
export default monitorSlice.reducer

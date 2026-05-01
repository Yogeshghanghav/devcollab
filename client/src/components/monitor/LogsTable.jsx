import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLogs } from '../../features/monitor/monitorSlice'
import { format } from 'date-fns'
import Badge from '../ui/Badge'
import Spinner from '../ui/Spinner'

const METHOD_COLORS = {
  GET:    'bg-green-500/20 text-green-400',
  POST:   'bg-blue-500/20 text-blue-400',
  PUT:    'bg-amber-500/20 text-amber-400',
  PATCH:  'bg-amber-500/20 text-amber-400',
  DELETE: 'bg-red-500/20 text-red-400',
}

function statusVariant(code) {
  if (code < 300) return 'success'
  if (code < 400) return 'info'
  if (code < 500) return 'warning'
  return 'error'
}

export default function LogsTable() {
  const dispatch  = useDispatch()
  const { logs, logsTotal, loading } = useSelector(s => s.monitor)
  const [page,   setPage]   = useState(1)
  const [filter, setFilter] = useState({ isError: '', method: '' })

  useEffect(() => {
    const params = { page, limit: 20 }
    if (filter.isError !== '') params.isError = filter.isError
    if (filter.method)         params.method  = filter.method
    dispatch(fetchLogs(params))
  }, [dispatch, page, filter])

  const pages = Math.ceil(logsTotal / 20)

  return (
    <div className="flex flex-col gap-3">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filter.method}
          onChange={e => { setFilter(f => ({...f, method: e.target.value})); setPage(1) }}
          className="input-base w-36 py-1.5"
        >
          <option value="">All Methods</option>
          {['GET','POST','PUT','PATCH','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={filter.isError}
          onChange={e => { setFilter(f => ({...f, isError: e.target.value})); setPage(1) }}
          className="input-base w-36 py-1.5"
        >
          <option value="">All Status</option>
          <option value="false">Success</option>
          <option value="true">Errors Only</option>
        </select>
        <span className="text-xs text-text-muted ml-auto">{logsTotal.toLocaleString()} total</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border">
                {['Method','Path','Status','Time','Response','User','When'].map(h => (
                  <th key={h} className="text-left text-xs text-text-muted font-medium uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10"><Spinner className="mx-auto" /></td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-text-muted">No logs found</td></tr>
              ) : logs.map((log) => (
                <tr key={log._id} className="border-b border-bg-border/50 hover:bg-bg-elevated/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${METHOD_COLORS[log.method] || 'bg-bg-overlay text-text-secondary'}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-secondary max-w-48 truncate">{log.path}</td>
                  <td className="px-4 py-2.5">
                    <Badge label={log.statusCode} variant={statusVariant(log.statusCode)} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">
                    <span className={log.responseTime > 1000 ? 'text-red-400' : log.responseTime > 500 ? 'text-amber-400' : 'text-green-400'}>
                      {log.responseTime}ms
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {log.errorMessage
                      ? <span className="text-xs text-red-400 truncate max-w-40 block">{log.errorMessage}</span>
                      : <span className="text-xs text-text-muted">—</span>
                    }
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">{log.userId?.name || '—'}</td>
                  <td className="px-4 py-2.5 text-xs text-text-muted whitespace-nowrap">
                    {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-bg-border">
            <span className="text-xs text-text-muted">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-ghost py-1 px-2 text-xs">← Prev</button>
              <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages} className="btn-ghost py-1 px-2 text-xs">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

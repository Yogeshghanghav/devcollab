import { useDispatch, useSelector } from 'react-redux'
import { resolveAlert } from '../../features/monitor/monitorSlice'
import { format } from 'date-fns'
import Badge from '../ui/Badge'
import { CheckIcon, BellAlertIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AlertsPanel() {
  const dispatch = useDispatch()
  const { alerts } = useSelector(s => s.monitor)

  const active   = alerts.filter(a => !a.resolved)
  const resolved = alerts.filter(a =>  a.resolved)

  const handleResolve = async (id) => {
    await dispatch(resolveAlert(id))
    toast.success('Alert resolved')
  }

  const AlertRow = ({ alert }) => (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
      alert.resolved
        ? 'border-bg-border bg-bg-elevated/30 opacity-60'
        : alert.severity === 'critical' ? 'border-red-500/40 bg-red-500/5'
        : alert.severity === 'high'     ? 'border-orange-500/40 bg-orange-500/5'
        : 'border-bg-border bg-bg-elevated/50'
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
        alert.severity === 'critical' ? 'bg-red-500/20' :
        alert.severity === 'high'     ? 'bg-orange-500/20' :
        alert.severity === 'medium'   ? 'bg-amber-500/20' : 'bg-bg-overlay'
      }`}>
        <BellAlertIcon className={`w-4 h-4 ${
          alert.severity === 'critical' ? 'text-red-400' :
          alert.severity === 'high'     ? 'text-orange-400' :
          alert.severity === 'medium'   ? 'text-amber-400' : 'text-text-muted'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Badge label={alert.severity} variant={alert.severity} />
          <Badge label={alert.type.replace(/_/g,' ')} variant="info" />
          {alert.resolved && <Badge label="resolved" variant="success" />}
        </div>
        <p className="text-sm text-text-primary">{alert.message}</p>
        <p className="text-xs text-text-muted mt-1">{format(new Date(alert.createdAt), 'MMM d, yyyy HH:mm')}</p>
      </div>
      {!alert.resolved && (
        <button
          onClick={() => handleResolve(alert._id)}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <CheckIcon className="w-3.5 h-3.5" />
          Resolve
        </button>
      )}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
          Active Alerts
          {active.length > 0 && (
            <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">{active.length}</span>
          )}
        </h3>
        {active.length === 0
          ? <p className="text-sm text-text-muted py-4 text-center">✅ No active alerts</p>
          : <div className="flex flex-col gap-2">{active.map(a => <AlertRow key={a._id} alert={a} />)}</div>
        }
      </div>

      {resolved.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Resolved</h3>
          <div className="flex flex-col gap-2">{resolved.slice(0, 5).map(a => <AlertRow key={a._id} alert={a} />)}</div>
        </div>
      )}
    </div>
  )
}

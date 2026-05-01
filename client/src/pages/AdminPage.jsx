import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../features/auth/authSlice'
import { authAPI } from '../services/api'
import Avatar from '../components/ui/Avatar'
import Badge  from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ROLES = ['admin','developer','viewer']

export default function AdminPage() {
  const dispatch = useDispatch()
  const { users, loading, user: me } = useSelector(s => s.auth)
  const { onlineUsers } = useSelector(s => s.presence)

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  const isOnline = (uid) => onlineUsers.some(u => u.id === uid?.toString())

  const changeRole = async (userId, role) => {
    try {
      await authAPI.updateRole({ userId, role })
      dispatch(fetchUsers())
      toast.success('Role updated')
    } catch {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-bg-base">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold font-display text-text-primary">Team</h1>
          <p className="text-sm text-text-muted mt-0.5">{users.length} members</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border">
                  {['Member','Role','Status','Joined','Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-text-muted font-medium uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-bg-border/50 hover:bg-bg-elevated/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" online={isOnline(u._id)} />
                        <div>
                          <p className="font-medium text-text-primary">{u.name} {u._id === me?._id && <span className="text-text-muted">(you)</span>}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><Badge label={u.role} variant={u.role} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isOnline(u._id) ? 'bg-green-400' : 'bg-text-muted'}`} />
                        <span className="text-xs text-text-muted">{isOnline(u._id) ? 'Online' : 'Offline'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">
                      {format(new Date(u.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-5 py-3.5">
                      {u._id !== me?._id ? (
                        <select
                          value={u.role}
                          onChange={e => changeRole(u._id, e.target.value)}
                          className="input-base py-1 w-32"
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

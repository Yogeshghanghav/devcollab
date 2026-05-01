import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from '../components/ui/Spinner'

export default function ProtectedRoute({ children, roles }) {
  const { user, ready } = useSelector(s => s.auth)

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />
  }

  return children
}

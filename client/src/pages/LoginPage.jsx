import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, clearError } from '../features/auth/authSlice'
import Spinner from '../components/ui/Spinner'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
    return () => dispatch(clearError())
  }, [user, navigate, dispatch])

  const handle = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="min-h-screen flex bg-bg-base">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[45%] relative bg-bg-surface border-r border-bg-border flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-accent mb-8 flex items-center justify-center">
            <span className="text-white text-xl font-bold font-display">DC</span>
          </div>
          <h1 className="text-4xl font-bold font-display text-text-primary leading-tight mb-4">
            Ship faster.<br />Together.
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Real-time collaboration, API monitoring and team communication — all in one platform built for engineering teams.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            {[
              { label: '💬', text: 'Channel-based team chat' },
              { label: '📊', text: 'Live API performance monitoring' },
              { label: '🔔', text: 'Smart alert system' },
              { label: '👥', text: 'Role-based access control' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="text-base">{f.label}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-display text-text-primary mb-1">Welcome back</h2>
            <p className="text-text-muted text-sm">Sign in to your DevCollab workspace</p>
          </div>

          <form onSubmit={handle} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-sm text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                placeholder="you@company.com"
                className="input-base"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                placeholder="••••••••"
                className="input-base"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            No account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-hover transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, clearError } from '../features/auth/authSlice'
import Spinner from '../components/ui/Spinner'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
    return () => dispatch(clearError())
  }, [user, navigate, dispatch])

  const handle = (e) => {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}))

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-8">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-white font-bold font-display">DC</span>
          </div>
          <span className="text-lg font-bold font-display text-text-primary">DevCollab</span>
        </div>

        <div className="mb-7">
          <h2 className="text-2xl font-bold font-display text-text-primary mb-1">Create account</h2>
          <p className="text-text-muted text-sm">Join your team on DevCollab</p>
        </div>

        <form onSubmit={handle} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-sm text-red-400 animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Full Name</label>
            <input type="text" required value={form.name} onChange={set('name')} placeholder="Jane Smith" className="input-base" autoComplete="name" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Email</label>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="jane@company.com" className="input-base" autoComplete="email" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Password</label>
            <input type="password" required value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className="input-base" minLength={8} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1 flex items-center justify-center gap-2">
            {loading ? <><Spinner size="sm" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">Sign in</Link>
        </p>

        <p className="text-center text-xs text-text-muted mt-4 px-4">
          The first registered user automatically becomes Admin.
        </p>
      </div>
    </div>
  )
}

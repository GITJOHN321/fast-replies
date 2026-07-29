import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export function AuthSettings() {
  const { user, logout, loading } = useUser()

  const handleLogout = async () => {
    await logout()
  }

  if (!user) {
    return (
      <div className="form-card space-y-3">
        <h2 className="text-sm font-semibold text-text tracking-wide uppercase">
          Account
        </h2>
        <p className="text-xs text-text-dim">Not signed in.</p>
        <Link
          to="/login"
          className="btn-primary text-center block"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="form-card space-y-3">
      <h2 className="text-sm font-semibold text-text tracking-wide uppercase">
        Account
      </h2>
      <p className="text-sm text-text">
        Logged in as <span className="text-accent font-medium">{user.username}</span>
      </p>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="btn-danger w-full text-center"
      >
        Logout
      </button>
    </div>
  )
}

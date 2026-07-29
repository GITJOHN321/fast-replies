import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function LoginPage() {
  const { login } = useUser()
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    const email = emailRef.current?.value.trim()
    const password = passwordRef.current?.value.trim()
    if (!email || !password) return
    const ok = await login(email, password)
    if (ok) navigate('/')
  }

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-md">
        <h1 className="page-title">Login</h1>
        <div className="form-card">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="input-label">Email</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="your@email.com"
                className="input-field"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && passwordRef.current?.focus()}
              />
            </div>
            <div>
              <label htmlFor="password" className="input-label">Password</label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="••••••••"
                className="input-field"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              />
            </div>
            <button onClick={handleSubmit} className="btn-primary">
              Iniciar sesión
            </button>
            <p className="text-center text-sm text-text-muted">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-accent hover:text-accent-hover transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

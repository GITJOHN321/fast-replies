import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function RegisterPage() {
  const { register } = useUser()
  const navigate = useNavigate()
  const userRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const repeatRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    const user = userRef.current?.value.trim()
    const email = emailRef.current?.value.trim()
    const password = passwordRef.current?.value
    const repeat = repeatRef.current?.value
    if (!user || !email || !password || !repeat) return
    if (password !== repeat) return
    await register({ user, email, password })
    navigate('/login')
  }

  return (
    <div className="page-wrapper">
      <div className="w-full max-w-md">
        <h1 className="page-title">Register</h1>
        <div className="form-card">
          <div className="space-y-5">
            <div>
              <label htmlFor="user" className="input-label">User</label>
              <input
                ref={userRef}
                id="user"
                placeholder="username"
                className="input-field"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && emailRef.current?.focus()}
              />
            </div>
            <div>
              <label htmlFor="email" className="input-label">Email</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="your@email.com"
                className="input-field"
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
                onKeyDown={(e) => e.key === 'Enter' && repeatRef.current?.focus()}
              />
            </div>
            <div>
              <label htmlFor="repeat" className="input-label">Repeat Password</label>
              <input
                ref={repeatRef}
                id="repeat"
                type="password"
                placeholder="••••••••"
                className="input-field"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              />
            </div>
            <button onClick={handleSubmit} className="btn-primary">
              Crear cuenta
            </button>
            <p className="text-center text-sm text-text-muted">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

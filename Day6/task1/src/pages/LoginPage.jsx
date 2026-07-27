import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { clearAuthFeedback, login } from '../features/auth/authSlice'
import { brandLogo, DEMO_USER } from '../data'

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState(DEMO_USER.email)
  const [password, setPassword] = useState(DEMO_USER.password)

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  useEffect(() => {
    if (user) navigate('/ncr/restaurants', { replace: true })
  }, [user, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email: email.trim(), password }))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <img src={brandLogo} alt="zomato" />
        </Link>
        <h1>Log in</h1>
        <p className="auth-subtitle">Welcome back. Order your favourite food.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" className="auth-submit">
            Log in
          </button>
        </form>

        <p className="auth-demo">
          Demo: <strong>{DEMO_USER.email}</strong> / <strong>{DEMO_USER.password}</strong>
        </p>
        <p className="auth-switch">
          New to Zomato? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { clearAuthFeedback, signup } from '../features/auth/authSlice'
import { brandLogo } from '../data'

function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, error } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  useEffect(() => {
    dispatch(clearAuthFeedback())
  }, [dispatch])

  useEffect(() => {
    if (user) navigate('/ncr/restaurants', { replace: true })
  }, [user, navigate])

  const updateField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      }),
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <img src={brandLogo} alt="zomato" />
        </Link>
        <h1>Sign up</h1>
        <p className="auth-subtitle">Create your account to start ordering.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" value={form.name} onChange={updateField('name')} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={updateField('email')} required />
          </label>
          <label>
            Phone
            <input type="tel" value={form.phone} onChange={updateField('phone')} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={updateField('password')}
              required
              minLength={6}
            />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" className="auth-submit">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage

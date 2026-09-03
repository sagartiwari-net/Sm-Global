import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineX } from 'react-icons/hi'
import { closeLogin } from '../features/ui/uiSlice'
import { login } from '../features/auth/authSlice'

export default function LoginModal() {
  const open = useSelector((s) => s.ui.loginOpen)
  const dispatch = useDispatch()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    if (!phone.trim()) return
    dispatch(
      login({
        name: name.trim() || 'SmmMynta User',
        phone: phone.trim(),
      }),
    )
    dispatch(closeLogin())
    setPhone('')
    setName('')
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close login"
        onClick={() => dispatch(closeLogin())}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded bg-white shadow-xl animate-fade-in">
        <button
          type="button"
          className="absolute right-3 top-3 z-10"
          onClick={() => dispatch(closeLogin())}
          aria-label="Close"
        >
          <HiOutlineX size={22} />
        </button>
        <div className="bg-gradient-to-r from-[#ffeef2] to-[#fff5e6] px-8 py-8">
          <h2 className="text-2xl font-bold text-smm-text">Login</h2>
          <p className="mt-1 text-sm text-smm-muted">
            or <span className="font-semibold text-smm-pink">create an account</span>
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4 px-8 py-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-smm-muted">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-smm-border px-3 py-2.5 text-sm outline-none focus:border-smm-text"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-smm-muted">Mobile Number*</label>
            <div className="flex border border-smm-border focus-within:border-smm-text">
              <span className="border-r border-smm-border px-3 py-2.5 text-sm text-smm-muted">+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-3 py-2.5 text-sm outline-none"
                placeholder="Mobile Number"
                required
              />
            </div>
          </div>
          <p className="text-[11px] text-smm-muted">
            By continuing, I agree to the Terms of Use & Privacy Policy
          </p>
          <button
            type="submit"
            className="w-full bg-smm-pink py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-smm-pink-dark"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

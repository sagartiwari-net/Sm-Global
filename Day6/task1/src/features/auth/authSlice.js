import { createSlice } from '@reduxjs/toolkit'
import { DEMO_USER } from '../../data'

const USERS_KEY = 'zomato_users'
const SESSION_KEY = 'zomato_session'

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!session) return null
    // Keep demo profile assets in sync after re-seed
    if (session.email === DEMO_USER.email) {
      return {
        ...session,
        name: DEMO_USER.name,
        phone: DEMO_USER.phone,
        avatar: DEMO_USER.avatar,
        cover: DEMO_USER.cover,
      }
    }
    return session
  } catch {
    return null
  }
}

function seedDemoUser() {
  const users = readUsers()
  const idx = users.findIndex((u) => u.email === DEMO_USER.email)
  if (idx === -1) {
    users.push({ ...DEMO_USER })
  } else {
    users[idx] = { ...users[idx], ...DEMO_USER }
  }
  saveUsers(users)
}

seedDemoUser()

const initialState = {
  user: readSession(),
  error: null,
  message: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthFeedback: (state) => {
      state.error = null
      state.message = null
    },
    signup: (state, action) => {
      const { name, email, password, phone } = action.payload
      const users = readUsers()
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        state.error = 'An account with this email already exists'
        state.message = null
        return
      }
      const user = { name, email, password, phone }
      users.push(user)
      saveUsers(users)
      const session = { name, email, phone, avatar: null, cover: null }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      state.user = session
      state.error = null
      state.message = 'Account created successfully'
    },
    login: (state, action) => {
      const { email, password } = action.payload
      const users = readUsers()
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )
      if (!found) {
        state.error = 'Invalid email or password'
        state.message = null
        state.user = null
        return
      }
      const session = {
        name: found.name,
        email: found.email,
        phone: found.phone,
        avatar: found.avatar || null,
        cover: found.cover || null,
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      state.user = session
      state.error = null
      state.message = 'Logged in successfully'
    },
    logout: (state) => {
      localStorage.removeItem(SESSION_KEY)
      state.user = null
      state.error = null
      state.message = null
    },
  },
})

export const { clearAuthFeedback, signup, login, logout } = authSlice.actions
export default authSlice.reducer

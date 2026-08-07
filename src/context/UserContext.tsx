import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface User {
  id_user: string
  username: string
  email: string
  status: string
  type: string
  configuration: Record<string, unknown>
}

interface UserContextType {
  user: User | null
  loading: boolean
  getUser: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (data: { user: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const PREDEFINED_USER = { id_user: '1', username: 'admin', email: 'admin@example.com', status: 'active', type: 'user', configuration: {} }
const PREDEFINED_PASSWORD = 'admin123'
const SESSION_KEY = 'notes_session'

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const getUser = useCallback(async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300))
    const session = localStorage.getItem(SESSION_KEY)
    if (session === 'true') {
      setUser(PREDEFINED_USER)
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500))
    if (email === PREDEFINED_USER.email && password === PREDEFINED_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'true')
      setUser(PREDEFINED_USER)
      console.log('user login')
      return true
    }
    return false
  }, [])

  const register = useCallback(async (data: { user: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 300))
    console.log('register', data)
  }, [])

  const logout = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 200))
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    console.log('Login finish')
  }, [])

  useEffect(() => { getUser() }, [getUser])

  return (
    <UserContext.Provider value={{ user, loading, getUser, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

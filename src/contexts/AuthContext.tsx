import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Hardcoded credentials for now
    if (email === 'krishna@gmail.com' && password === '123123') {
      const user: User = {
        id: '1',
        name: 'Krishna',
        email: 'krishna@gmail.com'
      }
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('auth_user', JSON.stringify(user))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    // Basic validation
    if (!name || !email || !password || password !== confirmPassword) {
      return false
    }
    
    // For now, create user with provided details
    const user: User = {
      id: Date.now().toString(),
      name,
      email
    }
    setUser(user)
    setIsAuthenticated(true)
    localStorage.setItem('auth_user', JSON.stringify(user))
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('auth_user')
  }

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}